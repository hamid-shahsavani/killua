import * as CryptoJS from 'crypto-js';

export default function decrypt(params: {
  data: any;
  default: any;
  saltKey: string;
  localstorageKey: string;
  configKey?: string;
}): string {
  try {
    const decryptedData = CryptoJS.AES.decrypt(
      params.data,
      params.saltKey,
    ).toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedData);
  } catch (error) {
    // call broadcast channel with event `localstorage-value-not-valid-and-removed`
    if (params.configKey) {
      new BroadcastChannel('killua').postMessage({
        type: 'localstorage-value-not-valid-and-removed',
        key: params.configKey,
      });
    }
    // remove slice value from localstorage
    localStorage.removeItem(params.localstorageKey);
    // return default value
    return params.default;
  }
}
