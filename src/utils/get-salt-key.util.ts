import decrypt from './decrypt.util';
import encrypt from './encrypt.util';

export function getSaltKey(): string {
  // salt key value with random string (update after get salt key value from localstorage)
  let saltKeyValue = Math.floor(Math.random() * Date.now()).toString(36);

  // remove all slices from localstorage | set salt key to localstorage
  function setNewSaltKeyToLocalstorageHandler(): void {
    localStorage.setItem(
      'slices-salt-key',
      encrypt({
        data: saltKeyValue,
        key: 'killua',
      }),
    );
  }

  // get salt key value from localstorage and update `saltKeyValue`
  const localStorageValue: string | null =
    localStorage.getItem('slices-salt-key');
  if (localStorageValue) {
    try {
      const decryptedSaltKeyValue = decrypt({
        data: localStorageValue,
        key: 'killua',
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
