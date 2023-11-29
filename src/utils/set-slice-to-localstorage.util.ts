import { TSliceConfig } from '../types/slice-config.type';
import encrypt from './encrypt.util';
import generateSliceKeyName from './generate-slice-key-name.util';
import { getSaltKey } from './get-salt-key.util';

export default function setSliceToLocalstorage<T>(params: {
  config: TSliceConfig<T>;
  slice: T;
}): void {
  // slice key name
  const sliceKeyName = generateSliceKeyName(params.config.key);

  // set slice value to localstorage
  localStorage.setItem(
    sliceKeyName,
    params.config.encrypt
      ? encrypt({
          data: params.slice,
          saltKey: getSaltKey(),
        })
      : JSON.stringify(params.slice),
  );

  // call broadcast channel with event `slice-event-onChange` for call event `onChange` and set updated slice value to `sliceState`
  const broadcastChannel: BroadcastChannel = new BroadcastChannel('killua');
  broadcastChannel.postMessage({
    type: 'killua-event-onChange',
    key: params.config.key,
    value: params.slice,
  });
}
