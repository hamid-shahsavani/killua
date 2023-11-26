import { TSliceConfig } from '../types/slice-config.type';
import callSliceEvent from './call-slice-event.util';
import generateSliceKeyName from './generate-slice-key-name.util';

// TODO : call event onChange after set slice value to localstorage.

export default function setSliceToLocalstorage<T>(params: {
  config: TSliceConfig<T>;
  slice: T;
  setSliceState: React.Dispatch<React.SetStateAction<T>>;
}): void {
  // slice key name
  const sliceKeyName = generateSliceKeyName(params.config.key);

  // set slice value to localstorage
  localStorage.setItem(sliceKeyName, JSON.stringify(params.slice));

  // set slice value to `sliceState`
  params.setSliceState(params.slice);

  // call event `onChange`
  callSliceEvent({
    slice: params.slice,
    event: params.config.events?.onChange,
  });
}
