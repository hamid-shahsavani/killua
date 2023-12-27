import { TConfig, TReducers, TSelectors } from '../../types/config.type';

export function isConfigSsr<
  GSlice,
  GSsr extends boolean,
  GSelectors extends TSelectors<GSlice>,
  GReducers extends TReducers<GSlice>,
>(params: { config: TConfig<GSlice, GSsr, GSelectors, GReducers> }): boolean {
  // params.config.default is { server: GSlice, client: GSlice } ===> SSR
  // params.config.default is GSlice ===> CSR
  console.log(params.config.default);
  return (
    typeof params.config.default === 'object' &&
    params.config.default !== null &&
    Object.keys(params.config.default).length === 2 &&
    params.config.default.hasOwnProperty('server') &&
    params.config.default.hasOwnProperty('client')
  );
}
