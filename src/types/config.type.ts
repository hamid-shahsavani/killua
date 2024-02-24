export type TSelectors<GSlice> =
  | Record<string, (state: GSlice, payload?: any) => any>
  | undefined;

export type TReducers<GSlice> =
  | Record<string, (state: GSlice, payload?: any) => GSlice>
  | undefined;

export type TDefaultServer<GSlice> = GSlice | undefined;

export type TConfig<
  GSlice,
  GDefaultServer extends TDefaultServer<GSlice>,
  GSelectors extends TSelectors<GSlice>,
  GReducers extends TReducers<GSlice>
> = {
  key: string;
  defaultClient: GSlice;
  defaultServer?: GDefaultServer;
  obfuscate?: boolean;
  expire?: string;
  schema?:
    | {
        parse: (val: GSlice) => GSlice;
      }
    | {
        validateSync: (val: GSlice) => GSlice | undefined;
      };
  selectors?: GSelectors;
  reducers?: GReducers;
};
