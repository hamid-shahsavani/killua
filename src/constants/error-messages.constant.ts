const docsUrl = '\nhttps://killua-docs.vercel.app/config';

export const errorMessages = {
  key: {
    required: `\`key\` is required! ${docsUrl}#key`,
    invalidType: `\`key\` is not a string! ${docsUrl}#key`,
    empty: `\`key\` is an empty string! ${docsUrl}#key`,
    startWithSlice: `\`key\` cannot start with \`slice-\`! ${docsUrl}#key`,
    startWithSlices: `\`key\` cannot start with \`slices-\`! ${docsUrl}#key`,
  },
  default: {
    required: `\`default\` is required! ${docsUrl}#default`,
    configIsNotSsr: `your application is server-side, \`default\` is not object with key \`server\` and \`client\`! ${docsUrl}#default`,
  },
  encrypt: {
    invalidType: `\`encrypt\` is not a boolean! ${docsUrl}#encrypt`,
  },
  expire: {
    invalidFormat: `\`expire\` is not a valid format! ${docsUrl}#expire`,
  },
  schema: {
    invalidType: `\`schema\` is not zod or yup! ${docsUrl}#schema`,
  },
  reducers: {
    invalidType: `\`reducers\` is not an object! ${docsUrl}#reducers`,
    empty: `\`reducers\` keys are an empty object! ${docsUrl}#reducers`,
    keysValueIsNotFunction: `\`reducers\` keys value is not a function! ${docsUrl}#reducers`,
  },
  selectors: {
    invalidType: `\`selectors\` is not an object! ${docsUrl}#selectors`,
    empty: `\`selectors\` keys are an empty object! ${docsUrl}#selectors`,
    keysValueIsNotFunction: `\`selectors\` keys value is not a function! ${docsUrl}#selectors`,
  },
  events: {
    invalidType: `\`events\` is not an object! ${docsUrl}#events`,
    empty: `\`events\` keys are an empty object! ${docsUrl}#events`,
    keysValueIsNotFunction: `\`events\` keys value is not a function! ${docsUrl}#events`,
    keysIsNotValid: `\`events\` keys are not \`onChange\` or \`onExpire\`! ${docsUrl}#events`,
  },
  other: {
    notDefined: (keys: string[]): string =>
      `not defined key \`${keys.join(', ')}\` in config! ${docsUrl}#other`,
  },
};
