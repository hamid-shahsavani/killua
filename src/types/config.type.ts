export type TSelectors<GSlice> =
  | Record<string, (state: GSlice, payload?: any) => any>
  | undefined;

export type TReducers<GSlice> =
  | Record<string, (state: GSlice, payload?: any) => GSlice>
  | undefined;

export type TConfig<
  GSlice,
  GSelectors extends TSelectors<GSlice> = undefined,
  GReducers extends TReducers<GSlice> = undefined,
> = {
  key: string;
  encrypt?: boolean;
  expire?: string;
  schema?:
    | { parse: (val: GSlice) => GSlice }
    | { validateSync: (val: GSlice) => GSlice | undefined };
  selectors?: GSelectors;
  reducers?: GReducers;
  events?: Partial<Record<'onChange' | 'onExpire', (value: GSlice) => void>>;
} & (
  | {
      ssr: true;
      defaultClient: GSlice;
      defaultServer: GSlice;
    }
  | {
      ssr?: false;
      default: GSlice;
    }
);
