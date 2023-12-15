import { TConfig } from '../types/config.type';
import { getSlicesExpireFromStorage } from './get-slices-expire-from-storage.util';
import { setSliceExpireTimestamp } from './set-slice-expire-timestamp.util';

export function getSliceExpireTimestamp<TSlice>(params: {
  config: TConfig<TSlice>;
}): number | null {
  // return value (default: null, updated after get slice expire timestamp from storage)
  let returnValue: null | number = null;

  // get `slices-expire` from storage
  const storageValue: Record<string, number> = getSlicesExpireFromStorage({
    config: params.config,
  });

  /*
    if (`slices-expire` is not exist in `storageValue`) {
      add slice expire timestamp to `storageValue` and set `storageValue` to storage
      set expire timestamp to `returnValue`
    } else {
      set `storageValue[params.config.key]` to `returnValue`
    }
  */
  if (!storageValue[params.config.key]) {
    returnValue = setSliceExpireTimestamp<TSlice>({ config: params.config });
  } else {
    returnValue = storageValue[params.config.key];
  }

  return returnValue;
}
