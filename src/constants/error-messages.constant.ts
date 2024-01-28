const docsUrl = 'https://killua-docs.vercel.app/config';

export const errorMessages = {
  key: {
    required: `\`key\` is required! \n${docsUrl}#key`,
    invalidType: `\`key\` is not a string! \n${docsUrl}#key`,
    empty: `\`key\` is an empty string! \n${docsUrl}#key`,
    startWithSlice: `\`key\` cannot start with \`slice-\`! \n${docsUrl}#key`,
    startWithSlices: `\`key\` cannot start with \`slices-\`! \n${docsUrl}#key`
  },
  defaultClient: {
    required: `\`defaultClient\` is required! \n${docsUrl}#defaultClient`
  },
  defaultServer: {
    required: `your application is server-side, so \`defaultServer\` is required! \n${docsUrl}#defaultServer`,
    invalidType: `\`defaultServer\` is not the same type as \`defaultClient\`! \n${docsUrl}#defaultServer`
  },
  encrypt: {
    invalidType: `\`encrypt\` is not a boolean! \n${docsUrl}#encrypt`
  },
  expire: {
    invalidFormat: `\`expire\` is not a valid format! \n${docsUrl}#expire`
  },
  schema: {
    invalidType: `\`schema\` is not zod or yup! \n${docsUrl}#schema`
  },
  reducers: {
    invalidType: `\`reducers\` is not an object! \n${docsUrl}#reducers`,
    empty: `\`reducers\` keys are an empty object! \n${docsUrl}#reducers`,
    keysValueIsNotFunction: `\`reducers\` keys value is not a function! \n${docsUrl}#reducers`
  },
  selectors: {
    invalidType: `\`selectors\` is not an object! \n${docsUrl}#selectors`,
    empty: `\`selectors\` keys are an empty object! \n${docsUrl}#selectors`,
    keysValueIsNotFunction: `\`selectors\` keys value is not a function! \n${docsUrl}#selectors`
  },
  other: {
    notDefined: (keys: string[]): string =>
      `not defined key \`${keys.join(', ')}\` in config! \n${docsUrl}`
  }
};
