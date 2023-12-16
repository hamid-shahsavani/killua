import { useEffect, useState } from 'react';
import getSliceFromStorage from './utils/get-slice-from-storage.util';
import defaultSliceValue from './utils/default-slice-value.util';
import { TConfig } from './types/config.type';
import setSliceToStorage from './utils/set-slice-to-storage.util';
import errorTemplate from './utils/error-template.utli';
import isClientSide from './utils/is-client-side.util';
import { getSliceExpireTimestamp } from './utils/get-slice-expire-timestamp.util';
import broadcastEvents from './utils/broadcast-events.util';
import { broadcastChannelMessages } from './constants/broadcast-channel-messages';
import { errorMessages } from './constants/error-messages.constant';

export default function useKillua<TSlice>(params: TConfig<TSlice>): {
  get: TSlice;
  set: (value: TSlice | ((value: TSlice) => TSlice)) => void;
  isReady: boolean;
  reducers: TConfig<TSlice>['reducers'];
  selectors: TConfig<TSlice>['selectors'];
} {
  // default value slice
  const defaultValueSlice: Record<'server' | 'client', TSlice> = {
    server: defaultSliceValue({
      config: params,
      type: 'server',
    }),
    client: defaultSliceValue({
      config: params,
      type: 'client',
    }),
  };

  // params.ssr is truthy ===> default `isReady` value is `false` and set to `true` in client-side
  // params.ssr is falsy ===> `isReady` value is `true`
  const [isReady, setIsReady] = useState(params.ssr ? false : true);

  // params.ssr is truthy ===> return `params.defaultServer`
  // params.ssr is falsy ===> return slice value from storage
  const [sliceState, setSliceState] = useState((): TSlice => {
    if (params.ssr) {
      return defaultValueSlice.server;
    } else {
      // `params.ssr` is `false` and application is server-side ===> throw error
      if (!isClientSide()) {
        errorTemplate({
          msg: errorMessages.ssr.mustBeTrue,
          key: params.key,
        });
      }
      // `params.ssr` is `false` and application is client-side ===> return slice value from storage
      return getSliceFromStorage({ config: params });
    }
  });

  // params.expire is truthy ===> check slice expire timestamp
  useEffect((): (() => void) => {
    const broadcastChannel = new BroadcastChannel('killua');
    let intervalId: any = null;
    if (params.expire) {
      const sliceExpireTimestamp = getSliceExpireTimestamp({
        config: params,
      });
      if (Number(sliceExpireTimestamp) < Date.now()) {
        broadcastChannel.postMessage({
          type: broadcastChannelMessages.sliceEventOnExpire,
          key: params.key,
        });
      } else {
        intervalId = setInterval(
          (): void => {
            if (Number(sliceExpireTimestamp) < Date.now()) {
              broadcastChannel.postMessage({
                type: broadcastChannelMessages.sliceEventOnExpire,
                key: params.key,
              });
            }
          },
          Number(sliceExpireTimestamp) - Date.now(),
        );
      }
    }
    return (): void => {
      clearInterval(intervalId);
    };
  }, [sliceState]);

  // params.ssr && !isReady ===> set `isReady` to `true` | get slice from storage and set to `sliceState`
  useEffect((): void => {
    if (params.ssr && !isReady) {
      setIsReady(true);
      setSliceState(getSliceFromStorage({ config: params }));
    }
  }, [sliceState]);

  // broadcast channel events
  useEffect((): void => {
    broadcastEvents({
      config: params,
      sliceState,
      setSliceState,
    });
  }, []);

  return {
    get: sliceState,
    set: (value: TSlice | ((value: TSlice) => TSlice)) => {
      setSliceToStorage({
        config: params,
        slice: value instanceof Function ? value(sliceState) : value,
      });
    },
    isReady,
    reducers: undefined,
    selectors: undefined,
  };
}
