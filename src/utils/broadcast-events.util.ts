import { TConfig } from '../types/config.type';
import callSliceEvent from './call-slice-event.util';
import defaultSliceValue from './default-slice-value.util';
import generateSliceKeyName from './generate-slice-key-name.util';
import getSliceFromStorage from './get-slice-from-storage.util';
import { setSliceExpireTimestamp } from './set-slice-expire-timestamp.util';

export default function broadcastEvents<TSlice>(params: {
  config: TConfig<TSlice>;
  sliceState: TSlice;
  setSliceState: (value: TSlice) => void;
}): void {
  const defalutValueSliceClient: TSlice = defaultSliceValue<TSlice>({
    config: params.config,
    type: 'client',
  });

  new BroadcastChannel('killua').onmessage = (event) => {
    // call message `storage-slice-value-not-valid` ===> set `defalutValueSliceClient` to `sliceState` | remove slice value from storage
    if (
      event.data.type === 'storage-slice-value-not-valid' &&
      event.data.key === params.config.key
    ) {
      params.setSliceState(defalutValueSliceClient);
      localStorage.removeItem(
        generateSliceKeyName({
          key: params.config.key,
        }),
      );
    }
    // call post message `slice-event-onChange` after set slice value to storage
    // call message `slice-event-onChange` ===> set `event.data.value` to `sliceState` | call event `onChange`
    if (
      event.data.type === 'slice-event-onChange' &&
      event.data.key === params.config.key
    ) {
      // `event.data.value` is not equal to `params.sliceState` ===> call event `onChange`
      if (event.data.value !== params.sliceState) {
        callSliceEvent<TSlice>({
          slice: event.data.value,
          event: params.config.events?.onChange,
        });
      }
      params.setSliceState(event.data.value);
    }
    // call post message `slice-event-onExpire` after set slice expire timestamp to storage
    // call message `slice-event-onExpire` ===> set `defalutValueSliceClient` | remove slice key from storage| update slice expire time | call event `onExpire`
    if (
      event.data.type === 'slice-event-onExpire' &&
      event.data.key === params.config.key
    ) {
      // storage value is not equal to `defalutValueSliceClient` ===> call event `onExpire`
      if (
        getSliceFromStorage<TSlice>({ config: params.config }) !==
        defalutValueSliceClient
      ) {
        callSliceEvent<TSlice>({
          slice: defalutValueSliceClient,
          event: params.config.events?.onExpire,
        });
      }
      setSliceExpireTimestamp<TSlice>({
        config: params.config,
      });
      params.setSliceState(defalutValueSliceClient);
      localStorage.removeItem(
        generateSliceKeyName({
          key: params.config.key,
        }),
      );
    }
  };
}
