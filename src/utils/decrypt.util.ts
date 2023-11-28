import * as CryptoJS from 'crypto-js';

export default function decrypt(params: {
  data: any;
  key: string;
  default: any;
}): string {
  try {
    const decryptedData = CryptoJS.AES.decrypt(
      params.data,
      params.key,
    ).toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedData);
  } catch (error) {
    return params.default;
  }
}
