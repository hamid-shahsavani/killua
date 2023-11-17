import { expect, it } from 'vitest';
import { errorTemplate } from '../src/utils/error-template.utli';

it('should throw an error with the correct message', () => {
  expect(() => errorTemplate('test error')).toThrowError('killua: test error');
});