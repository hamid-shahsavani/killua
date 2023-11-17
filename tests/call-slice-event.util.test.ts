import { expect, it } from 'vitest';
import { callSliceEvent } from '../src/utils/call-slice-event.util';

it('should call the event function with the slice', () => {
  const slice: number = 1;
  let calledSlice: number | boolean = false;
  const event = (receivedSlice: number): void => {
    calledSlice = receivedSlice;
  };
  callSliceEvent({ slice, event });
  expect(calledSlice).toBe(slice);
});

it('should not call the event function if it is not provided', () => {
  const slice = 1;
  const calledSlice: number | boolean = false;
  callSliceEvent({ slice });
  expect(calledSlice).toBe(false);
});