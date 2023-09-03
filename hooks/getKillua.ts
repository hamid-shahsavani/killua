import * as CryptoJS from "crypto-js";
import { useEffect, useState } from "react";
import { ThunderType } from "../types/thunder.type";

function useGetKillua<T>(args: ThunderType): T {
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
  const [thunder, setThunder] = useState<any>(
    typeof window !== undefined ? undefined : getThunderFromLocalstorage()
  );
  useEffect(() => {
    if (thunder === undefined) {
      setThunder(getThunderFromLocalstorage());
    }
  }, []);

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

  return thunder;
}

export default useGetKillua;
