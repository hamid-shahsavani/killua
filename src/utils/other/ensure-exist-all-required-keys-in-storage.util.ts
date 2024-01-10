import { storageKeys } from '../../constants/storage-keys.constant';
import {
  TConfig,
  TDefaultServer,
  TReducers,
  TSelectors
} from '../../types/config.type';
import { decryptStorageData } from '../cryptography/decrypt-storage-data.util';
import { encryptStorageData } from '../cryptography/encrypt-storage-data.util';
import { getSaltKeyFromStorage } from '../cryptography/get-salt-key-from-storage.util';
import { generateSliceConfigChecksum } from '../detect-slice-config-change/generate-slice-config-checksum.util';
import { timeStringToSeconds } from '../slice-expire-timer/time-string-to-second.util';
import { removeAllSlicesFromStorage } from './remove-all-slices-from-storage.util';

function addKeyToStorage(params: {
  storageKey: string;
  saltKey: string;
  defaultStorage: any;
}): void {
  localStorage.setItem(
    params.storageKey,
    encryptStorageData({ data: params.defaultStorage, saltKey: params.saltKey })
  );
  removeAllSlicesFromStorage();
}

function ensureExistKeyInStorage(params: {
  storageKey: string;
  saltKey: string;
  defaultStorage: any;
}): void {
  const storageValue = localStorage.getItem(params.storageKey);
  if (storageValue) {
    try {
      const decryptedStorageValue = decryptStorageData({
        data: storageValue,
        saltKey: params.saltKey
      });
      if (!decryptedStorageValue) {
        addKeyToStorage(params);
      }
    } catch (error) {
      addKeyToStorage(params);
    }
  } else {
    addKeyToStorage(params);
  }
}

export function ensureExistAllRequiredKeysInStorage<
  GSlice,
  GDefaultServer extends TDefaultServer<GSlice>,
  GSelectors extends TSelectors<GSlice>,
  GReducers extends TReducers<GSlice>
>(params: {
  config: TConfig<GSlice, GDefaultServer, GSelectors, GReducers>;
}): void {
  // ensure exist `storageKeys.slicesSaltKey` key in storage
  ensureExistKeyInStorage({
    storageKey: storageKeys.slicesSaltKey,
    saltKey: 'killua',
    defaultStorage: Math.floor(Math.random() * Date.now()).toString(36)
  });

  // ensure exist `storageKeys.slicesChecksum` key in storage
  ensureExistKeyInStorage({
    storageKey: storageKeys.slicesChecksum,
    saltKey: getSaltKeyFromStorage(),
    defaultStorage: {
      [params.config.key]: generateSliceConfigChecksum({
        config: params.config
      })
    }
  });

  // ensure exist `storageKeys.slicesExpireTime` key in storage
  ensureExistKeyInStorage({
    storageKey: storageKeys.slicesExpireTime,
    saltKey: getSaltKeyFromStorage(),
    defaultStorage: {
      ...(params.config.expire && {
        [params.config.key]:
          Date.now() +
          timeStringToSeconds({
            timeString: params.config.expire
          }) *
            1000
      })
    }
  });
}
