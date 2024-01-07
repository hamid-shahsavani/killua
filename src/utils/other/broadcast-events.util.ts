import { broadcastChannelMessages } from '../../constants/broadcast-channel-messages.constant';
import {
  TConfig,
  TDefaultServer,
  TReducers,
  TSelectors
} from '../../types/config.type';
import callSliceEvent from '../slice-call-event/call-slice-event.util';
import defaultSliceValue from '../other/default-slice-value.util';
import generateSliceStorageKey from '../other/generate-slice-storage-key.util';
import { setSliceConfigChecksumToStorage } from '../detect-slice-config-change/set-slice-config-checksum-to-storage.util';

export default function broadcastEvents<
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
    // call message `broadcastChannelMessages.storageValueNotValid` ===> set `defalutSliceValueClient` to `sliceState` | remove slice value from storage | update slice expire time | update slice checksum
    if (
      event.data.type === broadcastChannelMessages.storageValueNotValid &&
      event.data.key === params.config.key
    ) {
      setSliceConfigChecksumToStorage({
        config: params.config
      });
      params.setSliceState(defalutSliceValueClient);
      localStorage.removeItem(
        generateSliceStorageKey({
          key: params.config.key
        })
      );
    }
    // call post message `broadcastChannelMessages.sliceEventOnChange` after set slice value to storage
    // call message `broadcastChannelMessages.sliceEventOnChange` ===> set `event.data.value` to `sliceState` | call event `onChange`
    if (
      event.data.type === broadcastChannelMessages.sliceEventOnChange &&
      event.data.key === params.config.key
    ) {
      params.setSliceState(event.data.value);
      // `event.data.value` is not equal to `params.sliceState` ===> call event `onChange`
      if (event.data.value !== params.sliceState) {
        callSliceEvent({
          slice: event.data.value,
          type: 'onChange',
          config: params.config
        });
      }
    }
    // call post message `broadcastChannelMessages.sliceEventOnExpire` after set slice expire timestamp to storage
    // call message `broadcastChannelMessages.sliceEventOnExpire` ===> set `defalutSliceValueClient` | remove slice key from storage| update slice expire time | call event `onExpire`
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
  };
}
