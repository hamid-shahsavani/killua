import decrypt from './decrypt.util';
import encrypt from './encrypt.util';

const STORAGE_KEY = 'slices-salt-key';

export function getSaltKey(): string {
  // salt key value with random string (update after get salt key value from localstorage)
  let saltKeyValue = Math.floor(Math.random() * Date.now()).toString(36);

  // set salt key to localstorage
  function setNewSaltKeyToLocalstorageHandler(): void {
    localStorage.setItem(
      STORAGE_KEY,
      encrypt({
        data: saltKeyValue,
        saltKey: 'killua',
      }),
    );
  }

  // get salt key value from localstorage and update `saltKeyValue`
  const localStorageValue: string | null = localStorage.getItem(STORAGE_KEY);
  if (localStorageValue) {
    try {
      const decryptedSaltKeyValue = decrypt({
        data: localStorageValue,
        saltKey: 'killua',
      });
      if (decryptedSaltKeyValue) {
        saltKeyValue = decryptedSaltKeyValue;
      } else {
        setNewSaltKeyToLocalstorageHandler();
      }
    } catch {
      setNewSaltKeyToLocalstorageHandler();
    }
  } else {
    setNewSaltKeyToLocalstorageHandler();
  }

  // return salt key
  return saltKeyValue;
}
