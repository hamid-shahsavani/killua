import { describe, expect, it } from 'vitest';
import errorTemplate from '../src/utils/error-template.utli';

describe('error-template.utli.ts', (): void => {
  it('should throw an error with the correct message', (): void => {
    expect(() => errorTemplate('test error')).toThrowError(
      'killua: test error',
    );
  });
});
