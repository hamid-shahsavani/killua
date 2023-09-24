export type ThunderType<
  TDefault,
  TReducers extends
    | Record<string, (state: TDefault, payload?: any) => TDefault>
    | undefined,
  TSelectors extends
    | Record<string, (state: TDefault, payload?: any) => any>
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
