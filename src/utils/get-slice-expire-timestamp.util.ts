import { TConfig } from '../types/config.type';
import { getSlicesExpireFromLocalStorage } from './get-slices-expire-from-localstorage.util';
import { setSliceExpireTimestamp } from './set-slice-expire-timestamp.util';

export function getSliceExpireTimestamp<TSlice>(params: {
  config: TConfig<TSlice>;
}): number | null {
  // return value (default: null, updated after get slice expire timestamp from localstorage)
  let returnValue: null | number = null;

  // get `slices-expire` from localstorage
  const localStorageValue: Record<string, number> =
    getSlicesExpireFromLocalStorage({
      config: params.config,
    });

  /*
    if (`slices-expire` is not exist in `localStorageValue`) {
      add slice expire timestamp to `localStorageValue` and set `localStorageValue` to localstorage
      set expire timestamp to `returnValue`
    } else {
      set `localStorageValue[params.config.key]` to `returnValue`
    }
  */
  if (!localStorageValue[params.config.key]) {
    returnValue = setSliceExpireTimestamp({ config: params.config });
  } else {
    returnValue = localStorageValue[params.config.key];
  }

  return returnValue;
}
