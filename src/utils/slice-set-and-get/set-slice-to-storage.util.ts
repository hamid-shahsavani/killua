import { broadcastChannelMessages } from '../../constants/broadcast-channel-messages.constant';
import {
  TConfig,
  TDefaultServer,
  TReducers,
  TSelectors
} from '../../types/config.type';
import { schemaValidation } from '../slice-schema-validation/schema-validation.util';
import { setSliceExpireTimestampToStorage } from '../slice-expire-timer/set-slice-expire-timestamp-to-storage.util';

export function setSliceToStorage<
  GSlice,
  GDefaultServer extends TDefaultServer<GSlice>,
  GSelectors extends TSelectors<GSlice>,
  GReducers extends TReducers<GSlice>
>(params: {
  config: TConfig<GSlice, GDefaultServer, GSelectors, GReducers>;
  slice: GSlice;
}): void {
  // validate slice value with schema before set to storage and set to `sliceState` and set slice expire timestamp to storage
  schemaValidation({
    data: params.slice,
    config: params.config
  });

  // set slice value to storage
  localStorage.setItem(
    params.config.key,
    params.config.obfuscate
      ? btoa(JSON.stringify(params.slice))
      : JSON.stringify(params.slice)
  );

  // set slice expire timestamp to storage
  if (params.config.expire) {
    setSliceExpireTimestampToStorage({
      config: params.config
    });
  }

  // call broadcast channel with event `broadcastChannelMessages.sliceEventOnChange` for call event `onChange` and set updated slice value to `sliceState`
  const broadcastChannel = new BroadcastChannel('killua');
  broadcastChannel.postMessage({
    type: broadcastChannelMessages.sliceEventOnChange,
    key: params.config.key,
    value: params.slice
  });
}
