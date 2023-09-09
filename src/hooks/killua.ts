import * as CryptoJS from "crypto-js";
import { useEffect, useRef, useState } from "react";
import { ThunderType } from "../types/thunder.type";

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
function setToLocalstorage<T>(args: {
  key: string;
  data: T;
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

//* get from localstorage
function getFromLocalstorage<T>(args: {
  key: string;
  default: T;
  encrypt: boolean;
}): T {
  let parsedValue = args.default;
  const localStorageValue = localStorage.getItem(args.key);
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
      setToLocalstorage<T>({
        key: args.key,
        data: args.default,
        encrypt: args.encrypt,
      });
    }
  } else {
    setToLocalstorage<T>({
      key: args.key,
      data: args.default,
      encrypt: args.encrypt,
    });
  }
  return parsedValue;
}

function useKillua<T>(args: ThunderType): {
  thunder: T;
  setThunder: (value: T | ((value: T) => T)) => void;
  isReady: Boolean;
  actions: Record<string, Function>;
} {
  //* current thunder key name in localstorage
  const thunderKeyName = `thunder${args.key
    .charAt(0)
    .toUpperCase()}${args.key.slice(1)}`;

  //* detect thunder config changed by developer and create again thunder key in localstorage
  function detectThunderConfigChangedByDeveloperHandler(): void {
    if(JSON.stringify(prevArgsRef.current) !== JSON.stringify(args)) {
      console.log(args);
      // set current thunder with default value to localstorage and state
      setThunderToLocalstorageAndStateHandler({
        key: thunderKeyName,
        data: args.default,
        encrypt: args.encrypt,
      });
    }
  }
  const prevArgsRef = useRef<ThunderType | null>(null);
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (!isFirstRender.current) {
      detectThunderConfigChangedByDeveloperHandler();
    }
    prevArgsRef.current = args;
    isFirstRender.current = false;
  }, [args]);

  //* thunder state with initial-value from localstorage
  const [thunderState, setThunderState] = useState<any>((): any =>
    typeof window === "undefined"
      ? undefined
      : getFromLocalstorage<T>({
          key: thunderKeyName,
          default: args.default,
          encrypt: args.encrypt,
        })
  );
  const isMountedRef = useRef(false);
  useEffect(() => {
    if (!isMountedRef.current) {
      if (thunderState === undefined) {
        setThunderState(
          getFromLocalstorage({
            key: thunderKeyName,
            default: args.default,
            encrypt: args.encrypt,
          })
        );
      }
      isMountedRef.current = true;
    }
  }, []);

  //* set thunder to localstorage and state handler
  function setThunderToLocalstorageAndStateHandler(args: {
    key: string;
    data: T;
    encrypt: boolean;
  }): void {
    setToLocalstorage<T>(args);
    setThunderState(args.data);
  }

  //* update thunder state in other browser tab with updated localstorage value
  useEffect(() => {
    const getUpdatedThunderFromLocalstorage = (): void => {
      const localstorageValue = getFromLocalstorage<T>({
        key: thunderKeyName,
        default: args.default,
        encrypt: args.encrypt,
      });
      if (localstorageValue !== thunderState) {
        setThunderState(localstorageValue);
      }
    };
    window.addEventListener("storage", getUpdatedThunderFromLocalstorage);
    return (): void => {
      window.removeEventListener("storage", getUpdatedThunderFromLocalstorage);
    };
  }, []);

  //* return thunder state and setThunder state function and detect isReady thunder state and actions object
  // assign thunder config actions to actions object
  const actions: Record<string, Function> = {};
  if (args.actions) {
    for (const actionName in args.actions) {
      if (Object.prototype.hasOwnProperty.call(args.actions, actionName)) {
        const actionFunc = args.actions[actionName];
        actions[actionName] = (payload: any) => {
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
    isReady: thunderState === undefined ? false : true,
    actions,
  };
}

export default useKillua;
