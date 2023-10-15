import { thunder } from 'killua';

const thunderCounter = thunder({
  key: 'counter',
  encrypt: true,
  default: 1,
  expire: null,
  reducers: {
    increment: (thunder: number) => thunder + 1,
    decrement: (thunder: number) => thunder - 1,
  },
});

export { thunderCounter };
