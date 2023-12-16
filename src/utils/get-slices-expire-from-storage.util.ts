import { broadcastChannelMessages } from '../constants/broadcast-channel-messages.constant';
import { storageKeys } from '../constants/storage-keys.constant';
import { TConfig } from '../types/config.type';
import decrypt from './decrypt.util';
import encrypt from './encrypt.util';
import { getSaltKey } from './get-salt-key.util';
import timeStringToSeconds from './time-string-to-second.util';

function setSlicesExpireKeyToStorage<TSlice>(params: {
  config: TConfig<TSlice>;
  default: Record<string, number>;
}): void {
  if (params.config.expire) {
    new BroadcastChannel('killua').postMessage({
      type: broadcastChannelMessages.sliceValueInStorageNotValid,
      key: params.config.key,
    });
  }
  localStorage.setItem(
    storageKeys.slicesExpireTime,
    encrypt({ data: params.default, saltKey: getSaltKey() }),
  );
}

export function getSlicesExpireFromStorage<TSlice>(params: {
  config: TConfig<TSlice>;
}): Record<string, number> {
  // default is `{ [params.config.key]: (params.config.expire ? slice expire timestamp : null)}` (update after get `slices-expire` from storage)
  let returnValue: Record<string, number> = {
    ...(params.config.expire && {
      [params.config.key]:
        Date.now() +
        timeStringToSeconds({ timeString: params.config.expire }) * 1000,
    }),
  };

  // get slices expire timestamp from storage((if not exist || is-not valid) && set slices expire key to storage)
  try {
    const storageValue: string | null = localStorage.getItem(
      storageKeys.slicesExpireTime,
    );
    if (storageValue) {
      const decryptedStorageValue: Record<string, number> = decrypt({
        data: storageValue,
        saltKey: getSaltKey(),
      });
      returnValue = decryptedStorageValue;
    } else {
      setSlicesExpireKeyToStorage({
        config: params.config,
        default: returnValue,
      });
    }
  } catch (error) {
    setSlicesExpireKeyToStorage({
      config: params.config,
      default: returnValue,
    });
  }

  return returnValue;
}
