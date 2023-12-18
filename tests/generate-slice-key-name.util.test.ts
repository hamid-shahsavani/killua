import { describe, expect, it } from 'vitest';
import generateSliceStorageKey from '../src/utils/generate-slice-key-name.util';

describe('generate-slice-key-name.util.ts', (): void => {
  it('should generate the correct slice key name', (): void => {
    expect(generateSliceStorageKey('counter')).toBe('slice-counter');
  });
});
