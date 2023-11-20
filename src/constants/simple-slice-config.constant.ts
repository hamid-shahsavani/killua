export const simpleSliceConfig: any = {
  key: 'counter',
  ssr: false,
  default: 1,
  encrypt: true,
  expire: null,
  events: {
    onChange: (value: any): void => {
      console.log('changed : ', value);
    },
    onExpire: (value: any): void => {
      console.log('expired : ', value);
    },
    onInitialize: (value: any): void => {
      console.log('initialized : ', value);
    },
  },
  reducers: {
    incrementWithPayload: (state: any): number => state + 1,
    decrement: (state: any): number => state - 1,
  },
  selectors: {
    double: (state: any): number => state * 2,
  },
};
