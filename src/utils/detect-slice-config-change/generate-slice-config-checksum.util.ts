import { TConfig } from '../../types/config.type';
import * as CryptoJS from 'crypto-js';

export default function generateSliceConfigChecksum<TSlice>(params: {
  config: TConfig<TSlice>;
}): string {
  // generate md5 checksum with slice config (exclude `key`, `events`, `selectors`, `reducers`, `schema`)
  const sliceConfigChecksum: string = CryptoJS.MD5(
    JSON.stringify({
      ...params.config,
      key: undefined,
      events: undefined,
      selectors: undefined,
      reducers: undefined,
      schema: undefined,
    }),
  ).toString();

  return sliceConfigChecksum;
}
