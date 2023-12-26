import { describe, expect, it } from 'vitest';
import generateSliceStorageKey from '../src/utils/other/generate-slice-storage-key.util';

describe('generate-slice-key-name.util.ts', (): void => {
  it('should generate the correct slice key name', (): void => {
    expect(generateSliceStorageKey({key: 'counter'})).toBe('slice-counter');
  });
});
