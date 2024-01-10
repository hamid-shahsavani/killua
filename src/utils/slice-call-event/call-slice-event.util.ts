import {
  TConfig,
  TDefaultServer,
  TReducers,
  TSelectors
} from '../../types/config.type';

export function callSliceEvent<
  GSlice,
  GDefaultServer extends TDefaultServer<GSlice>,
  GSelectors extends TSelectors<GSlice>,
  GReducers extends TReducers<GSlice>
>(params: {
  slice: GSlice;
  type: 'onChange' | 'onExpire';
  config: TConfig<GSlice, GDefaultServer, GSelectors, GReducers>;
}): void {
  // storage key name
  const storageKey = `slice-${params.config.key}-${params.type}`;

  // check if event is called (for fix multiple event call)
  const isCalledEvent = JSON.parse(localStorage.getItem(storageKey) || 'false');
  const isCalledEventHandler = (): void => {
    localStorage.setItem(storageKey, JSON.stringify(true));
    setTimeout((): void => {
      localStorage.removeItem(storageKey);
    }, 10);
  };

  // eventFn is available && event is not called ===> call event
  const eventFn = params.config.events?.[params.type];
  if (eventFn && !isCalledEvent) {
    isCalledEventHandler();
    eventFn(params.slice);
  }
}
