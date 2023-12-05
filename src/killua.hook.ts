import { useEffect, useState } from 'react';
import getSliceFromLocalstorage from './utils/get-slice-from-localstorage.util';
import callSliceEvent from './utils/call-slice-event.util';
import defaultSliceValue from './utils/default-slice-value.util';
import { TConfig } from './types/config.type';
import setSliceToLocalstorage from './utils/set-slice-to-localstorage.util';
import errorTemplate from './utils/error-template.utli';
import { errorsMsg } from './constants/errors-msg.constant';
import generateSliceKeyName from './utils/generate-slice-key-name.util';
import isClientSide from './utils/is-client-side';

export default function useKillua<TSlice>(params: TConfig<TSlice>): {
  get: TSlice;
  set: (value: TSlice | ((value: TSlice) => TSlice)) => void;
  isReady: boolean;
  reducers: TConfig<TSlice>['reducers'];
  selectors: TConfig<TSlice>['selectors'];
} {
  // default value slice
  const defaultValueSlice: {
    server: TSlice;
    client: TSlice;
  } = {
    server: defaultSliceValue<TSlice>({
      config: params,
      type: 'server',
    }),
    client: defaultSliceValue<TSlice>({
      config: params,
      type: 'client',
    }),
  };

  // broadcast channel with onmessage events
  useEffect(() => {
    new BroadcastChannel('killua').onmessage = (event) => {
      // call post message `localstorage-set-slice-value` after set slice value to localstorage
      // call message `localstorage-set-slice-value` ===> set `event.data.value` to `sliceState` | call event `onChange`
      if (
        event.data.type === 'localstorage-set-slice-value' &&
        event.data.key === params.key
      ) {
        callSliceEvent<TSlice>({
          slice: event.data.value,
          event: params.events?.onChange,
        });
        setSliceState(event.data.value);
      }
      // call message `localstorage-value-not-valid-and-removed` ===> set `defaultValueSlice.client` to `sliceState` | remove slice value from localstorage
      if (
        event.data.type === 'localstorage-value-not-valid-and-removed' &&
        event.data.key === params.key
      ) {
        setSliceState(defaultValueSlice.client);
        localStorage.removeItem(generateSliceKeyName(params.key));
      }
    };
  }, []);

  // params.ssr is truthy ===> default `isReady` value is `false` and set to `true` in client-side
  // params.ssr is falsy ===> `isReady` value is `true`
  const [isReady, setIsReady] = useState(params.ssr ? false : true);

  // params.ssr is truthy ===> return `params.defaultServer`
  // params.ssr is falsy ===> return slice value from localstorage
  const [sliceState, setSliceState] = useState<TSlice>((): TSlice => {
    if (params.ssr) {
      return defaultValueSlice.server;
    } else {
      // `params.ssr` is `false` and application is server-side ===> throw error
      if (!isClientSide()) {
        errorTemplate({
          msg: errorsMsg.ssr.mustBeTrue,
          key: params.key,
        });
      }
      // `params.ssr` is `false` and application is client-side ===> return slice value from localstorage
      return getSliceFromLocalstorage<TSlice>({ config: params });
    }
  });

  // params.ssr && !isReady ===> set `isReady` to `true` | get slice from localstorage and set to `sliceState`
  useEffect(() => {
    if (params.ssr && !isReady) {
      setIsReady(true);
      setSliceState(getSliceFromLocalstorage<TSlice>({ config: params }));
    }
  }, [sliceState]);

  return {
    get: sliceState,
    set: (value: TSlice | ((value: TSlice) => TSlice)) => {
      setSliceToLocalstorage<TSlice>({
        config: params,
        slice: value instanceof Function ? value(sliceState) : value,
      });
    },
    isReady,
    reducers: undefined,
    selectors: undefined,
  };
}
