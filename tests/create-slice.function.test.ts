import { describe, expect, it } from 'vitest';
import { errorsMsg } from '../src/constants/errors-msg.constant';
import createSlice from '../src/create-slice.function';

describe('create-slice.function.ts', () => {
  describe('validate `default`', () => {
    const sliceConfig: any = {
      key: 'test',
      ssr: false,
      expire: null,
      encrypt: true,
    };
    it('should throw an error if `default` is not provided when `ssr` is false', () => {
      expect(() =>
        createSlice<number>({
          ...sliceConfig,
          default: undefined,
        }),
      ).toThrow(errorsMsg.default.required);
    });
  });

  describe('validate `defaultClient`', () => {
    const sliceConfig: any = {
      key: 'test',
      ssr: true,
      expire: null,
      encrypt: true,
      defaultServer: 1,
    };
    it('should throw an error if `defaultClient` is not provided when `ssr` is true', () => {
      expect(() =>
        createSlice<number>({
          ...sliceConfig,
          defaultClient: undefined,
        }),
      ).toThrow(errorsMsg.defaultClient.required);
    });
  });

  describe('validate `defaultServer`', () => {
    const sliceConfig: any = {
      key: 'test',
      ssr: true,
      expire: null,
      encrypt: true,
      defaultClient: 1,
    };
    it('should throw an error if `defaultServer` is not provided when `ssr` is true', () => {
      expect(() =>
        createSlice<number>({
          ...sliceConfig,
          defaultServer: undefined,
        }),
      ).toThrow(errorsMsg.defaultServer.required);
    });
  });

  describe('validate `ssr`', () => {
    const sliceConfig: any = {
      key: 'test',
      default: 1,
      expire: null,
      encrypt: true,
    };
    it('should throw an error if `ssr` is not provided', () => {
      expect(() =>
        createSlice<number>({
          ...sliceConfig,
          ssr: undefined,
        }),
      ).toThrow(errorsMsg.ssr.required);
    });
    it('should throw an error if `ssr` is not a boolean', () => {
      expect(() =>
        createSlice<number>({
          ...sliceConfig,
          ssr: 'test',
        }),
      ).toThrow(errorsMsg.ssr.invalidType);
    });
  });

  describe('validate `key`', () => {
    const sliceConfig: any = {
      ssr: false,
      default: 1,
      expire: null,
      encrypt: true,
    };
    it('should throw an error if `key` is not provided', () => {
      expect(() =>
        createSlice<number>({
          ...sliceConfig,
          key: undefined as any,
        }),
      ).toThrow(errorsMsg.key.required);
    });
    it('should throw an error if `key` is not a string', () => {
      expect(() =>
        createSlice<number>({
          ...sliceConfig,
          key: 1 as any,
        }),
      ).toThrow(errorsMsg.key.invalidType);
    });
    it('should throw an error if `key` is an empty string', () => {
      expect(() =>
        createSlice<number>({
          ...sliceConfig,
          key: '',
        }),
      ).toThrow(errorsMsg.key.empty);
    });
    it('should throw an error if `key` starts with `slice`', () => {
      expect(() =>
        createSlice<number>({
          ...sliceConfig,
          key: 'sliceCounter',
        }),
      ).toThrow(errorsMsg.key.startWithSlice);
    });
  });

  describe('validate `encrypt`', () => {
    const sliceConfig: any = {
      key: 'test',
      ssr: false,
      default: 1,
      expire: null,
    };
    it('should throw an error if `encrypt` is not provided', () => {
      expect(() =>
        createSlice<number>({
          ...sliceConfig,
          encrypt: undefined,
        }),
      ).toThrow(errorsMsg.encrypt.required);
    });
    it('should throw an error if `encrypt` is not a boolean', () => {
      expect(() =>
        createSlice<number>({
          ...sliceConfig,
          encrypt: 'test',
        }),
      ).toThrow(errorsMsg.encrypt.invalidType);
    });
  });

  describe('validate `expire`', () => {
    const sliceConfig: any = {
      key: 'test',
      ssr: false,
      default: 1,
      encrypt: true,
    };
    it('should throw an error if `expire` is not provided', () => {
      expect(() =>
        createSlice<number>({
          ...sliceConfig,
          expire: undefined,
        }),
      ).toThrow(errorsMsg.expire.required);
    });
    it('should throw an error if `expire` is not a number or null', () => {
      expect(() =>
        createSlice<number>({
          ...sliceConfig,
          expire: 'test',
        }),
      ).toThrow(errorsMsg.expire.invalidType);
    });
  });

  describe('validate `reducers`', () => {
    const sliceConfig: any = {
      key: 'test',
      ssr: false,
      default: 1,
      expire: null,
      encrypt: true,
    };
    it('should throw an error if `reducers` is not an object', () => {
      expect(() =>
        createSlice<number>({
          ...sliceConfig,
          reducers: 'test',
        }),
      ).toThrow(errorsMsg.reducers.invalidType);
    });
    it('should throw an error if `reducers` keys are empty', () => {
      expect(() =>
        createSlice<number>({
          ...sliceConfig,
          reducers: {},
        }),
      ).toThrow(errorsMsg.reducers.empty);
    });
    it('should throw an error if `reducers` keys value is not a function', () => {
      expect(() =>
        createSlice<number>({
          ...sliceConfig,
          reducers: { test: 'test' },
        }),
      ).toThrow(errorsMsg.reducers.keysValueIsNotFunction);
    });
  });

  describe('validate `selectors`', () => {
    const sliceConfig: any = {
      key: 'test',
      ssr: false,
      default: 1,
      expire: null,
      encrypt: true,
    };
    it('should throw an error if `selectors` is not an object', () => {
      expect(() =>
        createSlice<number>({
          ...sliceConfig,
          selectors: 'test',
        }),
      ).toThrow(errorsMsg.selectors.invalidType);
    });
    it('should throw an error if `selectors` keys are empty', () => {
      expect(() =>
        createSlice<number>({
          ...sliceConfig,
          selectors: {},
        }),
      ).toThrow(errorsMsg.selectors.empty);
    });
    it('should throw an error if `selectors` keys value is not a function', () => {
      expect(() =>
        createSlice<number>({
          ...sliceConfig,
          selectors: { test: 'test' },
        }),
      ).toThrow(errorsMsg.selectors.keysValueIsNotFunction);
    });
  });

  describe('validate `events`', () => {
    const sliceConfig: any = {
      key: 'test',
      ssr: false,
      default: 1,
      expire: null,
      encrypt: true,
    };
    it('should throw an error if `events` is not an object', () => {
      expect(() =>
        createSlice<number>({
          ...sliceConfig,
          events: 'test',
        }),
      ).toThrow(errorsMsg.events.invalidType);
    });
    it('should throw an error if `events` keys are empty', () => {
      expect(() =>
        createSlice<number>({
          ...sliceConfig,
          events: {},
        }),
      ).toThrow(errorsMsg.events.empty);
    });
    it('should throw an error if `events` key onChange value is not a function', () => {
      expect(() =>
        createSlice<number>({
          ...sliceConfig,
          events: { onChange: 'test' },
        }),
      ).toThrow(errorsMsg.events.keysValueIsNotFunction);
    });
    it('should throw an error if `events` key onInitialize value is not a function', () => {
      expect(() =>
        createSlice<number>({
          ...sliceConfig,
          events: { onInitialize: 'test' },
        }),
      ).toThrow(errorsMsg.events.keysValueIsNotFunction);
    });
    it('should throw an error if `events` key onInitialize value is not a function', () => {
      expect(() =>
        createSlice<number>({
          ...sliceConfig,
          events: { onExpire: 'test' },
        }),
      ).toThrow(errorsMsg.events.keysValueIsNotFunction);
    });
  });

  describe('validate `schema`', () => {
    const sliceConfig: any = {
      key: 'test',
      ssr: false,
      default: 1,
      expire: null,
      encrypt: true,
    };
    it('should throw an error if `schema` is not an object', () => {
      expect(() =>
        createSlice<number>({
          ...sliceConfig,
          schema: 'test',
        }),
      ).toThrow(errorsMsg.schema.invalidType);
    });
  });

  describe('validate other keys', () => {
    const sliceConfig: any = {
      key: 'test',
      expire: null,
      encrypt: true,
    };
    it('should not throw an error when ssr is false and events have valid keys', () => {
      expect(() =>
        createSlice<number>({
          ...sliceConfig,
          ssr: false,
          default: 1,
          events: {
            onInitialize: () => {},
            onChange: () => {},
            onExpire: () => {},
          },
        }),
      ).not.toThrow();
    });
    it('should not throw an error when ssr is true and events have valid keys', () => {
      expect(() =>
        createSlice<number>({
          ...sliceConfig,
          ssr: true,
          defaultClient: 1,
          defaultServer: 1,
          events: {
            onInitializeClient: () => {},
            onInitializeServer: () => {},
            onChange: () => {},
            onExpire: () => {},
          },
        }),
      ).not.toThrow();
    });
  });
});
