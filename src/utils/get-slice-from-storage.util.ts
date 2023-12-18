import { broadcastChannelMessages } from '../constants/broadcast-channel-messages.constant';
import { storageKeys } from '../constants/storage-keys.constant';
import { TConfig } from '../types/config.type';
import decryptStorageData from './decrypt-storage-data.util';
import defaultSliceValue from './default-slice-value.util';
import generateSliceStorageKey from './generate-slice-storage-key.util';
import { getSaltKeyFromStorage } from './get-salt-key-from-storage.util';
import schemaValidation from './schema-validation.util';

export default function getSliceFromStorage<TSlice>(params: {
  config: TConfig<TSlice>;
}): TSlice {
  // default slice value client
  const defaultSliceValueClient = defaultSliceValue({
    config: params.config,
    type: 'client',
  });

  // storage key
  const storageKey = generateSliceStorageKey({ key: params.config.key });

  // default is `default-client value` (update after get slice value from storage)
  let returnValue: TSlice = defaultSliceValueClient;

  // get slice value from storageand update `returnValue`
  const storageValue: string | null = localStorage.getItem(storageKey);

  if (storageValue) {
    try {
      // set storagevalue to `returnValue` (if data encrypted ? decrypt : JSON.parse)
      returnValue = (
        params.config.encrypt
          ? decryptStorageData({
              data: storageValue,
              saltKey: getSaltKeyFromStorage(),
            })
          : JSON.parse(storageValue)
      ) as TSlice;
      // validate storage value with schema
      schemaValidation({
        data: returnValue,
        schema: params.config.schema,
      });
      // params.config.expire truthy ===> check `storageKeys.slicesExpireTime` object in localstorage is valid
      if (params.config.expire) {
        decryptStorageData({
          data: localStorage.getItem(storageKeys.slicesExpireTime),
          saltKey: getSaltKeyFromStorage(),
        });
      }
      // check `storageKeys.slicesChecksum` object in localstorage is valid
      decryptStorageData({
        data: localStorage.getItem(storageKeys.slicesChecksum),
        saltKey: getSaltKeyFromStorage(),
      });
    } catch (error: any) {
      returnValue = defaultSliceValueClient;
      // schema validation fail || JSON.parse fail || decrypt fail ===> call broadcast channel event `broadcastChannelMessages.storageValueNotValid`
      new BroadcastChannel('killua').postMessage({
        type: broadcastChannelMessages.storageValueNotValid,
        key: params.config.key,
      });
    }
  }

  return returnValue;
}
