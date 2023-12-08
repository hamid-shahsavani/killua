import { TConfig } from '../types/config.type';
import encrypt from './encrypt.util';
import generateSliceKeyName from './generate-slice-key-name.util';
import { getSaltKey } from './get-salt-key.util';
import schemaValidation from './schema-validation.util';

export default function setSliceToLocalstorage<TSlice>(params: {
  config: TConfig<TSlice>;
  slice: TSlice;
}): void {
  // slice key name
  const sliceKeyName = generateSliceKeyName({ key: params.config.key });

  // validate slice value with schema before set to localstorage and set to `sliceState`
  schemaValidation<TSlice>({
    data: params.slice,
    schema: params.config.schema,
  });

  // set slice value to localstorage
  localStorage.setItem(
    sliceKeyName,
    params.config.encrypt
      ? encrypt({
          data: params.slice,
          saltKey: getSaltKey(),
        })
      : JSON.stringify(params.slice),
  );

  // call broadcast channel with event `localstorage-set-slice-value` for call event `onChange` and set updated slice value to `sliceState`
  new BroadcastChannel('killua').postMessage({
    type: 'localstorage-set-slice-value',
    key: params.config.key,
    value: params.slice,
  });
}
