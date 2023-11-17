import { expect, it } from 'vitest';
import { generateSliceKeyName } from '../src/utils/generate-slice-key-name.util';

it('should generate the correct slice key name', () => {
  expect(generateSliceKeyName('counter')).toBe('sliceCounter');
});