import * as CryptoJS from 'crypto-js';

export default function decrypt(params: { data: string; key: string }): string {
  return CryptoJS.AES.decrypt(params.data, params.key).toString(
    CryptoJS.enc.Utf8,
  );
}
