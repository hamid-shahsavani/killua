import { describe, expect, it } from 'vitest';
import errorTemplate from '../src/utils/other/error-template.utli';

describe('error-template.utli.ts', (): void => {
  it('should throw an error with the correct message', (): void => {
    expect(() =>
      errorTemplate({
        msg: 'test error',
        key: 'test key',
      }),
    ).toThrowError('killua(test key): test error');
  });
});
