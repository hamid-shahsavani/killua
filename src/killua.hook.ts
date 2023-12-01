import { useEffect, useState } from 'react';
import getSliceFromLocalstorage from './utils/get-slice-from-localstorage.util';
import callSliceEvent from './utils/call-slice-event.util';
import defaultSliceValue from './utils/default-slice-value.util';
import { TConfig } from './types/config.type';
import setSliceToLocalstorage from './utils/set-slice-to-localstorage.util';
import errorTemplate from './utils/error-template.utli';
import { errorsMsg } from './constants/errors-msg.constant';

export default function useKillua<TSlice>(params: TConfig<TSlice>): {
  get: TSlice;
  set: (value: TSlice | ((value: TSlice) => TSlice)) => void;
  reducers: TConfig<TSlice>['reducers'];
  selectors: TConfig<TSlice>['selectors'];
  isReady?: boolean;
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
  const broadcastChannel: BroadcastChannel = new BroadcastChannel('killua');
  useEffect(() => {
    broadcastChannel.onmessage = (event) => {
      // call post message `localstorage-set-slice-value` after set slice value to localstorage
      // call message `localstorage-set-slice-value` ===> set `event.data.value` to `sliceState` | call event `onChange`
      if (event.data.type === 'localstorage-set-slice-value') {
        if (event.data.key === params.key) {
          setSliceState(event.data.value);
          callSliceEvent<TSlice>({
            slice: event.data.value,
            event: params.events?.onChange,
          });
        }
      } else if (
        event.data.type === 'localstorage-value-not-valid-and-removed'
      ) {
        // call message `localstorage-value-not-valid-and-removed` ===> set `defaultValueSlice.client` to `sliceState`
        if (event.data.key === params.key) {
          setSliceState(defaultValueSlice.client);
        }
      }
    };
  }, []);

  // default `isReady` value is `false` and set to `true` in client-side
  const [isReady, setIsReady] = useState(false);

  // params.ssr is truthy ===> call event onInitialize server | return `params.defaultServer`
  // params.ssr is falsy ===> return slice value from localstorage
  const [sliceState, setSliceState] = useState<TSlice>((): TSlice => {
    if (params.ssr) {
      callSliceEvent<TSlice>({
        slice: defaultValueSlice.server,
        event: params.events?.onInitializeServer,
      });
      return defaultValueSlice.server;
    } else {
      if (typeof window === 'undefined') {
        errorTemplate({
          msg: errorsMsg.ssr.mustBeTrue,
          key: params.key,
        });
      }
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
    isReady: params.ssr ? isReady : true,
    reducers: undefined,
    selectors: undefined,
  };
}
