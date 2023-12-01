export type TConfig<TSlice> = Readonly<
  {
    key: string;
    encrypt: boolean;
    expire?: number;
    schema?: { parse: (val: TSlice) => TSlice };
    reducers?: Record<string, (value: TSlice, payload?: any) => TSlice>;
    selectors?: Record<string, (value: TSlice, payload?: any) => any>;
    events?: Partial<Record<'onChange' | 'onExpire', (value: TSlice) => void>>;
  } & (
    | {
        ssr: false;
        default: TSlice;
        events?: Partial<Record<'onInitialize', (value: TSlice) => void>>;
      }
    | {
        ssr: true;
        defaultServer: TSlice;
        defaultClient: TSlice;
        events?: Partial<
          Record<
            'onInitializeClient' | 'onInitializeServer',
            (value: TSlice) => void
          >
        >;
      }
  )
>;
