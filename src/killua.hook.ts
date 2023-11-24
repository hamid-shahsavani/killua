import { useEffect, useState } from 'react';
import getSliceFromLocalstorage from './utils/get-slice-from-localstorage.util';
import callSliceEvent from './utils/call-slice-event.util';
import defaultSliceValue from './utils/default-slice-value.util';
import { TSliceConfig } from './types/slice-config.type';

export default function useKillua<T>(params: TSliceConfig<T>): {
  get: T;
  set: (value: T | ((value: T) => T)) => void;
  isReady: boolean;
  reducers: TSliceConfig<T>['reducers'];
  selectors: TSliceConfig<T>['selectors'];
} {
  // default `isReady` value is `false` and set to `true` in client-side
  const [isReady, setIsReady] = useState(false);

  // slice state : `params.ssr` ? (return `params.defaultServer` / call event onInitialize server) : (get slice from localstorage / call event onInitialize client)
  const [sliceState, setSliceState] = useState<T>(() => {
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
      return getSliceFromLocalstorage<T>({ config: params });
    }
  });

  // set `isReady` to `true` in client-side / (params.ssr && !isReady) && (get slice from localstorage / call event onInitialize client)
  useEffect(() => {
    if (params.ssr && !isReady) {
      setSliceState(getSliceFromLocalstorage<T>({ config: params }));
    }
    setIsReady(true);
  }, [sliceState]);

  return {
    get: sliceState,
    set: (value: T | ((value: T) => T)) => setSliceState(value),
    isReady,
    reducers: undefined,
    selectors: undefined,
  };
}
