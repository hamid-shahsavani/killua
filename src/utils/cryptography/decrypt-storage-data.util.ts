import * as CryptoJS from "crypto-js";

export default function decryptStorageData(params: { data: any; saltKey: string }): any {
  return JSON.parse(CryptoJS.AES.decrypt(params.data, params.saltKey).toString(CryptoJS.enc.Utf8));
}
