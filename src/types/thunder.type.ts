export type ThunderType<
  TDefault,
  TReducers extends {
    [key: string]: (thunder: TDefault, payload?: any) => TDefault;
  },
  TSelectors extends {
    [key: string]: (thunder: TDefault, payload?: any) => any;
  },
  TExpire extends null | number,
> = {
  key: string;
  encrypt: boolean;
  expire: TExpire;
  default: TDefault;
  reducers?: TReducers;
  selectors?: TSelectors;
};
