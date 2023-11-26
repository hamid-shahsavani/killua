import { TSliceConfig } from '../types/slice-config.type';
import callSliceEvent from './call-slice-event.util';
import defaultSliceValue from './default-slice-value.util';
import generateSliceKeyName from './generate-slice-key-name.util';

// TODO : call event onInitialize client before return value.

export default function getSliceFromLocalstorage<T>(params: {
  config: TSliceConfig<T>;
}): T {
  console.log('getSliceFromLocalstorage', params.config.key);
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
    returnValue = JSON.parse(localstorageSliceValue) as T;
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
