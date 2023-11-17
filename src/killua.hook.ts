import { useEffect, useState } from 'react';
import { TSlice } from './types/slice.type';
import { callSliceEvent } from './utils/call-slice-event.util';

export default function useKillua<T>(params: TSlice<T>): {
  get: T;
  set: (value: T | ((value: T) => T)) => void;
  isReady: boolean;
  reducers: TSlice<T>['reducers'];
  selectors: TSlice<T>['selectors'];
} {
  //
  const [isInitializedSliceState, setisInitializedSliceState] =
    useState<boolean>(false);
  useEffect((): void => {
    setisInitializedSliceState(true);
    callSliceEvent({
      slice: sliceState,
      event: params.events?.onInitialize,
    });
  }, []);

  //
  const sliceConfig = {
    ssr: true,
    default: 1,
  };

  const [sliceState, setSliceState] = useState<T>((): T => {
    let value: number = 1;
    if (sliceConfig.ssr) {
      value = 2;
    }
    return value as T;
  });

  useEffect((): void => {
    if (sliceConfig.ssr) {
      setSliceState(3 as T);
    }
  }, [sliceState]);

  return {
    get: sliceState,
    set: (value: T | ((value: T) => T)) => setSliceState(value),
    isReady: isInitializedSliceState,
    reducers: undefined,
    selectors: undefined,
  };
}
