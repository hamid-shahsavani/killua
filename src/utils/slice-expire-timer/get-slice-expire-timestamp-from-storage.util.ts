import {
  TConfig,
  TDefaultServer,
  TReducers,
  TSelectors
} from '../../types/config.type';
import { getSlicesExpireTimeFromStorage } from './get-slices-expire-time-from-storage.util';
import { setSliceExpireTimestampToStorage } from './set-slice-expire-timestamp-to-storage.util';

export function getSliceExpireTimestampFromStorage<
  GSlice,
  GDefaultServer extends TDefaultServer<GSlice>,
  GSelectors extends TSelectors<GSlice>,
  GReducers extends TReducers<GSlice>
>(params: {
  config: TConfig<GSlice, GDefaultServer, GSelectors, GReducers>;
}): number | null {
  // return value (default: null, updated after get slice expire timestamp from storage)
  let returnValue: null | number = null;

  // get `storageKeys.slicesExpireTime` from storage
  const storageValue: Record<string, number> = getSlicesExpireTimeFromStorage({
    config: params.config
  });

  /*
    if (`storageKeys.slicesExpireTime` is not exist in `storageValue`) {
      add slice expire timestamp to `storageValue` and set `storageValue` to storage
      set expire timestamp to `returnValue`
    } else {
      set `storageValue[params.config.key]` to `returnValue`
    }
  */
  if (!storageValue[params.config.key]) {
    returnValue = setSliceExpireTimestampToStorage({
      config: params.config
    });
  } else {
    returnValue = storageValue[params.config.key];
  }

  return returnValue;
}
