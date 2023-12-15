import { TConfig } from '../types/config.type';
import encrypt from './encrypt.util';
import { getSaltKey } from './get-salt-key.util';
import { getSlicesExpireFromStorage } from './get-slices-expire-from-storage.util';
import timeStringToSeconds from './time-string-to-second.util';

export function setSliceExpireTimestamp<TSlice>(params: {
  config: TConfig<TSlice>;
}): number | null {
  // params.config.expire ? slice expire timestamp : null
  const sliceExpireTimestamp: null | number = params.config.expire
    ? Date.now() +
      timeStringToSeconds({ timeString: params.config.expire }) * 1000
    : null;

  // set `slices-expire` with current slice expire timestamp to storage
  const storageValue: Record<string, number> = getSlicesExpireFromStorage({
    config: params.config,
  });
  if (sliceExpireTimestamp) {
    storageValue[params.config.key] = sliceExpireTimestamp;
  }
  localStorage.setItem(
    'slices-expire-time',
    encrypt({
      data: storageValue,
      saltKey: getSaltKey(),
    }),
  );

  return sliceExpireTimestamp;
}
