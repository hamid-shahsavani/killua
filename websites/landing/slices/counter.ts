import { slice } from 'killua';

export const sliceCounter = slice({
  key: 'counter',
  defaultClient: 1 as number,
  defaultServer: 1
});
