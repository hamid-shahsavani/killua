export type ThunderType<
  TDefault,
  TEvents extends
    | {
        initialize?: (state: TDefault) => void;
        update?: (state: TDefault) => void;
      }
    | undefined,
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
  events?: TEvents;
  reducers?: TReducers;
  selectors?: TSelectors;
}>;
