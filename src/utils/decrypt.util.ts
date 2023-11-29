import * as CryptoJS from 'crypto-js';

export default function decrypt(params: {
  data: any;
  default: any;
  saltKey: string;
  localstorageKey: string;
}): string {
  try {
    const decryptedData = CryptoJS.AES.decrypt(
      params.data,
      params.saltKey,
    ).toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedData);
  } catch (error) {
    localStorage.removeItem(params.localstorageKey);
    return params.default;
  }
}
