export default function callSliceEvent<TSlice>(params: {
  slice: TSlice;
  storageKey: string;
  type:
    | 'onInitialize'
    | 'onInitializeClient'
    | 'onInitializeServer'
    | 'onChange'
    | 'onExpire';
  event?: (slice: TSlice) => void;
}): void {
  // localstorage key
  const storageKeyWithType = `${params.storageKey}-${params.type}`;

  // is client available
  const isClientAvailable = typeof window !== 'undefined';

  // check if event is called (for fix multiple event call)
  const isCalledEvent = isClientAvailable
    ? JSON.parse(localStorage.getItem(storageKeyWithType) || 'false')
    : false;
  const isCalledEventHandler = () => {
    localStorage.setItem(storageKeyWithType, JSON.stringify(true));
    setTimeout(() => {
      localStorage.removeItem(storageKeyWithType);
    }, 10);
  };

  // params.event is available && event is not called && client is available ===> call event
  if (params.event && !isCalledEvent && isClientAvailable) {
    isClientAvailable && isCalledEventHandler();
    params.event(params.slice);
  }
}
