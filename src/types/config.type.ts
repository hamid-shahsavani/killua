export type TKey = string;
export type TEncrypt = boolean | undefined;
export type TExpire = string | undefined;
export type TSchema =
  | { parse: (val: any) => any }
  | { validateSync: (val: any) => any | undefined }
  | undefined;
export type TReducers<TSlice> =
  | Record<string, (value: TSlice, payload?: any) => TSlice>
  | undefined;
export type TSelectors<TSlice> =
  | Record<string, (value: TSlice, payload?: any) => any>
  | undefined;
export type TEvents<TSlice> = Partial<
  Record<'onChange' | 'onExpire', (value: TSlice) => void>
>;
export type TSSR<TType> = TType extends true ? true : false | undefined;

export type TConfig<TSlice> = {
  key: TKey;
  encrypt?: TEncrypt;
  expire?: TExpire;
  schema?: TSchema;
  reducers?: TReducers<TSlice>;
  selectors?: TSelectors<TSlice>;
  events?: TEvents<TSlice>;
} & (
  | {
      ssr: TSSR<true>;
      defaultClient: TSlice;
      defaultServer: TSlice;
    }
  | {
      ssr?: TSSR<false>;
      default: TSlice;
    }
);
