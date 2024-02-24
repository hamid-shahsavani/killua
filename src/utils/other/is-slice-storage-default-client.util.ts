import {
  TConfig,
  TDefaultServer,
  TReducers,
  TSelectors
} from '../../types/config.type';
import { getSliceFromStorage } from '../slice-set-and-get/get-slice-from-storage.util';
import { defaultSliceValue } from './default-slice-value.util';

export function isSliceStorageDefaultClient<
  GSlice,
  GDefaultServer extends TDefaultServer<GSlice>,
  GSelectors extends TSelectors<GSlice>,
  GReducers extends TReducers<GSlice>
>(params: {
  config: TConfig<GSlice, GDefaultServer, GSelectors, GReducers>;
}): boolean {
  return (
    getSliceFromStorage({ config: params.config }) ===
    defaultSliceValue({
      config: params.config
    }).client
  );
}
