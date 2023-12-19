import { storageKeys } from '../../constants/storage-keys.constant';
import { TConfig } from '../../types/config.type';
import decryptStorageData from '../cryptography/decrypt-storage-data.util';
import encryptStorageData from '../cryptography/encrypt-storage-data.util';
import generateSliceConfigChecksum from './generate-slice-config-checksum.util';
import { getSaltKeyFromStorage } from '../cryptography/get-salt-key-from-storage.util';

function setSlicesChecksumKeyToStorage<TSlice>(params: {
  config: TConfig<TSlice>;
  default: Record<string, string>;
}): void {
  localStorage.setItem(
    storageKeys.slicesChecksum,
    encryptStorageData({
      data: params.default,
      saltKey: getSaltKeyFromStorage(),
    }),
  );
}

export function getSlicesChecksumFromStorage<TSlice>(params: {
  config: TConfig<TSlice>;
}): Record<string, string> {
  // default is `{ [params.config.key]: slice config checksum }` (update after get `storageKeys.slicesChecksum` from storage)
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
        default: returnValue,
      });
    }
  } catch (error) {
    setSlicesChecksumKeyToStorage({
      config: params.config,
      default: returnValue,
    });
  }

  return returnValue;
}
