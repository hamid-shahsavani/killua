import * as CryptoJS from "crypto-js";
import { useEffect, useState } from "react";
import { ThunderType } from "../types/thunder.type";

function useKillua<T>(
  args: ThunderType
): [T, (value: T | ((value: T) => T)) => void, Boolean] {
  // for genrate uniqe browser id for encrypt key
  function uniqeBrowserId() {
    const browserInfo =
      window.navigator.userAgent.match(
        /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i
      ) || [];
    const browserName = browserInfo[1].toLowerCase();
    const browserVersion = browserInfo[2];
    return `${browserName}${browserVersion}${window.navigator.userAgent}`;
  }

  // for get thunder value from localstorage
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
  const [thunder, setThunder] = useState<any>(
    typeof window !== undefined ? undefined : getThunderFromLocalstorage()
  );
  useEffect(() => {
    if (thunder === undefined) {
      setThunder(getThunderFromLocalstorage());
    }
  }, []);

  // get updated thunder value from localstorage and set to thunderState (call after update localstorage value)
  useEffect(() => {
    const getUpdatedThunderFromLocalstorage = () => {
      const localstorageValue = getThunderFromLocalstorage();
      if (localstorageValue !== thunder) {
        setThunder(localstorageValue);
      }
    };
    window.addEventListener("storage", (e: StorageEvent) => {
      getUpdatedThunderFromLocalstorage();
    });
    return () => {
      window.removeEventListener("storage", (e: StorageEvent) => {
        getUpdatedThunderFromLocalstorage();
      });
    };
  }, []);

  // set thunder value to localstorage (call after update thunder state)
  useEffect(() => {
    if (thunder !== undefined) {
      localStorage.setItem(
        args.key,
        args.encrypt
          ? CryptoJS.AES.encrypt(JSON.stringify(thunder), uniqeBrowserId())
          : thunder
      );
      window.dispatchEvent(new Event("storage"));
    }
  }, [thunder]);

  // returned [thunder, setThunder function, thunderStateIsReady]
  return [
    thunder,
    (value: any) => {
      if (typeof value === "function") {
        setThunder((prev: any) => value(prev));
      } else {
        setThunder(value);
      }
    },
    thunder === undefined ? false : true,
  ];
}

export default useKillua;
