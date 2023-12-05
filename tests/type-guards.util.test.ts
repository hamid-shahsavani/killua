import { describe, expect, it } from 'vitest';
import {
  isBoolean,
  isEmptyObject,
  isEmptyString,
  isFunction,
  isObject,
  isString,
  isUndefined,
} from '../src/utils/type-guards.util';

describe('type-guards.util.ts', (): void => {
  describe('is-object', (): void => {
    it('should return true for an object', (): void => {
      expect(isObject({})).toBe(true);
    });
    it('should return true for an object with properties', (): void => {
      expect(isObject({ a: 1, b: '2' })).toBe(true);
    });
    it('should return false for an array', (): void => {
      expect(isObject([])).toBe(false);
    });
    it('should return false for a string', (): void => {
      expect(isObject('test')).toBe(false);
    });
    it('should return false for a number', (): void => {
      expect(isObject(123)).toBe(false);
    });
    it('should return false for 1', (): void => {
      expect(isObject(1)).toBe(false);
    });
    it('should return false for undefined', (): void => {
      expect(isObject(undefined)).toBe(false);
    });
  });
  describe('is-empty-object', (): void => {
    it('should return true for an empty object', (): void => {
      expect(isEmptyObject({})).toBe(true);
    });
    it('should return false for an object with properties', (): void => {
      expect(isEmptyObject({ a: 1, b: '2' })).toBe(false);
    });
    it('should return false for an array', (): void => {
      expect(isEmptyObject([])).toBe(false);
    });
    it('should return false for a string', (): void => {
      expect(isEmptyObject('test')).toBe(false);
    });
    it('should return false for a number', (): void => {
      expect(isEmptyObject(123)).toBe(false);
    });
    it('should return false for 1', (): void => {
      expect(isEmptyObject(1)).toBe(false);
    });
    it('should return false for undefined', (): void => {
      expect(isEmptyObject(undefined)).toBe(false);
    });
  });
  describe('is-string', (): void => {
    it('should return true for a string', (): void => {
      expect(isString('hello')).toBe(true);
    });
    it('should return false for a non-string value', (): void => {
      expect(isString(42)).toBe(false);
    });
  });
  describe('is-empty-string', (): void => {
    it('should return true for an empty string', (): void => {
      expect(isEmptyString('')).toBe(true);
    });
    it('should return false for a non-empty string', (): void => {
      expect(isEmptyString('hello')).toBe(false);
    });
    it('should return false for a non-string value', (): void => {
      expect(isEmptyString(42)).toBe(false);
    });
  });
  describe('is-boolean', (): void => {
    it('should return true for a boolean', (): void => {
      expect(isBoolean(false)).toBe(true);
    });
    it('should return false for a non-boolean value', (): void => {
      expect(isBoolean('hello')).toBe(false);
    });
  });
  describe('is-function', (): void => {
    it('should return true for a function', (): void => {
      expect(isFunction((): void => {})).toBe(true);
    });
    it('should return false for a non-function value', (): void => {
      expect(isFunction('hello')).toBe(false);
    });
  });
  describe('is-undefined', (): void => {
    it('should return true for undefined', (): void => {
      const undefinedVariable: undefined = undefined;
      expect(isUndefined(undefinedVariable)).toBe(true);
    });
    it('should return false for a defined value', (): void => {
      expect(isUndefined('hello')).toBe(false);
    });
  });
});
