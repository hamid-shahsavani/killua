import { describe, expect, it } from 'vitest';
import errorTemplate from '../src/utils/error-template.utli';

describe('error-template.utli.ts', () => {
  it('should throw an error with the correct message', () => {
    expect(() => errorTemplate('test error')).toThrowError(
      'killua: test error',
    );
  });
});
