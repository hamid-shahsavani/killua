import { broadcastChannelMessages } from '../constants/broadcast-channel-messages';
import { TConfig } from '../types/config.type';
import decrypt from './decrypt.util';
import defaultSliceValue from './default-slice-value.util';
import generateSliceKeyName from './generate-slice-key-name.util';
import { getSaltKey } from './get-salt-key.util';
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
  const storageKey = generateSliceKeyName({ key: params.config.key });

  // default is `default-client value` (update after get slice value from storage)
  let returnValue: TSlice = defaultSliceValueClient;

  // get slice value from storageand update `returnValue`
  const storageValue: string | null = localStorage.getItem(storageKey);

  if (storageValue) {
    try {
      // set storagevalue to `returnValue` (if data encrypted ? decrypt : JSON.parse)
      returnValue = (
        params.config.encrypt
          ? decrypt({
              data: storageValue,
              saltKey: getSaltKey(),
            })
          : JSON.parse(storageValue)
      ) as TSlice;
      // validate storage value with schema
      schemaValidation({
        data: returnValue,
        schema: params.config.schema,
      });
    } catch (error: any) {
      returnValue = defaultSliceValueClient;
      // schema validation fail || JSON.parse fail || decrypt fail ===> call broadcast channel event `broadcastChannelMessages.sliceValueInStorageNotValid`
      new BroadcastChannel('killua').postMessage({
        type: broadcastChannelMessages.sliceValueInStorageNotValid,
        key: params.config.key,
      });
    }
  }

  return returnValue;
}
