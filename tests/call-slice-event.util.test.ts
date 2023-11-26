import { describe, expect, it } from 'vitest';
import callSliceEvent from '../src/utils/call-slice-event.util';

describe('call-slice-event.util.ts', (): void => {
  it('should call the event function with the provided slice', (): void => {
    const slice = { name: 'test', value: 123 };
    let called = false;
    callSliceEvent({
      slice,
      event: (s) => {
        expect(s).toEqual(slice);
        called = true;
      },
    });
    expect(called).toBe(true);
  });
  it('should not call the event function if it is not provided', (): void => {
    const slice = { name: 'test', value: 123 };
    let called = false;
    callSliceEvent({ slice });
    expect(called).toBe(false);
  });
});
