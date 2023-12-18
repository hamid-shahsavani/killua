import { storageKeys } from '../constants/storage-keys.constant';
import { TConfig } from '../types/config.type';
import encryptStorageData from './encrypt-storage-data.util';
import { getSaltKeyFromStorage } from './get-salt-key-from-storage.util';
import { getSlicesExpireTimeFromStorage } from './get-slices-expire-time-from-storage.util';
import timeStringToSeconds from './time-string-to-second.util';

export function setSliceExpireTimestamp<TSlice>(params: {
  config: TConfig<TSlice>;
}): number | null {
  // params.config.expire ? slice expire timestamp : null
  const sliceExpireTimestamp: null | number = params.config.expire
    ? Date.now() +
      timeStringToSeconds({ timeString: params.config.expire }) * 1000
    : null;

  // set `storageKeys.slicesExpireTime` with current slice expire timestamp to storage
  const storageValue: Record<string, number> = getSlicesExpireTimeFromStorage({
    config: params.config,
  });
  if (sliceExpireTimestamp) {
    storageValue[params.config.key] = sliceExpireTimestamp;
  }
  localStorage.setItem(
    storageKeys.slicesExpireTime,
    encryptStorageData({
      data: storageValue,
      saltKey: getSaltKeyFromStorage(),
    }),
  );

  return sliceExpireTimestamp;
}
