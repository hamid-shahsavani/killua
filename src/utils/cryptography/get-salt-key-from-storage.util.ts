import { storageKeys } from '../../constants/storage-keys.constant';
import decryptStorageData from './decrypt-storage-data.util';
import encryptStorageData from './encrypt-storage-data.util';

export function getSaltKeyFromStorage(): string {
  // salt key value with random string (update after get salt key value from storage)
  let saltKeyValue = Math.floor(Math.random() * Date.now()).toString(36);

  // set salt key to storage
  function setNewSaltKeyToStorageHandler(): void {
    localStorage.setItem(
      storageKeys.slicesSaltKey,
      encryptStorageData({
        data: saltKeyValue,
        saltKey: 'killua'
      })
    );
  }

  // get salt key value from storage and update `saltKeyValue`
  const storageValue: string | null = localStorage.getItem(
    storageKeys.slicesSaltKey
  );
  if (storageValue) {
    try {
      const decryptedSaltKeyValue = decryptStorageData({
        data: storageValue,
        saltKey: 'killua'
      });
      if (decryptedSaltKeyValue) {
        saltKeyValue = decryptedSaltKeyValue;
      } else {
        setNewSaltKeyToStorageHandler();
      }
    } catch {
      setNewSaltKeyToStorageHandler();
    }
  } else {
    setNewSaltKeyToStorageHandler();
  }

  // return salt key
  return saltKeyValue;
}
