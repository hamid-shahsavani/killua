import { TSliceConfig } from '../types/slice-config.type';
import callSliceEvent from './call-slice-event.util';
import defaultSliceValue from './default-slice-value.util';
import generateSliceKeyName from './generate-slice-key-name.util';

export default function getSliceFromLocalstorage<T>(params: {
  config: TSliceConfig<T>;
}): T {
  // slice key name
  const sliceKeyName = generateSliceKeyName(params.config.key);

  // default slice value (client)
  const defaultClientSliceValue: T = defaultSliceValue<T>({
    config: params.config,
    type: 'client',
  });

  // event onInitialize (client)
  const eventOnInitializeClient = params.config.ssr
    ? params.config.events?.onInitializeClient
    : params.config.events?.onInitialize;

  // default is `defaultClientSliceValue` (update after get slice value from localstorage)
  let returnValue: T = defaultClientSliceValue;

  // get slice value from localstorage and update `returnValue`
  const localstorageSliceValue: string | null =
    localStorage.getItem(sliceKeyName);
  if (localstorageSliceValue) {
    returnValue = JSON.parse(localstorageSliceValue) as T;
  }

  // call event onInitialize client / return value
  callSliceEvent({
    slice: returnValue,
    event: eventOnInitializeClient,
  });
  return returnValue;
}
