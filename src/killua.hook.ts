import { useEffect, useState } from 'react';
import getSliceFromStorage from './utils/slice-set-and-get/get-slice-from-storage.util';
import defaultSliceValue from './utils/other/default-slice-value.util';
import {
  TConfig,
  TDefaultServer,
  TReducers,
  TSelectors
} from './types/config.type';
import setSliceToStorage from './utils/slice-set-and-get/set-slice-to-storage.util';
import errorTemplate from './utils/other/error-template.utli';
import { isAvailableCsr } from './utils/other/is-available-csr.util';
import { getSliceExpireTimestampFromStorage } from './utils/slice-expire-timer/get-slice-expire-timestamp-from-storage.util';
import broadcastEvents from './utils/other/broadcast-events.util';
import { broadcastChannelMessages } from './constants/broadcast-channel-messages.constant';
import { errorMessages } from './constants/error-messages.constant';
import generateSliceConfigChecksum from './utils/detect-slice-config-change/generate-slice-config-checksum.util';
import { getSliceConfigChecksumFromStorage } from './utils/detect-slice-config-change/get-slice-config-checksum-from-storage.util';
import { isConfigSsr } from './utils/other/is-config-ssr.util';
import { isSliceStorageDefaultClient } from './utils/other/is-slice-storage-default-client.util';

type URemoveValueFromParam<GSlice, GFn> = GFn extends (
  value: GSlice,
  ...args: infer Rest
) => infer R
  ? (...args: Rest) => R
  : never;

type URemoveNeverProperties<GReturnObj> = {
  [K in keyof GReturnObj as GReturnObj[K] extends never
    ? never
    : K]: GReturnObj[K];
};

type TReturn<GSlice, GDefaultServer, GSelectors, GReducers> =
  URemoveNeverProperties<{
    get: GSlice;
    set: (value: GSlice | ((value: GSlice) => GSlice)) => void;
    isReady: undefined extends GDefaultServer ? never : GDefaultServer;
    selectors: undefined extends GSelectors
      ? never
      : {
          [K in keyof GSelectors]: URemoveValueFromParam<GSlice, GSelectors[K]>;
        };
    reducers: undefined extends GReducers
      ? never
      : {
          [K in keyof GReducers]: URemoveValueFromParam<GSlice, GReducers[K]>;
        };
  }>;

export default function useKillua<
  GSlice,
  GDefaultServer extends TDefaultServer<GSlice>,
  GSelectors extends TSelectors<GSlice>,
  GReducers extends TReducers<GSlice>
