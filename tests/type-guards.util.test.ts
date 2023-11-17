import { expect, it } from 'vitest';
import { isObject } from '../src/utils/type-guards.util';

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