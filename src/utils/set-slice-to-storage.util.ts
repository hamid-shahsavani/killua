import { broadcastChannelMessages } from '../constants/broadcast-channel-messages.constant';
import { TConfig } from '../types/config.type';
import encryptStorageData from './encrypt-storage-data.util';
import generateSliceStorageKey from './generate-slice-storage-key.util';
import { getSaltKeyFromStorage } from './get-salt-key-from-storage.util';
import schemaValidation from './schema-validation.util';

export default function setSliceToStorage<TSlice>(params: {
  config: TConfig<TSlice>;
  slice: TSlice;
}): void {
  // slice storage name
  const sliceStorageKey = generateSliceStorageKey({ key: params.config.key });

  // validate slice value with schema before set to storageand set to `sliceState`
  schemaValidation({
    data: params.slice,
    schema: params.config.schema,
  });

  // set slice value to storage
  localStorage.setItem(
    sliceStorageKey,
    params.config.encrypt
      ? encryptStorageData({
          data: params.slice,
          saltKey: getSaltKeyFromStorage(),
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
