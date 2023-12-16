import { broadcastChannelMessages } from '../constants/broadcast-channel-messages';
import { TConfig } from '../types/config.type';
import encrypt from './encrypt.util';
import generateSliceKeyName from './generate-slice-key-name.util';
import { getSaltKey } from './get-salt-key.util';
import schemaValidation from './schema-validation.util';

export default function setSliceToStorage<TSlice>(params: {
  config: TConfig<TSlice>;
  slice: TSlice;
}): void {
  // slice key name
  const sliceKeyName = generateSliceKeyName({ key: params.config.key });

  // validate slice value with schema before set to storageand set to `sliceState`
  schemaValidation<TSlice>({
    data: params.slice,
    schema: params.config.schema,
  });

  // set slice value to storage
  localStorage.setItem(
    sliceKeyName,
    params.config.encrypt
      ? encrypt({
          data: params.slice,
          saltKey: getSaltKey(),
        })
      : JSON.stringify(params.slice),
  );

  // call broadcast channel with event `broadcastChannelMessages.sliceEventOnChange` for call event `onChange` and set updated slice value to `sliceState`
  new BroadcastChannel('killua').postMessage({
    type: broadcastChannelMessages.sliceEventOnChange,
    key: params.config.key,
    value: params.slice,
  });
}
