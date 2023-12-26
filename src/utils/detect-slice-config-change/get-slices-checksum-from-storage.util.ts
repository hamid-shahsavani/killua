import { storageKeys } from '../../constants/storage-keys.constant';
import { TConfig, TReducers, TSelectors } from '../../types/config.type';
import decryptStorageData from '../cryptography/decrypt-storage-data.util';
import encryptStorageData from '../cryptography/encrypt-storage-data.util';
import generateSliceConfigChecksum from './generate-slice-config-checksum.util';
import { getSaltKeyFromStorage } from '../cryptography/get-salt-key-from-storage.util';

function setSlicesChecksumKeyToStorage<
  GSlice,
  GSelectors extends TSelectors<GSlice>,
  GReducers extends TReducers<GSlice>,
>(params: {
  config: TConfig<GSlice, GSelectors, GReducers>;
  defaultStorage: Record<string, string>;
}): void {
  localStorage.setItem(
    storageKeys.slicesChecksum,
    encryptStorageData({
      data: params.defaultStorage,
      saltKey: getSaltKeyFromStorage(),
    }),
  );
}

export function getSlicesChecksumFromStorage<
  GSlice,
  GSelectors extends TSelectors<GSlice>,
  GReducers extends TReducers<GSlice>,
>(params: {
  config: TConfig<GSlice, GSelectors, GReducers>;
}): Record<string, string> {
  // defaultStorage is `{ [params.config.key]: slice config checksum }` (update after get `storageKeys.slicesChecksum` from storage)
  let returnValue: Record<string, string> = {
    [params.config.key]: generateSliceConfigChecksum({
      config: params.config,
    }),
  };

  // get slices checksum from storage ((if not exist || is-not valid) && set `storageKeys.slicesChecksum` key to storage)
  try {
    const storageValue: string | null = localStorage.getItem(
      storageKeys.slicesChecksum,
    );
    if (storageValue) {
      const decryptedStorageValue: Record<string, string> = decryptStorageData({
        data: storageValue,
        saltKey: getSaltKeyFromStorage(),
      });
      returnValue = decryptedStorageValue;
    } else {
      setSlicesChecksumKeyToStorage({
        config: params.config,
        defaultStorage: returnValue,
      });
    }
  } catch (error) {
    setSlicesChecksumKeyToStorage({
      config: params.config,
      defaultStorage: returnValue,
    });
  }

  return returnValue;
}
