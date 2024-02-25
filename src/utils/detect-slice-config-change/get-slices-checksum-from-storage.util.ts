import { storageKeys } from '../../constants/storage-keys.constant';

export function getSlicesChecksumFromStorage(): Record<string, string> {
  const storageValue: string | null = localStorage.getItem(
    storageKeys.killuaChecksum
  );
  if (storageValue === null) {
    return {};
  } else {
    return JSON.parse(atob(storageValue));
  }
}
