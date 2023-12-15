import decrypt from './decrypt.util';
import encrypt from './encrypt.util';

export function getSaltKey(): string {
  // salt key value with random string (update after get salt key value from storage)
  let saltKeyValue = Math.floor(Math.random() * Date.now()).toString(36);

  // set salt key to storage
  function setNewSaltKeyToStorageHandler(): void {
    localStorage.setItem(
      'slices-salt-key',
      encrypt({
        data: saltKeyValue,
        saltKey: 'killua',
      }),
    );
  }

  // get salt key value from storage and update `saltKeyValue`
  const storageValue: string | null = localStorage.getItem('slices-salt-key');
  if (storageValue) {
    try {
      const decryptedSaltKeyValue = decrypt({
        data: storageValue,
        saltKey: 'killua',
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
