export type TSliceConfig<T> = Readonly<
  {
    key: string;
    encrypt: boolean;
    expire?: number;
    schema?: { parse: (val: T) => T };
    reducers?: Record<string, (value: T, payload?: any) => T>;
    selectors?: Record<string, (value: T, payload?: any) => any>;
    events?: Partial<Record<'onChange' | 'onExpire', (value: T) => void>>;
  } & (
    | {
        ssr: false;
        default: T;
        events?: Partial<Record<'onInitialize', (value: T) => void>>;
      }
    | {
        ssr: true;
        defaultServer: T;
        defaultClient: T;
        events?: Partial<
          Record<
            'onInitializeClient' | 'onInitializeServer',
            (value: T) => void
          >
        >;
      }
  )
>;
