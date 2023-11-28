import { TSliceConfig } from '../types/slice-config.type';
import callSliceEvent from './call-slice-event.util';
import decrypt from './decrypt.util';
import defaultSliceValue from './default-slice-value.util';
import generateSliceKeyName from './generate-slice-key-name.util';
import { getSaltKey } from './get-salt-key.util';

export default function getSliceFromLocalstorage<T>(params: {
  config: TSliceConfig<T>;
}): T {
  // default slice value client
  const defaultSliceValueClient = defaultSliceValue<T>({
    config: params.config,
    type: 'client',
  });

  // default is `default-client value` (update after get slice value from localstorage)
  let returnValue: T = defaultSliceValueClient;

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
              key: getSaltKey(),
              default: defaultSliceValueClient,
            })
          : JSON.parse(localstorageSliceValue)
      ) as T;
    } catch (error) {
      returnValue = defaultSliceValueClient;
    }
  }

  // call event onInitialize client
  callSliceEvent({
    slice: returnValue,
    event: params.config.ssr
      ? params.config.events?.onInitializeClient
      : params.config.events?.onInitialize,
  });

  // return slice value
  return returnValue;
}
