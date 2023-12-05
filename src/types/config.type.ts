export type TConfig<TSlice> = Readonly<
  {
    key: string;
    encrypt?: boolean;
    expire?: string;
    schema?: { parse: (val: TSlice) => TSlice };
    reducers?: Record<string, (value: TSlice, payload?: any) => TSlice>;
    selectors?: Record<string, (value: TSlice, payload?: any) => any>;
    events?: Partial<Record<'onChange' | 'onExpire', (value: TSlice) => void>>;
  } & (
    | {
        ssr?: false;
        default: TSlice;
      }
    | {
        ssr: true;
        defaultServer: TSlice;
        defaultClient: TSlice;
      }
  )
>;
