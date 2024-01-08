import { storageKeys } from '../../constants/storage-keys.constant';
import decryptStorageData from './decrypt-storage-data.util';

export function getSaltKeyFromStorage(): string {
  return decryptStorageData({
    data: localStorage.getItem(storageKeys.slicesSaltKey),
    saltKey: 'killua'
  });
}
