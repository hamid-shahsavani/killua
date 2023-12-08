import { TConfig } from '../types/config.type';
import decrypt from './decrypt.util';
import defaultSliceValue from './default-slice-value.util';
import generateSliceKeyName from './generate-slice-key-name.util';
import { getSaltKey } from './get-salt-key.util';
import schemaValidation from './schema-validation.util';

export default function getSliceFromLocalstorage<TSlice>(params: {
  config: TConfig<TSlice>;
}): TSlice {
  // default slice value client
  const defaultSliceValueClient = defaultSliceValue<TSlice>({
    config: params.config,
    type: 'client',
  });

  // storage key
  const storageKey = generateSliceKeyName({ key: params.config.key });

  // default is `default-client value` (update after get slice value from localstorage)
  let returnValue: TSlice = defaultSliceValueClient;

  // get slice value from localstorage and update `returnValue`
  const storageValue: string | null = localStorage.getItem(storageKey);

  // call broadcast channel event
  const callBroadcastChannelEventLocalstorageValueNotValidAndRemovedHandler =
    () => {
      new BroadcastChannel('killua').postMessage({
        type: 'localstorage-slice-value-not-valid-and-removed',
        key: params.config.key,
      });
    };

  if (storageValue) {
    try {
      // set localstorage value to `returnValue` (if data encrypted ? decrypt : JSON.parse)
      returnValue = (
        params.config.encrypt
          ? decrypt({
              data: storageValue,
              saltKey: getSaltKey(),
            })
          : JSON.parse(storageValue)
      ) as TSlice;
      // validate storage value with schema
      schemaValidation<TSlice>({
        data: returnValue,
        schema: params.config.schema,
      });
    } catch (error: any) {
      returnValue = defaultSliceValueClient;
      // schema validation fail || JSON.parse fail || decrypt fail ===> call broadcast channel event `localstorage-slice-value-not-valid-and-removed`
      callBroadcastChannelEventLocalstorageValueNotValidAndRemovedHandler();
    }
  }

  return returnValue;
}
