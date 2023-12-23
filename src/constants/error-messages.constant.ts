export const errorMessages = {
  key: {
    required: '`key` is required!',
    invalidType: '`key` is not string!',
    empty: '`key` is an empty string!',
    startWithSlice: '`key` cannot start with `slice-`!',
    startWithSlices: '`key` cannot start with `slices-`!',
  },
  default: {
    required: '`default` is required!',
  },
  defaultClient: {
    required: '`defaultClient` is required!',
  },
  defaultServer: {
    required: '`defaultServer` is required!',
  },
  ssr: {
    invalidType: '`ssr` is not boolean!',
    mustBeTrue: 'your application is server-side, `ssr` must be `true`!',
  },
  encrypt: {
    invalidType: '`encrypt` is not boolean!',
  },
  expire: {
    invalidFormat:
      '`expire` is not vaild format! \n example: `1d-23h-9m-42s` \n d (day) : min 0 \n h (hour) : min 0 | max 23 \n m (minute) : min 0 | max 59 \n s (second) : min 0 | max 59',
  },
  schema: {
    invalidType: '`schema` is not an zod or yup!',
  },
  reducers: {
    invalidType: '`reducers` is not an object!',
    empty: '`reducers` keys is an empty object!',
    keysValueIsNotFunction: '`reducers` keys value is not function!',
  },
  selectors: {
    invalidType: '`selectors` is not an object!',
    empty: '`selectors` keys is an empty object!',
    keysValueIsNotFunction: '`selectors` keys value is not function!',
  },
  events: {
    invalidType: '`events` is not an object!',
    empty: '`events` keys is an empty object!',
    keysValueIsNotFunction: '`events` keys value is not function!',
    keysIsNotValid: '`events` keys is not `onChange` or `onExpire`!',
  },
  other: {
    notDefined: (keys: string[]): string =>
      `not defined key \`${keys.join(', ')}\` in config!`,
  },
};
