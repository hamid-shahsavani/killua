import { broadcastChannelMessages } from '../../constants/broadcast-channel-messages.constant';
import {
  TConfig,
  TDefaultServer,
  TReducers,
  TSelectors
} from '../../types/config.type';
import { generateSliceStorageKey } from '../other/generate-slice-storage-key.util';
import { defaultSliceValue } from './default-slice-value.util';

export function broadcastEvents<
  GSlice,
  GDefaultServer extends TDefaultServer<GSlice>,
  GSelectors extends TSelectors<GSlice>,
  GReducers extends TReducers<GSlice>
>(params: {
  config: TConfig<GSlice, GDefaultServer, GSelectors, GReducers>;
  setSliceState: (value: GSlice) => void;
}): void {
  // broadcast events
  new BroadcastChannel('killua').onmessage = event => {
    // call post message `broadcastChannelMessages.sliceEventOnChange` after set slice value to storage
    if (
      event.data.type === broadcastChannelMessages.sliceEventOnChange &&
      event.data.key === params.config.key
    ) {
      params.setSliceState(event.data.value);
    }
    // call post message `broadcastChannelMessages.sliceEventOnExpire` after set slice expire timestamp to storage
    if (
      event.data.type === broadcastChannelMessages.sliceEventOnExpire &&
      event.data.key === params.config.key
    ) {
      localStorage.removeItem(
        generateSliceStorageKey({
          key: params.config.key
        })
      );
      params.setSliceState(
        defaultSliceValue({
          config: params.config
        }).client
      );
    }
  };
}
