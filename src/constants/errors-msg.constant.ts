export const errorsMsg = {
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
    required: '`ssr` is required!',
    invalidType: '`ssr` is not boolean!',
    mustBeTrue: 'your application is server-side, `ssr` must be `true`!',
  },
  encrypt: {
    invalidType: '`encrypt` is not boolean!',
    required: '`encrypt` is required!',
  },
  expire: {
    invalidType: '`expire` is not number or null!',
    required: '`expire` required!',
  },
  schema: {
    invalidType: '`schema` is not an zod schema!',
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
    keysIsNotValidInSsrFalse:
      '`events` keys is not `onInitialize`, `onChange` or `onExpire`!',
    keysIsNotValidInSsrTrue:
      '`events` keys is not `onInitializeServer`, `onInitializeClient`, `onChange` or `onExpire`!',
  },
  other: {
    notDefined: (keys: string[]): string =>
      `not defined key \`${keys.join(', ')}\` in config!`,
  },
};
