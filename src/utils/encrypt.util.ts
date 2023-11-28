import * as CryptoJS from 'crypto-js';

export default function encrypt(params: { data: any; key: string }): string {
  return CryptoJS.AES.encrypt(
    JSON.stringify(params.data),
    params.key,
  ).toString();
}
