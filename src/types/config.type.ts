export type TConfig<TSlice> = {
  key: string;
  encrypt?: boolean;
  expire?: string;
  schema?:
    | { parse: (val: TSlice) => TSlice }
    | { validateSync: (val: TSlice) => TSlice | undefined };
  reducers?: Record<string, (value: TSlice, payload?: any) => TSlice>;
  selectors?: Record<string, (value: TSlice, payload?: any) => any>;
  events?: Partial<Record<'onChange' | 'onExpire', (value: TSlice) => void>>;
} & (
  | {
      ssr: true;
      defaultClient: TSlice;
      defaultServer: TSlice;
    }
  | {
      ssr?: false;
      default: TSlice;
    }
);
