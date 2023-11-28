import { TSliceConfig } from '../types/slice-config.type';
import callSliceEvent from './call-slice-event.util';
import encrypt from './encrypt.util';
import generateSliceKeyName from './generate-slice-key-name.util';
import { getSaltKey } from './get-salt-key.util';

// TODO : call event onChange after set slice value to localstorage.

export default function setSliceToLocalstorage<T>(params: {
  config: TSliceConfig<T>;
  slice: T;
  setSliceState: React.Dispatch<React.SetStateAction<T>>;
}): void {
  // slice key name
  const sliceKeyName = generateSliceKeyName(params.config.key);

  // set slice value to localstorage
  localStorage.setItem(
    sliceKeyName,
    params.config.encrypt
      ? encrypt({
          data: params.slice,
          key: getSaltKey(),
        })
      : JSON.stringify(params.slice),
  );

  // set slice value to `sliceState`
  params.setSliceState(params.slice);

  // call event `onChange`
  callSliceEvent({
    slice: params.slice,
    event: params.config.events?.onChange,
  });
}
