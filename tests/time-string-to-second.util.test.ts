import { describe, expect, it } from 'vitest';
import timeStringToSeconds from '../src/utils/slice-expire-timer/time-string-to-second.util';

describe('time-string-to-second.util.test.ts', (): void => {
  it('should return the correct number of seconds', (): void => {
    expect(
      timeStringToSeconds({
        timeString: '1h-2m-30s',
      }),
    ).toBe(3750);
  });
});