>(
  params: TConfig<GSlice, GDefaultServer, GSelectors, GReducers>
): TReturn<GSlice, GDefaultServer, GSelectors, GReducers> {
  // default value slice
  const defaultValueSlice: Record<'server' | 'client', GSlice> = {
    server: defaultSliceValue({
      config: params,
      type: 'server'
    }),
    client: defaultSliceValue({
      config: params,
      type: 'client'
    })
  };

  // `is-config-ssr` truthy ===> default `isReady` value is `false` and set to `true` in client-side in return (only for `is-config-ssr`)
  // `is-config-ssr` falsy ===> default `isReady` value is true
  const [isReady, setIsReady] = useState<boolean>(
    isConfigSsr({ config: params }) ? false : true
  );

  // `is-config-ssr` is truthy ===> return `params.defaultServer`
  // `is-config-ssr` is falsy ===> return slice value from storage
  const [sliceState, setSliceState] = useState<GSlice>((): GSlice => {
    if (
      isConfigSsr({
        config: params
      })
    ) {
      return defaultValueSlice.server;
    } else {
      // `is-config-ssr` is `false` and application is server-side ===> throw error
      if (!isAvailableCsr()) {
        errorTemplate({
          msg: errorMessages.defaultServer.required,
          key: params.key
        });
      }
      // `is-config-ssr` is `false` and application is client-side ===> return slice value from storage
      return getSliceFromStorage({
        config: params
      });
    }
  });

  // is-changed slice config by developer ===> call broadcast channel event `broadcastChannelMessages.storageValueNotValid`
  useEffect((): void => {
    const sliceConfigChecksumFromStorage = getSliceConfigChecksumFromStorage({
      config: params
    });
    const currentSliceConfigChecksum = generateSliceConfigChecksum({
      config: params
    });
    if (sliceConfigChecksumFromStorage !== currentSliceConfigChecksum) {
      console.log(`[${params.key}] slice config changed`);
      new BroadcastChannel('killua').postMessage({
        type: broadcastChannelMessages.storageValueNotValid,
        key: params.key
      });
    }
  }, [isReady]);

  // is-config-ssr && !isReady ===> set `isReady` to `true` | get slice from storage and set to `sliceState`
  useEffect((): void => {
    if (
      isConfigSsr({
        config: params
      }) &&
      !isReady
    ) {
      setIsReady(true);
      setSliceState(
        getSliceFromStorage({
          config: params
        })
      );
    }
  }, [sliceState]);

  // broadcast channel events
  useEffect((): void => {
    broadcastEvents({
      config: params,
      sliceState,
      setSliceState
    });
  }, []);

  // params.expire is truthy && (storage slice !== default client slice) ===> check slice expire timestamp
  useEffect((): (() => void) => {
    let intervalId: any = null;
    const broadcastChannel = new BroadcastChannel('killua');
    if (
      params.expire &&
      !isSliceStorageDefaultClient({
        config: params
      })
    ) {
      const sliceExpireTimestamp = getSliceExpireTimestampFromStorage({
        config: params
      });
      if (Number(sliceExpireTimestamp) < Date.now()) {
        broadcastChannel.postMessage({
          type: broadcastChannelMessages.sliceEventOnExpire,
          key: params.key,
          value: getSliceFromStorage({
            config: params
          })
        });
      } else {
        intervalId = setInterval(
          (): void => {
            if (Number(sliceExpireTimestamp) < Date.now()) {
              broadcastChannel.postMessage({
                type: broadcastChannelMessages.sliceEventOnExpire,
                key: params.key,
                value: getSliceFromStorage({
                  config: params
                })
              });
            }
          },
          Number(sliceExpireTimestamp) - Date.now()
        );
      }
    }
    return (): void => {
      clearInterval(intervalId);
    };
  }, [sliceState]);

  // params.selectors is truthy ===> assign slice config selectors to selectors object
  const selectors: Record<string, (payload?: any) => any> = {};
  if (params.selectors!) {
    for (const selectorName in params.selectors!) {
      if (
        Object.prototype.hasOwnProperty.call(params.selectors!, selectorName)
      ) {
        const selectorFunc = params.selectors[selectorName];
        selectors[selectorName] = (payload?: any) => {
          return selectorFunc(sliceState, payload);
        };
      }
    }
  }

  // params.reducers is truthy ===> assign slice config reducers to reducers object
  const reducers: Record<string, (payload?: any) => GSlice> = {};
  if (params.reducers!) {
    for (const reducerName in params.reducers!) {
      if (Object.prototype.hasOwnProperty.call(params.reducers!, reducerName)) {
        const reducerFunc = params.reducers[reducerName];
        reducers[reducerName] = (payload?: any) => {
          setSliceToStorage({
            config: params,
            slice: reducerFunc(sliceState, payload)
          });
          return reducerFunc(sliceState, payload);
        };
      }
    }
  }

  return {
    get: sliceState,
    set: (value: GSlice | ((value: GSlice) => GSlice)) => {
      setSliceToStorage({
        config: params,
        slice: value instanceof Function ? value(sliceState) : value
      });
    },
    ...(isConfigSsr({ config: params }) && { isReady }),
    reducers,
    selectors
  } as TReturn<GSlice, GDefaultServer, GSelectors, GReducers>;
}
