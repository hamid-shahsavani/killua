export type ThunderType<
  TDefault,
  TReducers extends
    | {
        [key: string]: (thunder: TDefault, payload?: any) => TDefault;
      }
    | undefined,
  TSelectors extends
    | {
        [key: string]: (thunder: TDefault, payload?: any) => any;
      }
    | undefined,
  TExpire extends null | number,
> = Readonly<{
  key: string;
  encrypt: boolean;
  expire: TExpire;
  default: TDefault;
  reducers?: TReducers;
  selectors?: TSelectors;
}>;
