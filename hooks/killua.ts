import { useState, useEffect } from "react";
import * as CryptoJS from "crypto-js";
import { ThunderType } from "../types/thunder.type";

function useKillua<T>(args: ThunderType): [T, (value: T | ((value: T) => T)) => void] {
  // genrate uniqe browser id for encrypt key
  function uniqeBrowserId() {
    const browserInfo =
      window.navigator.userAgent.match(
        /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i
      ) || [];
    const browserName = browserInfo[1].toLowerCase();
    const browserVersion = browserInfo[2];
    return `${browserName}${browserVersion}${window.navigator.userAgent}`;
  }

  // set thunder value to localstorage
  function setThunderToLocalstorageHandler(value: any) {
    localStorage.setItem(
      args.key,
      args.encrypt
        ? CryptoJS.AES.encrypt(JSON.stringify(value), uniqeBrowserId())
        : thunder
    );
    window.dispatchEvent(new Event("storage"));
  }

  // get thunder value from localstorage
  function getThunderFromLocalstorage() {
    let parsedValue = args.default;
    const localStorageValue = localStorage.getItem(args.key);
    if (localStorageValue) {
      try {
        parsedValue = JSON.parse(
          args.encrypt
            ? CryptoJS.AES.decrypt(
                localStorageValue,
                uniqeBrowserId()
              ).toString(CryptoJS.enc.Utf8)
            : localStorageValue
        );
      } catch {
        localStorage.removeItem(args.key);
      }
    }
    return parsedValue;
  }

  // get thunder value from localstorage (initial value)
  const [thunder, setThunder] = useState<any>(typeof window !== undefined ? undefined : getThunderFromLocalstorage());
  useEffect(() => {
    if(thunder === undefined) {
      setThunder(getThunderFromLocalstorage());
    }
  }, []);

  // set thunder value to localstorage (call after update thunder state)
  useEffect(() => {
    if (thunder !== undefined) {
      setThunderToLocalstorageHandler(thunder);
    }
  }, [thunder]);

  // get thunder value from localstorage (call after update thunder state)
  useEffect(() => {
    const getUpdatedThunderFromLocalstorage = () => {
      const localstorageValue = getThunderFromLocalstorage();
      if (localstorageValue !== thunder) {
        setThunder(localstorageValue);
      }
    };
    window.addEventListener("storage", () => {
      getUpdatedThunderFromLocalstorage();
    });
    return () => {
      window.removeEventListener("storage", () => {
        getUpdatedThunderFromLocalstorage();
      });
    };
  }, []);

  const setThunderHandler = (value: any) => {
    if (typeof value === "function") {
      setThunder((prev: any) => {
        const updatedThunder = value(prev);
        return updatedThunder;
      });
    } else {
      setThunder(value);
    }
  };

  return [thunder, setThunderHandler];
}

export default useKillua;
