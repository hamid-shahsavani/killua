import { TSliceConfig } from '../types/slice-config.type';
import callSliceEvent from './call-slice-event.util';
import decrypt from './decrypt.util';
import defaultSliceValue from './default-slice-value.util';
import generateSliceKeyName from './generate-slice-key-name.util';
import { getSaltKey } from './get-salt-key.util';

// TODO : call event onInitialize client before return value.

export default function getSliceFromLocalstorage<T>(params: {
  config: TSliceConfig<T>;
}): T {
  // default is `default-client value` (update after get slice value from localstorage)
  let returnValue: T = defaultSliceValue<T>({
    config: params.config,
    type: 'client',
  });

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
              default: defaultSliceValue<T>({
                config: params.config,
                type: 'client',
              }),
            })
          : JSON.parse(localstorageSliceValue)
      ) as T;
    } catch (error) {
      returnValue = defaultSliceValue<T>({
        config: params.config,
        type: 'client',
      });
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
