import { storageKeys } from '../../constants/storage-keys.constant';

export function removeAllSlicesFromStorage(): void {
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('killua-')) {
      if (
        key !== storageKeys.killuaChecksum &&
        key !== storageKeys.killuaExpire
      ) {
        localStorage.removeItem(key);
      }
    }
  });
}
