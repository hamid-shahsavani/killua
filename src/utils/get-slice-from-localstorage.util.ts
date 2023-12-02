import { TConfig } from '../types/config.type';
import decrypt from './decrypt.util';
import defaultSliceValue from './default-slice-value.util';
import generateSliceKeyName from './generate-slice-key-name.util';
import { getSaltKey } from './get-salt-key.util';

export default function getSliceFromLocalstorage<TSlice>(params: {
  config: TConfig<TSlice>;
}): TSlice {
  // default slice value client
  const defaultSliceValueClient = defaultSliceValue<TSlice>({
    config: params.config,
    type: 'client',
  });

  // default is `default-client value` (update after get slice value from localstorage)
  let returnValue: TSlice = defaultSliceValueClient;

  // get slice value from localstorage and update `returnValue`
  const localstorageSliceValue: string | null = localStorage.getItem(
    generateSliceKeyName(params.config.key),
  );
  if (localstorageSliceValue) {
    try {
      returnValue = (
        params.config.encrypt
          ? decrypt({
              data: localstorageSliceValue,
              saltKey: getSaltKey(),
              localstorageKey: generateSliceKeyName(params.config.key),
              configKey: params.config.key,
              default: defaultSliceValueClient,
            })
          : JSON.parse(localstorageSliceValue)
      ) as TSlice;
    } catch (error) {
      // call broadcast channel with event `localstorage-value-not-valid-and-removed`
      const broadcastChannel: BroadcastChannel = new BroadcastChannel('killua');
      broadcastChannel.postMessage({
        type: 'localstorage-value-not-valid-and-removed',
        key: params.config.key,
      });
      // remove slice value from localstorage
      localStorage.removeItem(generateSliceKeyName(params.config.key));
      // set `defaultSliceValueClient` to `returnValue`
      returnValue = defaultSliceValueClient;
    }
  }

  // return slice value
  return returnValue;
}
