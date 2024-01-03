import {
  TConfig,
  TDefaultServer,
  TReducers,
  TSelectors
} from '../../types/config.type';
import { getSlicesChecksumFromStorage } from './get-slices-checksum-from-storage.util';
import { setSliceConfigChecksumToStorage } from './set-slice-config-checksum-to-storage.util';

export function getSliceConfigChecksumFromStorage<
  GSlice,
  GDefaultServer extends TDefaultServer<GSlice>,
  GSelectors extends TSelectors<GSlice>,
  GReducers extends TReducers<GSlice>
>(params: {
  config: TConfig<GSlice, GDefaultServer, GSelectors, GReducers>;
}): string | null {
  // return value (default: null, updated after get slice checksum from storage)
  let returnValue: null | string = null;

  // get `storageKeys.slicesChecksum` from storage
  const storageValue: Record<string, string> = getSlicesChecksumFromStorage({
    config: params.config
  });

  /*
    if (`storageKeys.slicesChecksum` is not exist in `storageValue`) {
      add slice checksum to `storageValue` and set `storageValue` to storage
      set checksum to `returnValue`
    } else {
      set `storageValue[params.config.key]` to `returnValue`
    }
  */
  if (!storageValue[params.config.key]) {
    returnValue = setSliceConfigChecksumToStorage({
      config: params.config
    });
  } else {
    returnValue = storageValue[params.config.key];
  }

  return returnValue;
}
