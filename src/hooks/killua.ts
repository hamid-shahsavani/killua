import * as CryptoJS from "crypto-js";
import { useEffect, useState } from "react";
import { ThunderType } from "../types/thunder.type";

function useKillua<T>(args: ThunderType): {
  value: T;
  setValue: (value: T | ((value: T) => T)) => void;
  isReady: Boolean;
  actions: Record<string, Function>;
} {
  // for genrate uniqe browser id for encrypt key
  function uniqeBrowserId(): string {
    const browserInfo =
      window.navigator.userAgent.match(
        /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i
      ) || [];
    const browserName = browserInfo[1].toLowerCase();
    const browserVersion = browserInfo[2];
    return `${browserName}${browserVersion}${window.navigator.userAgent}`;
  }

  // localstorage key for thunder
  const thunderKey = `thunder${args.key
    .charAt(0)
    .toUpperCase()}${args.key.slice(1)}`;

  // for get thunder value from localstorage
  function getThunderFromLocalstorage(): string {
    let parsedValue = args.default;
    // convert args.key to thunder + first letter uppercase
    const localStorageValue = localStorage.getItem(thunderKey);
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
        localStorage.removeItem(thunderKey);
      }
    }
    return parsedValue;
  }

  // for set expire time
  useEffect(() => {
    // check if 'thunderExpire' exists in localStorage and decrypt it, or set it to null if decryption fails
    const getThunderExpireLocalstorage = (): null | string => {
      let parsedValue = null;
      const localStorageValue = localStorage.getItem("thunderExpire");
      if (localStorageValue) {
        try {
          parsedValue = JSON.parse(
            CryptoJS.AES.decrypt(localStorageValue, uniqeBrowserId()).toString(
              CryptoJS.enc.Utf8
            )
          );
        } catch {
          localStorage.removeItem("thunderExpire");
        }
      }
      return parsedValue;
    };
    const thunderExpireLocalstorage = getThunderExpireLocalstorage();

    // check if 'thunderExpire' in localStorage
    if (!thunderExpireLocalstorage) {
      // create 'thunderExpire' with an empty object encrypted
      localStorage.setItem(
        "thunderExpire",
        CryptoJS.AES.encrypt(JSON.stringify({}), uniqeBrowserId()).toString()
      );
      // delete all localStorage keys starting with 'thunder'
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("thunder") && key !== "thunderExpire") {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((key) => {
        localStorage.removeItem(key);
      });
    }
    // check if 'args.key' is not in 'thunderExpireLocalstorage' && push it to 'thunderExpireLocalstorage'
    if (
      thunderExpireLocalstorage &&
      !Object(thunderExpireLocalstorage)[thunderKey]
    ) {
      Object(thunderExpireLocalstorage)[thunderKey] =
        args.expire === null ? null : Date.now() + args.expire * 60 * 1000;
      localStorage.setItem(
        "thunderExpire",
        CryptoJS.AES.encrypt(
          JSON.stringify(thunderExpireLocalstorage),
          uniqeBrowserId()
        ).toString()
      );
    }
    // date.now > expire time ? remove from localStorage and 'thunderExpire' : set timeout for remove from localStorage and 'thunderExpire'
    if (
      thunderExpireLocalstorage &&
      Object(thunderExpireLocalstorage)[thunderKey] !== null
    ) {
      // function for remove from localStorage and 'thunderExpire'
      const removeThunder = (): void => {
        setThunder(args.default);
        localStorage.setItem(thunderKey, args.default);
        Object(thunderExpireLocalstorage)[thunderKey] = Date.now() + Number(args.expire) * 60 * 1000;
        localStorage.setItem(
          "thunderExpire",
          CryptoJS.AES.encrypt(
            JSON.stringify(thunderExpireLocalstorage),
            uniqeBrowserId()
          ).toString()
        );
      };
      // Check if the expiration time has already passed
      if (Date.now() > Object(thunderExpireLocalstorage)[thunderKey]) {
        removeThunder();
      } else {
        setInterval(() => {
          console.log(thunderKey, Object(thunderExpireLocalstorage)[thunderKey] - Date.now());
        }, 1000);
        setInterval(() => {
          removeThunder();
        }, Object(thunderExpireLocalstorage)[thunderKey] - Date.now());
      }
    }
  }, []);

  // get thunder value from localstorage (initial value)
  const [thunder, setThunder] = useState<any>(
    typeof window !== undefined ? undefined : getThunderFromLocalstorage()
  );
  useEffect((): void => {
    if (thunder === undefined) {
      setThunder(getThunderFromLocalstorage());
    }
  }, []);

  // get updated thunder value from localstorage and set to thunderState (call after update localstorage value)
  useEffect((): void => {
    const localstorageValue = getThunderFromLocalstorage();
    if (localstorageValue !== thunder) {
      setThunder(localstorageValue);
    }
  }, []);

  // set thunder value to localstorage (call after update thunder state)
  useEffect((): void => {
    if (thunder !== undefined) {
      localStorage.setItem(
        thunderKey,
        args.encrypt
          ? CryptoJS.AES.encrypt(JSON.stringify(thunder), uniqeBrowserId())
          : thunder
      );
      window.dispatchEvent(new Event("storage"));
    }
  }, [thunder]);

  // assign the actions defined in args.actions to the actions object
  const actions: Record<string, Function> = {};
  if (args.actions) {
    for (const actionName in args.actions) {
      if (Object.prototype.hasOwnProperty.call(args.actions, actionName)) {
        const actionFunc = args.actions[actionName];
        actions[actionName] = (payload: any) => {
          setThunder((prevState: T) => actionFunc(prevState, payload));
        };
      }
    }
  }

  //change returned from [thunder, setThunder function, thunderStateIsReady] to { thunder: thunderState, setThunder: setThunderFunction, thunderStateIsReady: thunderStateIsReady }
  return {
    value: thunder,
    setValue: (value: any) => {
      if (typeof value === "function") {
        setThunder((prev: any) => value(prev));
      } else {
        setThunder(value);
      }
    },
    isReady: thunder === undefined ? false : true,
    actions,
  };
}

export default useKillua;