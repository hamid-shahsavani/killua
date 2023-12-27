import { TConfig, TReducers, TSelectors } from '../../types/config.type';

export function isConfigSsr<
  GSlice,
  GSelectors extends TSelectors<GSlice>,
  GReducers extends TReducers<GSlice>,
>(params: { config: TConfig<GSlice, GSelectors, GReducers> }): boolean {
  // is `defaultServer` in params.config ===> SSR
  // is-not `defaultServer` in params.config ===> CSR
  return params.config.hasOwnProperty('defaultServer');
}
