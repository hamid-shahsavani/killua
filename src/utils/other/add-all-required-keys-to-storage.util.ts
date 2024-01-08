import { storageKeys } from '../../constants/storage-keys.constant';
import {
  TConfig,
  TDefaultServer,
  TReducers,
  TSelectors
} from '../../types/config.type';
import decryptStorageData from '../cryptography/decrypt-storage-data.util';
import encryptStorageData from '../cryptography/encrypt-storage-data.util';
import { getSaltKeyFromStorage } from '../cryptography/get-salt-key-from-storage.util';
import timeStringToSeconds from '../slice-expire-timer/time-string-to-second.util';
import generateSliceStorageKey from './generate-slice-storage-key.util';
import { removeAllSlicesFromStorage } from './remove-all-slices-from-storage.util';

function addKeyToStorage(params: {
  storageKey: string;
  saltKey: string;
  defaultStorage: any;
}): void {
  const { storageKey, saltKey, defaultStorage } = params;
  const storageValue = localStorage.getItem(storageKey);
  const storageErrorHandler = (): void => {
    localStorage.setItem(
      storageKey,
      encryptStorageData({ data: defaultStorage, saltKey })
    );
    removeAllSlicesFromStorage();
  };
  if (storageValue) {
    try {
      const decryptedStorageValue = decryptStorageData({
        data: storageValue,
        saltKey
      });
      if (!decryptedStorageValue) {
        storageErrorHandler();
      }
    } catch (error) {
      storageErrorHandler();
    }
  } else {
    storageErrorHandler();
  }
}

export function addAllRequiredKeysToStorage<
  GSlice,
  GDefaultServer extends TDefaultServer<GSlice>,
  GSelectors extends TSelectors<GSlice>,
  GReducers extends TReducers<GSlice>
>(params: {
  config: TConfig<GSlice, GDefaultServer, GSelectors, GReducers>;
}): void {
  // add `storageKeys.slicesSaltKey` key to storage
  addKeyToStorage({
    storageKey: storageKeys.slicesSaltKey,
    saltKey: 'killua',
    defaultStorage: Math.floor(Math.random() * Date.now()).toString(36)
  });

  // add `storageKeys.slicesSaltKey` key to storage
  addKeyToStorage({
    storageKey: storageKeys.slicesChecksum,
    saltKey: getSaltKeyFromStorage(),
    defaultStorage: {
      [params.config.key]: generateSliceStorageKey({
        key: params.config.key
      })
    }
  });

  // add `storageKeys.slicesExpireTime` key to storage
  addKeyToStorage({
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
