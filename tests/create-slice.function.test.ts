import { expect, it } from 'vitest';
import { errorsMsg } from '../src/constants/errors-msg.constant';
import createSlice from '../src/create-slice.function';
import { simpleSliceConfig } from '../src/constants/simple-slice-config.constant';

// validate `default`
it('should throw an error if `default` is not provided', () => {
  expect(() =>
    createSlice({
      ...simpleSliceConfig,
      default: undefined,
    }),
  ).toThrow(errorsMsg.default.required);
});

// validate `key`
it('should throw an error if `key` is not provided', () => {
  expect(() =>
    createSlice({
      ...simpleSliceConfig,
      key: undefined,
    }),
  ).toThrow(errorsMsg.key.required);
});
it('should throw an error if `key` is not a string', () => {
  expect(() =>
    createSlice({
      ...simpleSliceConfig,
      key: 1,
    }),
  ).toThrow(errorsMsg.key.invalidType);
});
it('should throw an error if `key` is an empty string', () => {
  expect(() =>
    createSlice({
      ...simpleSliceConfig,
      key: '',
    }),
  ).toThrow(errorsMsg.key.empty);
});
it('should throw an error if `key` starts with `slice`', () => {
  expect(() =>
    createSlice({
      ...simpleSliceConfig,
      key: 'sliceCounter',
    }),
  ).toThrow(errorsMsg.key.startWithSlice);
});

// validate `encrypt`
it('should throw an error if `encrypt` is not provided', () => {
  expect(() =>
    createSlice({
      ...simpleSliceConfig,
      encrypt: undefined,
    }),
  ).toThrow(errorsMsg.encrypt.required);
});
it('should throw an error if `encrypt` is not a boolean', () => {
  expect(() =>
    createSlice({
      ...simpleSliceConfig,
      encrypt: 'test',
    }),
  ).toThrow(errorsMsg.encrypt.invalidType);
});

// validate `expire`
it('should throw an error if `expire` is not provided', () => {
  expect(() =>
    createSlice({
      ...simpleSliceConfig,
      expire: undefined,
    }),
  ).toThrow(errorsMsg.expire.required);
});
it('should throw an error if `expire` is not a number or null', () => {
  expect(() =>
    createSlice({
      ...simpleSliceConfig,
      expire: 'test',
    }),
  ).toThrow(errorsMsg.expire.invalidType);
});

// validate `reducers`
it('should throw an error if `reducers` is not an object', () => {
  expect(() =>
    createSlice({
      ...simpleSliceConfig,
      reducers: 'test',
    }),
  ).toThrow(errorsMsg.reducers.invalidType);
});
it('should throw an error if `reducers` keys are empty', () => {
  expect(() =>
    createSlice({
      ...simpleSliceConfig,
      reducers: {},
    }),
  ).toThrow(errorsMsg.reducers.empty);
});
it('should throw an error if `reducers` keys value is not a function', () => {
  expect(() =>
    createSlice({
      ...simpleSliceConfig,
      reducers: { test: 'test' },
    }),
  ).toThrow(errorsMsg.reducers.keysValueIsNotFunction);
});

// validate `selectors`
it('should throw an error if `selectors` is not an object', () => {
  expect(() =>
    createSlice({
      ...simpleSliceConfig,
      selectors: 'test',
    }),
  ).toThrow(errorsMsg.selectors.invalidType);
});
it('should throw an error if `selectors` keys are empty', () => {
  expect(() =>
    createSlice({
      ...simpleSliceConfig,
      selectors: {},
    }),
  ).toThrow(errorsMsg.selectors.empty);
});
it('should throw an error if `selectors` keys value is not a function', () => {
  expect(() =>
    createSlice({
      ...simpleSliceConfig,
      selectors: { test: 'test' },
    }),
  ).toThrow(errorsMsg.selectors.keysValueIsNotFunction);
});

// validate `events`
it('should throw an error if `events` is not an object', () => {
  expect(() =>
    createSlice({
      ...simpleSliceConfig,
      events: 'test',
    }),
  ).toThrow(errorsMsg.events.invalidType);
});
it('should throw an error if `events` keys are empty', () => {
  expect(() =>
    createSlice({
      ...simpleSliceConfig,
      events: {},
    }),
  ).toThrow(errorsMsg.events.empty);
});
it('should throw an error if `events` key onChange value is not a function', () => {
  expect(() =>
    createSlice({
      ...simpleSliceConfig,
      events: { onChange: 'test' },
    }),
  ).toThrow(errorsMsg.events.keysValueIsNotFunction);
});
it('should throw an error if `events` key onInitialize value is not a function', () => {
  expect(() =>
    createSlice({
      ...simpleSliceConfig,
      events: { onInitialize: 'test' },
    }),
  ).toThrow(errorsMsg.events.keysValueIsNotFunction);
});
it('should throw an error if `events` key onInitialize value is not a function', () => {
  expect(() =>
    createSlice({
      ...simpleSliceConfig,
      events: { onExpire: 'test' },
    }),
  ).toThrow(errorsMsg.events.keysValueIsNotFunction);
});
it('should throw an error if `events` keys are not onInitialize, onChange or onExpire', () => {
  expect(() =>
    createSlice({
      ...simpleSliceConfig,
      events: { test: () => {} },
    }),
  ).toThrow(errorsMsg.events.keysIsNotOnInitializeOrOnChangeOrOnExpire);
});

// validate `schema`
it('should throw an error if `schema` is not an object', () => {
  expect(() =>
    createSlice({
      ...simpleSliceConfig,
      schema: 'test',
    }),
  ).toThrow(errorsMsg.schema.invalidType);
});

// validate other keys
it('should throw an error if there are any other keys in the slice config object', () => {
  expect(() =>
    createSlice({
      ...simpleSliceConfig,
      test: 'test',
    }),
  ).toThrow(errorsMsg.other.notDefined(['test']));
});
it('should return the params object if all validations pass', () => {
  expect(createSlice(simpleSliceConfig)).toEqual(simpleSliceConfig);
});
