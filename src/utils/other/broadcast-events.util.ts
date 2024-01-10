import { broadcastChannelMessages } from '../../constants/broadcast-channel-messages.constant';
import {
  TConfig,
  TDefaultServer,
  TReducers,
  TSelectors
} from '../../types/config.type';
import { callSliceEvent } from '../slice-call-event/call-slice-event.util';
import { defaultSliceValue } from '../other/default-slice-value.util';
import { generateSliceStorageKey } from '../other/generate-slice-storage-key.util';
import { setSliceConfigChecksumToStorage } from '../detect-slice-config-change/set-slice-config-checksum-to-storage.util';

export function broadcastEvents<
  GSlice,
  GDefaultServer extends TDefaultServer<GSlice>,
  GSelectors extends TSelectors<GSlice>,
  GReducers extends TReducers<GSlice>
>(params: {
  config: TConfig<GSlice, GDefaultServer, GSelectors, GReducers>;
  sliceState: GSlice;
  setSliceState: (value: GSlice) => void;
}): void {
  // default slice value Client
  const defalutSliceValueClient: GSlice = defaultSliceValue({
    config: params.config,
    type: 'client'
  });

  // broadcast events
  new BroadcastChannel('killua').onmessage = event => {
    // call post message `broadcastChannelMessages.sliceEventOnChange` after set slice value to storage
    if (
      event.data.type === broadcastChannelMessages.sliceEventOnChange &&
      event.data.key === params.config.key
    ) {
      params.setSliceState(event.data.value);
      callSliceEvent({
        slice: event.data.value,
        type: 'onChange',
        config: params.config
      });
    }
    // call post message `broadcastChannelMessages.sliceEventOnExpire` after set slice expire timestamp to storage
    if (
      event.data.type === broadcastChannelMessages.sliceEventOnExpire &&
      event.data.key === params.config.key
    ) {
      params.setSliceState(defalutSliceValueClient);
      localStorage.removeItem(
        generateSliceStorageKey({
          key: params.config.key
        })
      );
      callSliceEvent({
        slice: event.data.value,
        config: params.config,
        type: 'onExpire'
      });
    }
    // call post message `broadcastChannelMessages.sliceConfigChecksumChanged` after not equal slice checksum from storage and current slice checksum
    if (
      event.data.type === broadcastChannelMessages.sliceConfigChecksumChanged &&
      event.data.key === params.config.key
    ) {
      params.setSliceState(defalutSliceValueClient);
      setSliceConfigChecksumToStorage({
        config: params.config
      });
      localStorage.removeItem(
        generateSliceStorageKey({
          key: params.config.key
        })
      );
    }
  };
}
