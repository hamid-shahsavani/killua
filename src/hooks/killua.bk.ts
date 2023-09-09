import * as CryptoJS from "crypto-js";
import { useEffect, useRef, useState } from "react";
import { ThunderType } from "../types/thunder.type";

function useKillua<T>(args: ThunderType): {
  thunder: T;
  setThunder: (value: T | ((value: T) => T)) => void;
  isReady: Boolean;
  actions: Record<string, Function>;
} {
  // current thunder key name in localstorage
  function getThunderKeyName(): string {
    return `thunder${args.key.charAt(0).toUpperCase()}${args.key.slice(1)}`;
  }

  // generate uniqe browser id for encrypt key
  function getUniqeBrowserId(): string {
    const browserInfo =
      window.navigator.userAgent.match(
        /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i
      ) || [];
    const browserName = browserInfo[1].toLowerCase();
    const browserVersion = browserInfo[2];
    return `${browserName}${browserVersion}${window.navigator.userAgent}`;
  }

  // set data to localstorage
  function setDataToLocalstorage(
    data: any,
    key: string,
    encrypt: boolean
  ): void {
    localStorage.setItem(
      key,
      encrypt
        ? CryptoJS.AES.encrypt(
            JSON.stringify(data),
            getUniqeBrowserId()
          ).toString()
        : data
    );
  }

  // get 'thunderExpire' from localStorage
  const getThunderExpireLocalstorage = (): Object => {
    let parsedValue = {};
    const localStorageValue = localStorage.getItem("thunderExpire");
    const removeAllThundersFromLocalstorage = () => {
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
    };
    if (localStorageValue) {
      try {
        parsedValue = JSON.parse(
          CryptoJS.AES.decrypt(localStorageValue, getUniqeBrowserId()).toString(
            CryptoJS.enc.Utf8
          )
        );
      } catch {
        // delete all localStorage keys starting with 'thunder'
        removeAllThundersFromLocalstorage();
        // create 'thunderExpire' with an empty object encrypted
        setDataToLocalstorage({}, "thunderExpire", true);
      }
    } else {
      // delete all localStorage keys starting with 'thunder'
      removeAllThundersFromLocalstorage();
      // create 'thunderExpire' with an empty object encrypted
      setDataToLocalstorage({}, "thunderExpire", true);
    }
    return parsedValue;
  };
  // set expire time and remove expired thunder from localstorage
  const thunderExpireLocalstorage = getThunderExpireLocalstorage();

  // get thunder value from localstorage
  function getThunderFromLocalstorage(): string {
    let parsedValue = args.default;
    const localStorageValue = localStorage.getItem(getThunderKeyName());
    if (localStorageValue) {
      try {
        parsedValue = JSON.parse(
          args.encrypt
            ? CryptoJS.AES.decrypt(
                localStorageValue,
                getUniqeBrowserId()
              ).toString(CryptoJS.enc.Utf8)
            : localStorageValue
        );
      } catch {
        setDataToLocalstorage(args.default, getThunderKeyName(), args.encrypt);
      }
    } else {
      Object(thunderExpireLocalstorage)[getThunderKeyName()] =
        args.expire === null ? null : Date.now() + args.expire * 60 * 1000;
      setDataToLocalstorage(thunderExpireLocalstorage, "thunderExpire", true);
    }
    return parsedValue;
  }

  // detect thunder config changed by developer and create again thunder key in localstorage
  function detectThunderConfigChangedByDeveloperHandler(): void {
    // set current thunder with default value to localstorage
    setDataToLocalstorage(args.default, getThunderKeyName(), args.encrypt);
    // set current thunder expire time to localstorage
    if (thunderExpireLocalstorage) {
      Object(thunderExpireLocalstorage)[getThunderKeyName()] =
        args.expire === null ? null : Date.now() + args.expire * 60 * 1000;
      setDataToLocalstorage(thunderExpireLocalstorage, "thunderExpire", true);
    }
    // reload after change thunder config
    window.location.reload();
  }
  const prevExpireArgRef = useRef<ThunderType | null>(null);
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (!isFirstRender.current && prevExpireArgRef.current !== args) {
      setTimeout(detectThunderConfigChangedByDeveloperHandler, 1000);
    }
    prevExpireArgRef.current = args;
    isFirstRender.current = false;
  }, [args]);

  // get thunder value from localstorage for initial value of thunderState
  const [thunder, setThunder] = useState<any>(
    typeof window === "undefined" ? undefined : getThunderFromLocalstorage()
  );
  useEffect((): void => {
    if (thunder === undefined) {
      setThunder(getThunderFromLocalstorage());
    }
  }, []);

  // set expire time and remove expired thunder from localstorage
  useEffect(() => {
    console.log("thunderExpireLocalstorage", thunderExpireLocalstorage);
    let intervalId: any;
    let logIntervalId: any;
    // if 'args.key' is not in 'thunderExpire' object && push it to 'thunderExpire' with expire time
    if (
      Object(thunderExpireLocalstorage)[getThunderKeyName()] === undefined
    ) {
      Object(thunderExpireLocalstorage)[getThunderKeyName()] =
        args.expire === null ? null : Date.now() + args.expire * 60 * 1000;
      setDataToLocalstorage(thunderExpireLocalstorage, "thunderExpire", true);
    }
    // if date.now > expire time ? remove thunder expired from localStorage and 'thunderExpire' object : setInterval for remove from localStorage and 'thunderExpire' object
    if (
      thunderExpireLocalstorage &&
      Object(thunderExpireLocalstorage)[getThunderKeyName()] !== null
    ) {
      // function for remove from localStorage and 'thunderExpire'
      function removeThunderExpiredThunder() {
        setThunder(args.default);
        setDataToLocalstorage(args.default, getThunderKeyName(), args.encrypt);
        Object(thunderExpireLocalstorage)[getThunderKeyName()] =
        args.expire === null ? null : Date.now() + args.expire * 60 * 1000;
        setDataToLocalstorage(thunderExpireLocalstorage, "thunderExpire", true);
      }
      // if thunder expire ? remove it from localStorage and 'thunderExpire' object : setInterval for remove from localStorage and 'thunderExpire' object
      if (Date.now() > Object(thunderExpireLocalstorage)[getThunderKeyName()]) {
        removeThunderExpiredThunder();
      } else {
        logIntervalId = setInterval(() => {
            console.log(getThunderKeyName(), Object(thunderExpireLocalstorage)[getThunderKeyName()] - Date.now());
        }, 1000);
        intervalId = setInterval(() => {
          removeThunderExpiredThunder();
        }, Object(thunderExpireLocalstorage)[getThunderKeyName()] - Date.now());
      }
    }

    return (): void => {
      clearInterval(intervalId);
      clearInterval(logIntervalId);
    };
  }, [thunder]);

  // setThunder with updated localstorage value (call after update key in localstorage with setStateHandler function)
  useEffect((): (() => void) => {
    const getUpdatedThunderFromLocalstorage = (): void => {
      const localstorageValue = getThunderFromLocalstorage();
      if (localstorageValue !== thunder) {
        setThunder(localstorageValue);
      }
    };
    window.addEventListener("storage", () => {
      getUpdatedThunderFromLocalstorage();
    });
    return (): void => {
      window.removeEventListener("storage", () => {
        getUpdatedThunderFromLocalstorage();
      });
    };
  }, []);

  // set thunder value to localstorage (call after update thunder state in first set thunder initial value and after update thunder state with setThunder function)
  useEffect((): void => {
    if (thunder !== undefined) {
      setDataToLocalstorage(thunder, getThunderKeyName(), args.encrypt);
      window.dispatchEvent(new Event("storage"));
    }
  }, [thunder]);

  // assign thunder actions to actions object
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

  // return thunder state and setThunder function and isReady state and actions object
  function setStateHandler(value: any): void {
    if (typeof value === "function") {
      setThunder((prev: any) => value(prev));
    } else {
      setThunder(value);
    }
  }
  return {
    thunder: thunder,
    setThunder: (value: any) => {
      setStateHandler(value);
    },
    isReady: thunder === undefined ? false : true,
    actions,
  };
}

export default useKillua;
