import { storageKeys } from '../../constants/storage-keys.constant';
import {
  TConfig,
  TDefaultServer,
  TReducers,
  TSelectors,
} from '../../types/config.type';
import decryptStorageData from '../cryptography/decrypt-storage-data.util';
import encryptStorageData from '../cryptography/encrypt-storage-data.util';
import { getSaltKeyFromStorage } from '../cryptography/get-salt-key-from-storage.util';
import timeStringToSeconds from './time-string-to-second.util';

function setSlicesExpireTimeKeyToStorage<
  GSlice,
  GDefaultServer extends TDefaultServer<GSlice>,
  GSelectors extends TSelectors<GSlice>,
  GReducers extends TReducers<GSlice>,
>(params: {
  config: TConfig<GSlice, GDefaultServer, GSelectors, GReducers>;
  defaultStorage: Record<string, number>;
}): void {
  localStorage.setItem(
    storageKeys.slicesExpireTime,
    encryptStorageData({
      data: params.defaultStorage,
      saltKey: getSaltKeyFromStorage(),
    }),
  );
}

export function getSlicesExpireTimeFromStorage<
  GSlice,
  GDefaultServer extends TDefaultServer<GSlice>,
  GSelectors extends TSelectors<GSlice>,
  GReducers extends TReducers<GSlice>,
>(params: {
  config: TConfig<GSlice, GDefaultServer, GSelectors, GReducers>;
}): Record<string, number> {
  // defaultStorage is ` params.config.expire && { [params.config.key]: slice expire timestamp } : null` (update after get `storageKeys.slicesExpireTime` from storage)
  let returnValue: Record<string, number> = {
    ...(params.config.expire && {
      [params.config.key]:
        Date.now() +
        timeStringToSeconds({ timeString: params.config.expire }) * 1000,
    }),
  };

  // get slices expire timestamp from storage ((if not exist || is-not valid) && set `storageKeys.slicesExpireTime` key to storage)
  try {
    const storageValue: string | null = localStorage.getItem(
      storageKeys.slicesExpireTime,
    );
    if (storageValue) {
      const decryptedStorageValue: Record<string, number> = decryptStorageData({
        data: storageValue,
        saltKey: getSaltKeyFromStorage(),
      });
      returnValue = decryptedStorageValue;
    } else {
      setSlicesExpireTimeKeyToStorage({
        config: params.config,
        defaultStorage: returnValue,
      });
    }
  } catch (error) {
    setSlicesExpireTimeKeyToStorage({
      config: params.config,
      defaultStorage: returnValue,
    });
  }

  return returnValue;
}
