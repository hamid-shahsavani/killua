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
  // eventFn is available && event is not called ===> call event
  const eventFn = params.config.events?.[params.type];
  if (eventFn) {
    eventFn(params.slice);
  }
}
