import { TConfig } from '../types/config.type';
import decrypt from './decrypt.util';
import encrypt from './encrypt.util';
import { getSaltKey } from './get-salt-key.util';
import timeStringToSeconds from './time-string-to-second.util';

const STORAGE_KEY = 'slices-expire-time';

export function getSliceExpireTimestamp<T>(params: {
  config: TConfig<T>;
}): number | null {
  let returnValue: null | number = params.config.expire
    ? Date.now() +
      timeStringToSeconds({ timeString: params.config.expire }) * 1000
    : null;

  const setSlicesExpireTimestampToLocalstorageHandler = (): void => {
    const newSlicesExpireTimestampValue: Record<string, number> = {
      [params.config.key]: returnValue!,
    };
    localStorage.setItem(
      STORAGE_KEY,
      encrypt({ data: newSlicesExpireTimestampValue, saltKey: getSaltKey() }),
    );
  };

  try {
    const localStorageValue: string | null = localStorage.getItem(STORAGE_KEY);

    if (localStorageValue) {
      const decryptedSlicesExpireTimestampValue: Record<string, number> =
        decrypt({ data: localStorageValue, saltKey: getSaltKey() });

      if (
        !decryptedSlicesExpireTimestampValue[params.config.key] &&
        returnValue
      ) {
        decryptedSlicesExpireTimestampValue[params.config.key] = returnValue;
        localStorage.setItem(
          STORAGE_KEY,
          encrypt({
            data: decryptedSlicesExpireTimestampValue,
            saltKey: getSaltKey(),
          }),
        );
      }

      returnValue =
        decryptedSlicesExpireTimestampValue[params.config.key] ?? returnValue;
    } else {
      setSlicesExpireTimestampToLocalstorageHandler();
    }
  } catch (error) {
    setSlicesExpireTimestampToLocalstorageHandler();
  }

  return returnValue;
}
