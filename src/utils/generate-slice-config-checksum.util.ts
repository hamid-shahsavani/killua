import { TConfig } from '../types/config.type';
import * as CryptoJS from 'crypto-js';

export default function generateSliceConfigChecksum<TSlice>(params: {
  config: TConfig<TSlice>;
}): string {
  // generate md5 checksum with slice config (exclude `events`, `selectors`, `reducers`)
  const sliceConfigChecksum: string = CryptoJS.MD5(
    JSON.stringify({
      ...params.config,
      events: {},
      selectors: {},
      reducers: {},
    }),
  ).toString();

  return sliceConfigChecksum;
}
