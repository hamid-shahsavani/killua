import { slice } from 'killua';

export const sliceCounter = slice({
  key: 'counter',
  defaultClient: 1 as number,
  defaultServer: 1,
  expire: '0d-0h-0m-10s',
});
