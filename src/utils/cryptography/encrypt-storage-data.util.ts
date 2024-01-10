import * as CryptoJS from 'crypto-js';

export function encryptStorageData(params: {
  data: any;
  saltKey: string;
}): string {
  return CryptoJS.AES.encrypt(
    JSON.stringify(params.data),
    params.saltKey
  ).toString();
}
