import * as CryptoJS from 'crypto-js';

export default function encrypt(params: { data: string; key: string }): string {
  return CryptoJS.AES.encrypt(params.data, params.key).toString();
}
