import { slice } from 'killua-beta';

export const sliceCounter = slice({
  key: 'counter',
  defaultClient: 1 as number,
  defaultServer: 1,
});
