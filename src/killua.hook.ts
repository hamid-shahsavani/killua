import { useEffect, useState } from 'react';
import getSliceFromLocalstorage from './utils/get-slice-from-localstorage.util';
import callSliceEvent from './utils/call-slice-event.util';
import defaultSliceValue from './utils/default-slice-value.util';
import { TSliceConfig } from './types/slice-config.type';
import setSliceToLocalstorage from './utils/set-slice-to-localstorage.util';
import errorTemplate from './utils/error-template.utli';
import { errorsMsg } from './constants/errors-msg.constant';

export default function useKillua<T>(params: TSliceConfig<T>): {
  get: T;
  set: (value: T | ((value: T) => T)) => void;
  isReady: boolean;
  reducers: TSliceConfig<T>['reducers'];
  selectors: TSliceConfig<T>['selectors'];
} {
  // default slice value server
  const defaultSliceValueServer = defaultSliceValue<T>({
    config: params,
    type: 'client',
  });

  // default `isReady` value is `false` and set to `true` in client-side
  const [isReady, setIsReady] = useState(false);

  // params.ssr is truthy ===> call event onInitialize server | return `params.defaultServer`
  // params.ssr is falsy ===> set `isReady` to `true` | return slice value from localstorage
  const [sliceState, setSliceState] = useState<T>((): T => {
    if (params.ssr) {
      callSliceEvent<T>({
        slice: defaultSliceValueServer,
        event: params.events?.onInitializeServer,
      });
      return defaultSliceValueServer;
    } else {
      if (typeof window === 'undefined') {
        errorTemplate({
          msg: errorsMsg.ssr.mustBeTrue,
          key: params.key,
        });
      }
      setIsReady(true);
      return getSliceFromLocalstorage<T>({ config: params });
    }
  });

  // broadcast channel with onmessage events
  const broadcastChannel: BroadcastChannel = new BroadcastChannel('killua');
  useEffect(() => {
    broadcastChannel.onmessage = (event) => {
      // call post message `killua-event-onChange` after set slice value to localstorage
      // call message `killua-event-onChange` ===> set `event.data.value` to `sliceState` | call event `onChange`
      if (event.data.type === 'killua-event-onChange') {
        if (event.data.key === params.key) {
          setSliceState(event.data.value);
          callSliceEvent<T>({
            slice: event.data.value,
            event: params.events?.onChange,
          });
        }
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
