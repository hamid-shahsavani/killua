import * as CryptoJS from 'crypto-js';

export default function decrypt(params: {
  data: any;
  saltKey: string;
}): string {
  return JSON.parse(
    CryptoJS.AES.decrypt(params.data, params.saltKey).toString(
      CryptoJS.enc.Utf8,
    ),
  );
}
