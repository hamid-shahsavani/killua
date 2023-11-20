export type TSlice<T> = Readonly<
  {
    key: string;
    encrypt: boolean;
    expire: number | null;
    schema?: any;
    reducers?: Record<string, (value: T, payload?: any) => T>;
    selectors?: Record<string, (value: T, payload?: any) => any>;
    events?: {
      onChange?: (value: T) => void;
      onExpire?: (value: T) => void;
    };
  } & (
    | {
        ssr: false;
        default: T;
        events?: {
          onInitialize?: (value: T) => void;
        };
      }
    | {
        ssr: true;
        defaultServer: T;
        defaultClient: T;
        events?: {
          onInitializeServer?: (value: T) => void;
          onInitializeClient?: (value: T) => void;
        };
      }
  )
>;
