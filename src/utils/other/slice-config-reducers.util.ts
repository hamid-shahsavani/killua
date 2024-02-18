import {
  TConfig,
  TDefaultServer,
  TReducers,
  TSelectors
} from '../../types/config.type';
import { getSliceFromStorage } from '../slice-set-and-get/get-slice-from-storage.util';
import { setSliceToStorage } from '../slice-set-and-get/set-slice-to-storage.util';
import { defaultSliceValue } from './default-slice-value.util';
import { isAvailableCsr } from './is-available-csr.util';

export function getSliceValue<
  GSlice,
  GDefaultServer extends TDefaultServer<GSlice>,
  GSelectors extends TSelectors<GSlice>,
  GReducers extends TReducers<GSlice>
>(params: {
  config: TConfig<GSlice, GDefaultServer, GSelectors, GReducers>;
}): GSlice {
  if (isAvailableCsr()) {
    return getSliceFromStorage({ config: params.config });
  } else {
    return defaultSliceValue({ config: params.config }).server as GSlice;
  }
}

export function sliceConfigReducers<
  GSlice,
  GDefaultServer extends TDefaultServer<GSlice>,
  GSelectors extends TSelectors<GSlice>,
  GReducers extends TReducers<GSlice>
>(params: {
  config: TConfig<GSlice, GDefaultServer, GSelectors, GReducers>;
  sliceState?: GSlice;
}): Record<string, (payload?: any) => GSlice> {
  // params.config.reducers is truthy ===> assign slice config reducers to reducers object
  const reducers: Record<string, (payload?: any) => GSlice> = {};
  if (params.config.reducers!) {
    for (const reducerName in params.config.reducers!) {
      if (
        Object.prototype.hasOwnProperty.call(
          params.config.reducers!,
          reducerName
        )
      ) {
        const reducerFunc = params.config.reducers[reducerName];
        reducers[reducerName] = (payload?: any) => {
          setSliceToStorage({
            config: params.config,
            slice: reducerFunc(
              params.sliceState ||
                getSliceFromStorage({ config: params.config }),
              payload
            )
          });
          return reducerFunc(
            params.sliceState || getSliceFromStorage({ config: params.config }),
            payload
          );
        };
      }
    }
  }
  return reducers;
}
