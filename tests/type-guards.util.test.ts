import { describe, expect, it } from 'vitest';
import {
  isBoolean,
  isEmptyObject,
  isEmptyString,
  isFunction,
  isNull,
  isNumber,
  isObject,
  isString,
  isUndefined,
} from '../src/utils/type-guards.util';

describe('type-guards.util.ts', () => {
  describe('is-object', () => {
    it('should return true for an object', () => {
      expect(isObject({})).toBe(true);
    });
    it('should return true for an object with properties', () => {
      expect(isObject({ a: 1, b: '2' })).toBe(true);
    });
    it('should return false for an array', () => {
      expect(isObject([])).toBe(false);
    });
    it('should return false for a string', () => {
      expect(isObject('test')).toBe(false);
    });
    it('should return false for a number', () => {
      expect(isObject(123)).toBe(false);
    });
    it('should return false for 1', () => {
      expect(isObject(1)).toBe(false);
    });
    it('should return false for undefined', () => {
      expect(isObject(undefined)).toBe(false);
    });
  });
  describe('is-empty-object', () => {
    it('should return true for an empty object', () => {
      expect(isEmptyObject({})).toBe(true);
    });
    it('should return false for an object with properties', () => {
      expect(isEmptyObject({ a: 1, b: '2' })).toBe(false);
    });
    it('should return false for an array', () => {
      expect(isEmptyObject([])).toBe(false);
    });
    it('should return false for a string', () => {
      expect(isEmptyObject('test')).toBe(false);
    });
    it('should return false for a number', () => {
      expect(isEmptyObject(123)).toBe(false);
    });
    it('should return false for 1', () => {
      expect(isEmptyObject(1)).toBe(false);
    });
    it('should return false for undefined', () => {
      expect(isEmptyObject(undefined)).toBe(false);
    });
  });
  describe('is-string', () => {
    it('should return true for a string', () => {
      expect(isString('hello')).toBe(true);
    });
    it('should return false for a non-string value', () => {
      expect(isString(42)).toBe(false);
    });
  });
  describe('is-empty-string', () => {
    it('should return true for an empty string', () => {
      expect(isEmptyString('')).toBe(true);
    });
    it('should return false for a non-empty string', () => {
      expect(isEmptyString('hello')).toBe(false);
    });
    it('should return false for a non-string value', () => {
      expect(isEmptyString(42)).toBe(false);
    });
  });
  describe('is-boolean', () => {
    it('should return true for a boolean', () => {
      expect(isBoolean(false)).toBe(true);
    });
    it('should return false for a non-boolean value', () => {
      expect(isBoolean('hello')).toBe(false);
    });
  });
  describe('is-number', () => {
    it('should return true for a number', () => {
      expect(isNumber(42)).toBe(true);
    });
    it('should return false for a non-number value', () => {
      expect(isNumber('hello')).toBe(false);
    });
  });
  describe('is-function', () => {
    it('should return true for a function', () => {
      expect(isFunction(() => {})).toBe(true);
    });
    it('should return false for a non-function value', () => {
      expect(isFunction('hello')).toBe(false);
    });
  });
  describe('is-undefined', () => {
    it('should return true for undefined', () => {
      const undefinedVariable: undefined = undefined;
      expect(isUndefined(undefinedVariable)).toBe(true);
    });
    it('should return false for a defined value', () => {
      expect(isUndefined('hello')).toBe(false);
    });
  });
  describe('is-null', () => {
    it('should return true for null', () => {
      const nullVariable: null = null;
      expect(isNull(nullVariable)).toBe(true);
    });
    it('should return false for a non-null value', () => {
      expect(isNull('hello')).toBe(false);
    });
  });
});
