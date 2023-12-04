export default function callSliceEvent<TSlice>(params: {
  slice: TSlice;
  event?: (slice: TSlice) => void;
}): void {
  // storage key name
  const storageKey = 'slices-event-is-called';

  // check if event is called (for fix multiple event call)
  const isCalledEvent = JSON.parse(localStorage.getItem(storageKey) || 'false');
  const isCalledEventHandler = () => {
    localStorage.setItem(storageKey, JSON.stringify(true));
    setTimeout(() => {
      localStorage.removeItem(storageKey);
    }, 10);
  };

  // params.event is available && event is not called ===> call event
  if (params.event && !isCalledEvent) {
    isCalledEventHandler();
    params.event(params.slice);
  }
}
