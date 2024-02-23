import { storageKeys } from '../../constants/storage-keys.constant';
import { decryptStorageData } from '../obfuscation/decrypt-storage-data.util';
import { getSaltKeyFromStorage } from '../obfuscation/get-salt-key-from-storage.util';

export function getSlicesChecksumFromStorage(): Record<string, string> {
  return decryptStorageData({
    data: localStorage.getItem(storageKeys.slicesChecksum),
    saltKey: getSaltKeyFromStorage()
  });
}
