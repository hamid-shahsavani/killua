import { broadcastChannelMessages } from '../../constants/broadcast-channel-messages.constant';
import { storageKeys } from '../../constants/storage-keys.constant';
import {
  TConfig,
  TDefaultServer,
  TReducers,
  TSelectors,
} from '../../types/config.type';
import decryptStorageData from '../cryptography/decrypt-storage-data.util';
import defaultSliceValue from '../other/default-slice-value.util';
import generateSliceStorageKey from '../other/generate-slice-storage-key.util';
import { getSaltKeyFromStorage } from '../cryptography/get-salt-key-from-storage.util';
import schemaValidation from '../slice-schema-validation/schema-validation.util';

export default function getSliceFromStorage<
  GSlice,
  GDefaultServer extends TDefaultServer<GSlice>,
  GSelectors extends TSelectors<GSlice>,
  GReducers extends TReducers<GSlice>,
>(params: {
  config: TConfig<GSlice, GDefaultServer, GSelectors, GReducers>;
}): GSlice {
  // default slice value client
  const defaultSliceValueClient = defaultSliceValue({
    config: params.config,
    type: 'client',
  });

  // storage key
  const storageKey = generateSliceStorageKey({ key: params.config.key });

  // default is `default-client value` (update after get slice value from storage)
  let returnValue: GSlice = defaultSliceValueClient;

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
      ) as GSlice;
      // validate storage value with schema
      schemaValidation({
        data: returnValue,
        config: params.config,
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
