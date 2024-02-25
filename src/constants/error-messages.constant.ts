export const errorMessages = {
  key: {
    required: `\`key\` is required!`,
    invalidType: `\`key\` is not a string!`,
    empty: `\`key\` is an empty string!`,
    startWithKilluaPrefix: `\`key\` starts with 'killua-' prefix!`
  },
  defaultClient: {
    required: `\`defaultClient\` is required!`
  },
  defaultServer: {
    required: `your application is server-side, so \`defaultServer\` is required!`,
    invalidType: `\`defaultServer\` is not the same type as \`defaultClient\`!`
  },
  obfuscate: {
    invalidType: `\`obfuscate\` is not a boolean!`
  },
  expire: {
    invalidFormat: `\`expire\` is not a valid format!`
  },
  schema: {
    invalidType: `\`schema\` is not zod or yup!`
  },
  reducers: {
    invalidType: `\`reducers\` is not an object!`,
    empty: `\`reducers\` keys are an empty object!`,
    keysValueIsNotFunction: `\`reducers\` keys value is not a function!`
  },
  selectors: {
    invalidType: `\`selectors\` is not an object!`,
    empty: `\`selectors\` keys are an empty object!`,
    keysValueIsNotFunction: `\`selectors\` keys value is not a function!`
  },
  other: {
    notDefined: (keys: string[]): string =>
      `not defined key \`${keys.join(', ')}\` in config! `
  }
};
