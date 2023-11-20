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
      event: params.ssr
        ? params.events?.onInitializeClient
        : params.events?.onInitialize,
    });
  }, []);

  //
  const [sliceState, setSliceState] = useState<T>((): T => {
    const value: number = 1;
    return value as T;
  });

  return {
    get: sliceState,
    set: (value: T | ((value: T) => T)) => setSliceState(value),
    isReady: isInitializedSliceState,
    reducers: undefined,
    selectors: undefined,
  };
}
