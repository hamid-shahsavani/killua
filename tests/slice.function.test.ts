import { describe, expect, it } from 'vitest';
import slice from '../src/slice.function';
import { errorMessages } from '../src/constants/error-messages.constant';

describe('validate `key`', (): void => {
  const sliceConfig = {
    defaultClient: 1
  };
  it('should not throw an error if `key` is valid', (): void => {
    expect(() =>
      slice({
        ...sliceConfig,
        key: 'test'
      })
    ).not.toThrow();
  });
  it('should throw an error if `key` is not provided', (): void => {
    expect(() =>
      slice({
        ...sliceConfig,
        key: undefined as any
      })
    ).toThrow(errorMessages.key.required);
  });
  it('should throw an error if `key` is not a string', (): void => {
    expect(() =>
      slice({
        ...sliceConfig,
        key: 1 as any
      })
    ).toThrow(errorMessages.key.invalidType);
  });
  it('should throw an error if `key` is an empty string', (): void => {
    expect(() =>
      slice({
        ...sliceConfig,
        key: ''
      })
    ).toThrow(errorMessages.key.empty);
  });
  it('should throw an error if `key` starts with `killua-`', (): void => {
    expect(() =>
      slice({
        ...sliceConfig,
        key: 'killua-counter'
      })
    ).toThrow(errorMessages.key.startWithKilluaPrefix);
  });
});
describe('validate `defaultClient`', (): void => {
  const sliceConfig = {
    key: 'test'
  };
  it('should not throw an error if `defaultClient` is valid', (): void => {
    expect(() =>
      slice({
        ...sliceConfig,
        defaultClient: 1
      })
    ).not.toThrow();
  });
  it('should throw an error if `defaultClient` is not provided', (): void => {
    expect(() =>
      slice({
        ...sliceConfig,
        defaultClient: undefined
      })
    ).toThrow(errorMessages.defaultClient.required);
  });
});
describe('validate `defaultServer`', (): void => {
  const sliceConfig = {
    key: 'test',
    defaultClient: 1
  };
  it('should not throw an error if `defaultServer` is valid', (): void => {
    expect(() =>
      slice({
        ...sliceConfig,
        defaultServer: 1
      })
    ).not.toThrow();
  });
  it('should throw an error if typeof `defaultServer` is not the same as `defaultClient`', (): void => {
    expect(() =>
      slice({
        ...sliceConfig,
        defaultServer: 'hi' as any
      })
    ).toThrow(errorMessages.defaultServer.invalidType);
  });
});
describe('validate `obfuscate`', (): void => {
  const sliceConfig = {
    key: 'test',
    defaultClient: 1
  };
  it('should not throw an error if `obfuscate` is valid', (): void => {
    expect(() =>
      slice({
        ...sliceConfig,
        obfuscate: true
      })
    ).not.toThrow();
  });
  it('should throw an error if `obfuscate` is not a boolean', (): void => {
    expect(() =>
      slice({
        ...sliceConfig,
        obfuscate: 1 as any
      })
    ).toThrow(errorMessages.obfuscate.invalidType);
  });
});
describe('validate `expire`', (): void => {
  const sliceConfig = {
    key: 'test',
    defaultClient: 1
  };
  it('should not throw an error if `expire` is valid', (): void => {
    expect(() =>
      slice({
        ...sliceConfig,
        expire: '1d-12h-30m-30s'
      })
    ).not.toThrow();
  });
  it('should throw an error if `expire` is not in the correct format', (): void => {
    expect(() =>
      slice({
        ...sliceConfig,
        expire: '40' as any
      })
    ).toThrow(errorMessages.expire.invalidFormat);
  });
});
describe('validate `reducers`', (): void => {
  const sliceConfig = {
    key: 'test',
    defaultClient: 1
  };
  it('should not throw an error if `reducers` is valid', (): void => {
    expect(() =>
      slice({
        ...sliceConfig,
        reducers: {
          increment: value => value + 1,
          incrementWithPayload: (value, payload: number) => value + payload
        }
      })
    ).not.toThrow();
  });
  it('should throw an error if `reducers` is not an object', (): void => {
    expect(() =>
      slice({
        ...sliceConfig,
        reducers: 1 as any
      })
    ).toThrow(errorMessages.reducers.invalidType);
  });
  it('should throw an error if `reducers` is an empty object', (): void => {
    expect(() =>
      slice({
        ...sliceConfig,
        reducers: {}
      })
    ).toThrow(errorMessages.reducers.empty);
  });
  it('should throw an error if `reducers` contains a non-function value', (): void => {
    expect(() =>
      slice({
        ...sliceConfig,
        reducers: {
          test: 1 as any
        }
      })
    ).toThrow(errorMessages.reducers.keysValueIsNotFunction);
  });
});
describe('validate `selectors`', (): void => {
  const sliceConfig = {
    key: 'test',
    defaultClient: 1
  };
  it('should not throw an error if `selectors` is valid', (): void => {
    expect(() =>
      slice({
        ...sliceConfig,
        selectors: {
          increment: value => value + 1,
          incrementWithPayload: (value, payload: number) => value + payload
        }
      })
    ).not.toThrow();
  });
  it('should throw an error if `selectors` is not an object', (): void => {
    expect(() =>
      slice({
        ...sliceConfig,
        selectors: 1 as any
      })
    ).toThrow(errorMessages.selectors.invalidType);
  });
  it('should throw an error if `selectors` is an empty object', (): void => {
    expect(() =>
      slice({
        ...sliceConfig,
        selectors: {}
      })
    ).toThrow(errorMessages.selectors.empty);
  });
  it('should throw an error if `selectors` contains a non-function value', (): void => {
    expect(() =>
      slice({
        ...sliceConfig,
        selectors: {
          test: 1 as any
        }
      })
    ).toThrow(errorMessages.selectors.keysValueIsNotFunction);
  });
});
describe('validate `schema`', (): void => {
  const sliceConfig = {
    key: 'test',
    defaultClient: 1
  };
  it('should not throw an error if `schema` is valid', (): void => {
    expect(() =>
      slice({
        ...sliceConfig,
        schema: {
          parse: value => value,
          validateSync: value => value
        }
      })
    ).not.toThrow();
  });
  it('should throw an error if `schema` is not valid', (): void => {
    expect(() =>
      slice({
        ...sliceConfig,
        schema: 1 as any
      })
    ).toThrow(errorMessages.schema.invalidType);
  });
});
describe('validate other keys', (): void => {
  const sliceConfig = {
    key: 'test',
    defaultClient: 1,
    defaultServer: 1,
    obfuscate: true,
    expire: '1d-12h-30m-30s',
    reducers: {
      increment: value => value + 1,
      incrementWithPayload: (value, payload: number) => value + payload
    },
    selectors: {
      increment: value => value + 1,
      incrementWithPayload: (value, payload: number) => value + payload
    },
    schema: {
      parse: value => value,
      validateSync: value => value
    }
  };
  it('should not throw an error if slice config is valid', (): void => {
    expect(() =>
      slice({
        ...sliceConfig
      })
    ).not.toThrow();
  });
  it('should throw an error if slice config contains an invalid key', (): void => {
    expect(() =>
      slice({
        ...sliceConfig,
        invalidKey: 1 as any
      } as any)
    ).toThrow(errorMessages.other.notDefined(['invalidKey']));
  });
});
