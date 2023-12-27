import { broadcastChannelMessages } from '../../constants/broadcast-channel-messages.constant';
import { TConfig, TReducers, TSelectors } from '../../types/config.type';
import encryptStorageData from '../cryptography/encrypt-storage-data.util';
import generateSliceStorageKey from '../other/generate-slice-storage-key.util';
import { getSaltKeyFromStorage } from '../cryptography/get-salt-key-from-storage.util';
import schemaValidation from '../slice-schema-validation/schema-validation.util';

export default function setSliceToStorage<
  GSlice,
  GSsr extends boolean,
  GSelectors extends TSelectors<GSlice>,
  GReducers extends TReducers<GSlice>,
>(params: {
  config: TConfig<GSlice, GSsr, GSelectors, GReducers>;
  slice: GSlice;
}): void {
  // slice storage name
  const sliceStorageKey = generateSliceStorageKey({ key: params.config.key });

  // validate slice value with schema before set to storageand set to `sliceState`
  schemaValidation({
    data: params.slice,
    config: params.config,
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
