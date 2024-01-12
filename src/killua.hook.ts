import { useEffect, useState } from 'react';
import { getSliceFromStorage } from './utils/slice-set-and-get/get-slice-from-storage.util';
import { defaultSliceValue } from './utils/other/default-slice-value.util';
import {
  TConfig,
  TDefaultServer,
  TReducers,
  TSelectors
} from './types/config.type';
import { setSliceToStorage } from './utils/slice-set-and-get/set-slice-to-storage.util';
import { errorTemplate } from './utils/other/error-template.utli';
import { isAvailableCsr } from './utils/other/is-available-csr.util';
import { getSliceExpireTimestampFromStorage } from './utils/slice-expire-timer/get-slice-expire-timestamp-from-storage.util';
import { broadcastEvents } from './utils/other/broadcast-events.util';
import { broadcastChannelMessages } from './constants/broadcast-channel-messages.constant';
import { errorMessages } from './constants/error-messages.constant';
import { generateSliceConfigChecksum } from './utils/detect-slice-config-change/generate-slice-config-checksum.util';
import { getSliceConfigChecksumFromStorage } from './utils/detect-slice-config-change/get-slice-config-checksum-from-storage.util';
import { isConfigSsr } from './utils/other/is-config-ssr.util';
import { isSliceStorageDefaultClient } from './utils/other/is-slice-storage-default-client.util';
import { sliceConfigSelectors } from './utils/other/slice-config-selectors.util';
import { sliceConfigReducers } from './utils/other/slice-config-reducers.util';
import {
  URemoveNeverProperties,
  URemoveValueFromParam
} from './utils/other/utility-types.util';

type TReturn<
  GSlice,
  GDefaultServer extends TDefaultServer<GSlice>,
  GSelectors extends TSelectors<GSlice>,
  GReducers extends TReducers<GSlice>
> = URemoveNeverProperties<{
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
>(params: {
  config: TConfig<GSlice, GDefaultServer, GSelectors, GReducers>;
}): TReturn<GSlice, GDefaultServer, GSelectors, GReducers> {
  // default value slice
  const defaultValueSlice: Record<'server' | 'client', GSlice> = {
    server: defaultSliceValue({
      config: params.config,
      type: 'server'
    }),
    client: defaultSliceValue({
      config: params.config,
      type: 'client'
    })
  };

  // `is-config-ssr` truthy ===> default `isReady` value is `false` and set to `true` in client-side in return (only for `is-config-ssr`)
  // `is-config-ssr` falsy ===> default `isReady` value is true
  const [isReady, setIsReady] = useState<boolean>(
    isConfigSsr({ config: params.config }) ? false : true
  );

  // `is-config-ssr` is truthy ===> return `params.config.defaultServer`
  // `is-config-ssr` is falsy ===> return slice value from storage
  const [sliceState, setSliceState] = useState<GSlice>((): GSlice => {
    if (
      isConfigSsr({
        config: params.config
      })
    ) {
      return defaultValueSlice.server;
    } else {
      // `is-config-ssr` is `false` and application is server-side ===> throw error
      if (!isAvailableCsr()) {
        errorTemplate({
          msg: errorMessages.defaultServer.required,
          key: params.config.key
        });
      }
      // `is-config-ssr` is `false` and application is client-side ===> return slice value from storage
      return getSliceFromStorage({
        config: params.config
      });
    }
  });

  // is-config-ssr && !isReady ===> set `isReady` to `true` | get slice from storage and set to `sliceState`
  useEffect((): void => {
    if (
      isConfigSsr({
        config: params.config
      }) &&
      !isReady
    ) {
      setIsReady(true);
      setSliceState(
        getSliceFromStorage({
          config: params.config
        })
      );
    }
  }, [sliceState]);

  // broadcast channel events
  useEffect((): void => {
    broadcastEvents({
      config: params.config,
      setSliceState
    });
  }, []);

  // params.config.expire is truthy && (storage slice !== default client slice) ===> check slice expire timestamp
  useEffect((): (() => void) => {
    let intervalId: any = null;
    const broadcastChannel = new BroadcastChannel('killua');
    if (
      params.config.expire &&
      !isSliceStorageDefaultClient({
        config: params.config
      })
    ) {
      const sliceExpireTimestamp = getSliceExpireTimestampFromStorage({
        config: params.config
      });
      if (Number(sliceExpireTimestamp) < Date.now()) {
        broadcastChannel.postMessage({
          type: broadcastChannelMessages.sliceEventOnExpire,
          key: params.config.key
        });
      } else {
        intervalId = setInterval(
          (): void => {
            if (Number(sliceExpireTimestamp) < Date.now()) {
              broadcastChannel.postMessage({
                type: broadcastChannelMessages.sliceEventOnExpire,
                key: params.config.key
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

  // is-changed slice config by developer ===> set `defaultSliceValueClient` to `returnValue` | remove slice key from storage
  useEffect((): void => {
    if (isReady) {
      const sliceConfigChecksumFromStorage = getSliceConfigChecksumFromStorage({
        config: params.config
      });
      const currentSliceConfigChecksum = generateSliceConfigChecksum({
        config: params.config
      });
      if (sliceConfigChecksumFromStorage !== currentSliceConfigChecksum) {
        new BroadcastChannel('killua').postMessage({
          type: broadcastChannelMessages.sliceConfigChecksumChanged,
          key: params.config.key
        });
      }
    }
  }, [isReady]);

  return {
    get: sliceState,
    set: (value: GSlice | ((value: GSlice) => GSlice)) => {
      setSliceToStorage({
        config: params.config,
        slice: value instanceof Function ? value(sliceState) : value
      });
    },
    reducers: sliceConfigReducers({ config: params.config }),
    selectors: sliceConfigSelectors({ config: params.config }),
    ...(isConfigSsr({ config: params.config }) && { isReady })
  } as TReturn<GSlice, GDefaultServer, GSelectors, GReducers>;
}
