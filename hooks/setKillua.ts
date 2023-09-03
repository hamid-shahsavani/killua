import * as CryptoJS from "crypto-js";
import { useEffect, useState } from "react";
import { ThunderType } from "../types/thunder.type";

function useSetKillua<T>(args: ThunderType): (value: T) => void {
  // thunder with initial value
  const [thunder, setThunder] = useState<any>(undefined);

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
    setThunder(value);
    window.dispatchEvent(new Event("storage"));
  }

  // set thunder value to localstorage (call after update thunder state)
  useEffect(() => {
    if (thunder !== undefined) {
      setThunderToLocalstorageHandler(thunder);
    }
  }, [thunder]);

  return setThunder;
}

export default useSetKillua;
