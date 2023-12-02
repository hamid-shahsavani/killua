import { TConfig } from '../types/config.type';

export default function callSliceEvent<TSlice>(params: {
  slice: TSlice;
  storageKey: string;
  type: keyof NonNullable<TConfig<TSlice>['events']>;
  event?: (slice: TSlice) => void;
}): void {
  // localstorage key
  const storageKeyWithType = `${params.storageKey}-${params.type}`;

  // check if event is called (for fix multiple event call)
  const isCalledEvent = JSON.parse(
    localStorage.getItem(storageKeyWithType) || 'false',
  );
  const isCalledEventHandler = () => {
    localStorage.setItem(storageKeyWithType, JSON.stringify(true));
    setTimeout(() => {
      localStorage.removeItem(storageKeyWithType);
    }, 10);
  };

  // params.event is available && event is not called ===> call event
  if (params.event && !isCalledEvent) {
    isCalledEventHandler();
    params.event(params.slice);
  }
}
