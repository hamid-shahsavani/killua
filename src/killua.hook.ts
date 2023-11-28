import { useEffect, useState } from 'react';
import getSliceFromLocalstorage from './utils/get-slice-from-localstorage.util';
import callSliceEvent from './utils/call-slice-event.util';
import defaultSliceValue from './utils/default-slice-value.util';
import { TSliceConfig } from './types/slice-config.type';
import setSliceToLocalstorage from './utils/set-slice-to-localstorage.util';

export default function useKillua<T>(params: TSliceConfig<T>): {
  get: T;
  set: (value: T | ((value: T) => T)) => void;
  isReady: boolean;
  reducers: TSliceConfig<T>['reducers'];
  selectors: TSliceConfig<T>['selectors'];
} {
  // default `isReady` value is `false` and set to `true` in client-side
  const [isReady, setIsReady] = useState(false);

  // params.ssr is truthy ===> call event onInitialize server | return `params.defaultServer`
  // params.ssr is falsy ===> set `isReady` to `true` | return slice value from localstorage
  const [sliceState, setSliceState] = useState<T>((): T => {
    if (params.ssr) {
      callSliceEvent<T>({
        slice: defaultSliceValue<T>({
          config: params,
          type: 'server',
        }),
        event: params.events?.onInitializeServer,
      });
      return defaultSliceValue<T>({
        config: params,
        type: 'server',
      });
    } else {
      setIsReady(true);
      return getSliceFromLocalstorage<T>({ config: params });
    }
  });

  // call post message `killua-slice-change` after set slice value to localstorage
  // call message `killua-slice-change` ===> set `event.data.value` to `sliceState` | call event `onChange`
  const broadcastChannel: BroadcastChannel = new BroadcastChannel('killua');
  useEffect(() => {
    broadcastChannel.onmessage = (event) => {
      if (
        event.data.type === 'killua-slice-change' &&
        event.data.key === params.key
      ) {
        setSliceState(event.data.value);
        callSliceEvent<T>({
          slice: event.data.value,
          event: params.events?.onChange,
        });
      }
    };
  }, []);

  // params.ssr && !isReady ===> set `isReady` to `true` | get slice from localstorage and set to `sliceState`
  useEffect(() => {
    if (params.ssr && !isReady) {
      setIsReady(true);
      setSliceState(getSliceFromLocalstorage<T>({ config: params }));
    }
  }, [sliceState]);

  return {
    get: sliceState,
    set: (value: T | ((value: T) => T)) => {
      setSliceToLocalstorage<T>({
        config: params,
        slice: value instanceof Function ? value(sliceState) : value,
      });
    },
    isReady,
    reducers: undefined,
    selectors: undefined,
  };
}
