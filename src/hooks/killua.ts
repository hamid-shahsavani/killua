import * as CryptoJS from "crypto-js";
import { useEffect, useState } from "react";
import { useSSRKillua } from "../providers/ssr";
import { ThunderType } from "../types/thunder.type";

function useKillua<T>(args: ThunderType): {
  thunder: T;
  setThunder: (value: T | ((value: T) => T)) => void;
  reducers: Record<string, Function>;
  selectors: Record<string, Function>;
  isReadyInSsr?: Boolean;
} {
  //* current thunder key name in localstorage
  const thunderKeyName = `thunder${args.key
    .charAt(0)
    .toUpperCase()}${args.key.slice(1)}`;

  //* generate uniqe browser id for salt key
  function getUniqeBrowserId(): string {
    const browserInfo =
      window.navigator.userAgent.match(
        /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i
      ) || [];
    const browserName = browserInfo[1].toLowerCase();
    const browserVersion = browserInfo[2];
    return `${browserName}${browserVersion}${window.navigator.userAgent}`;
  }

  //* set to localstorage
  function setToLocalstorage(args: {
    key: string;
    data: any;
    encrypt: boolean;
  }): void {
    localStorage.setItem(
      args.key,
      args.encrypt
        ? CryptoJS.AES.encrypt(
            JSON.stringify(args.data),
            getUniqeBrowserId()
          ).toString()
        : JSON.stringify(args.data)
    );
  }

  //* get thunder from localstorage
  function getThunderFromLocalstorage(): any {
    if (typeof window === "undefined")
      throw new Error(
        "please wrap your app with <SSRKilluaProvider></SSRKilluaProvider> in ssr"
      );
    let parsedValue = args.default;
    const localStorageValue = localStorage.getItem(thunderKeyName);
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
        setThunderToLocalstorageAndStateHandler({
          key: thunderKeyName,
          data: args.default,
          encrypt: args.encrypt,
        });
      }
    } else {
      setThunderToLocalstorageAndStateHandler({
        key: thunderKeyName,
        data: args.default,
        encrypt: args.encrypt,
      });
    }
    return parsedValue;
  }

  //* get 'thundersExpire' from localStorage
  const getThundersExpireFromLocalstorage = (): Object => {
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
    let parsedValue = {};
    const localStorageValue = localStorage.getItem("thundersExpire");
    if (localStorageValue) {
      try {
        parsedValue = JSON.parse(
          CryptoJS.AES.decrypt(localStorageValue, getUniqeBrowserId()).toString(
            CryptoJS.enc.Utf8
          )
        );
      } catch {
        setToLocalstorage({
          key: "thundersExpire",
          data: {},
          encrypt: true,
        });
        removeAllThundersFromLocalstorage();
      }
    } else {
      setToLocalstorage({
        key: "thundersExpire",
        data: {},
        encrypt: true,
      });
      removeAllThundersFromLocalstorage();
    }
    return parsedValue;
  };

  //* get 'thundersChecksum' from localStorage
  function getThundersChecksumFromLocalstorage(): Object {
    let parsedValue = {};
    const localStorageValue = localStorage.getItem("thundersChecksum");
    if (localStorageValue) {
      try {
        parsedValue = JSON.parse(
          CryptoJS.AES.decrypt(localStorageValue, getUniqeBrowserId()).toString(
            CryptoJS.enc.Utf8
          )
        );
      } catch {
        setToLocalstorage({
          key: "thundersChecksum",
          data: {},
          encrypt: true,
        });
      }
    } else {
      setToLocalstorage({
        key: "thundersChecksum",
        data: {},
        encrypt: true,
      });
    }
    return parsedValue;
  }

  //* detect change thunder config by developer and create again thunder key in localstorage
  useEffect(() => {
    const thundersChecksumLocalstorage = getThundersChecksumFromLocalstorage();
    // update thunder checksum in localStorage && reset thunder-key&thunder-state to default value handler
    const updateThunderChecksumHandler = (): void => {
      Object(thundersChecksumLocalstorage)[thunderKeyName] = CryptoJS.MD5(
        JSON.stringify(args)
      ).toString();
      setToLocalstorage({
        key: "thundersChecksum",
        data: thundersChecksumLocalstorage,
        encrypt: true,
      });
      setThunderToLocalstorageAndStateHandler({
        key: thunderKeyName,
        data: args.default,
        encrypt: args.encrypt,
      });
    };
    // update expire time in 'thundersExpire' object
    function updateExpireTimeHandler(): void {
      const thundersExpireLocalstorage = getThundersExpireFromLocalstorage();
      Object(thundersExpireLocalstorage)[thunderKeyName] =
        args.expire === null ? null : Date.now() + args.expire * 60 * 1000;
      setToLocalstorage({
        key: "thundersExpire",
        data: thundersExpireLocalstorage,
        encrypt: true,
      });
    }
    // if 'thundersChecksum' is not in localStorage ? (add key to 'thundersChecksum' with checksum && update thunder expire with args.expire && reset thunder-key&thunder-state to default value) : (if changed thunder config by developer && (update checksum && reset thunder-key&thunder-state to default value))
    if (!thundersChecksumLocalstorage.hasOwnProperty(thunderKeyName)) {
      updateThunderChecksumHandler();
      updateExpireTimeHandler();
    } else {
      if (
        Object(thundersChecksumLocalstorage)[thunderKeyName] !==
        CryptoJS.MD5(JSON.stringify(args)).toString()
      ) {
        updateThunderChecksumHandler();
        updateExpireTimeHandler();
      }
    }
  }, []);

  //* thunder state with initial-value from localstorage
  const isServer = useSSRKillua();
  const [thunderState, setThunderState] = useState<any>(
    isServer ? undefined : getThunderFromLocalstorage()
  );
  useEffect(() => {
    if (thunderState === undefined) {
      if (
        Object(getThundersChecksumFromLocalstorage())[thunderKeyName] ===
        CryptoJS.MD5(JSON.stringify(args)).toString()
      ) {
        const thunderLocalstorageValue = getThunderFromLocalstorage();
        if (thunderLocalstorageValue !== thunderState) {
          setThunderState(getThunderFromLocalstorage());
        }
      }
    }
  }, []);

  //* set thunder to localstorage and state handler
  function setThunderToLocalstorageAndStateHandler(args: {
    key: string;
    data: T;
    encrypt: boolean;
  }): void {
    setToLocalstorage({
      key: thunderKeyName,
      data: args.data,
      encrypt: args.encrypt,
    });
    setThunderState(args.data);
  }

  //* update thunder state in other browser tab with updated localstorage value
  useEffect(() => {
    const getUpdatedThunderFromLocalstorage = (): void => {
      if (
        Object(getThundersChecksumFromLocalstorage())[thunderKeyName] ===
        CryptoJS.MD5(JSON.stringify(args)).toString()
      ) {
        const thunderLocalstorageValue = getThunderFromLocalstorage();
        if (thunderLocalstorageValue !== thunderState) {
          setThunderState(getThunderFromLocalstorage());
        }
      }
    };
    window.addEventListener("storage", getUpdatedThunderFromLocalstorage);
    return (): void => {
      window.removeEventListener("storage", getUpdatedThunderFromLocalstorage);
    };
  }, []);

  //* set expire time and remove expired thunder from localstorage
  useEffect(() => {
    let intervalId: any;
    const thundersExpireLocalstorage = getThundersExpireFromLocalstorage();
    // function for set expire time to 'thundersExpire' object
    function addThunderToThundersExpireLocalstorageHandler() {
      Object(thundersExpireLocalstorage)[thunderKeyName] =
        args.expire === null ? null : Date.now() + args.expire * 60 * 1000;
      setToLocalstorage({
        key: "thundersExpire",
        data: thundersExpireLocalstorage,
        encrypt: true,
      });
    }
    // function for remove expired thunder from localStorage and 'thundersExpire'
    function removeExpiredThunderHandler() {
      setThunderToLocalstorageAndStateHandler({
        key: thunderKeyName,
        data: args.default,
        encrypt: args.encrypt,
      });
      addThunderToThundersExpireLocalstorageHandler();
    }
    // if thunder is not in 'thundersExpire' object && push it to 'thundersExpire' with expire time
    if (!thundersExpireLocalstorage.hasOwnProperty(thunderKeyName)) {
      addThunderToThundersExpireLocalstorageHandler();
    }
    // if thunder is with expired time in 'thundersExpire' object ? (if thunder expired ? remove from localStorage and 'thundersExpire' object) : (setInterval for remove from localStorage and 'thundersExpire' object)
    if (Object(thundersExpireLocalstorage)[thunderKeyName]) {
      if (Date.now() > Object(thundersExpireLocalstorage)[thunderKeyName]) {
        removeExpiredThunderHandler();
      } else {
        intervalId = setInterval(() => {
          removeExpiredThunderHandler();
        }, Object(thundersExpireLocalstorage)[thunderKeyName] - Date.now());
      }
    }
    return (): void => {
      clearInterval(intervalId);
    };
  }, [thunderState]);

  //* return thunder state and setThunder state function and detect isReady thunder state and reducers object
  // assign thunder config reducers to reducers object
  const reducers: Record<string, Function> = {};
  if (args.reducers) {
    for (const actionName in args.reducers) {
      if (Object.prototype.hasOwnProperty.call(args.reducers, actionName)) {
        const actionFunc = args.reducers[actionName];
        reducers[actionName] = (payload: any) => {
          setThunderToLocalstorageAndStateHandler({
            key: thunderKeyName,
            data: (actionFunc as (prev: T, payload: any) => T)(
              thunderState,
              payload
            ),
            encrypt: args.encrypt,
          });
        };
      }
    }
  }
  // assign thunder config selectors to selectors with object
  const selectors: Record<string, Function> = {};
  if (args.selectors) {
    for (const selectorName in args.selectors) {
      if (Object.prototype.hasOwnProperty.call(args.selectors, selectorName)) {
        const selectorFunc = args.selectors[selectorName];
        selectors[selectorName] = (payload: any) =>
          (selectorFunc as (prev: T, payload: any) => any)(
            thunderState,
            payload
          );
      }
    }
  }
  // handler for update thunder state
  function setThunderHandler(value: T | ((prev: T) => T)): void {
    if (typeof value === "function") {
      setThunderToLocalstorageAndStateHandler({
        key: thunderKeyName,
        data: (value as (prev: T) => T)(thunderState),
        encrypt: args.encrypt,
      });
    } else {
      setThunderToLocalstorageAndStateHandler({
        key: thunderKeyName,
        data: value,
        encrypt: args.encrypt,
      });
    }
  }
  return {
    thunder: thunderState,
    setThunder: setThunderHandler,
    reducers,
    selectors,
    isReadyInSsr: thunderState !== undefined,
  };
}

export default useKillua;
