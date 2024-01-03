import { TConfig, TDefaultServer, TReducers, TSelectors } from "../../types/config.type";

export function isConfigSsr<
  GSlice,
  GDefaultServer extends TDefaultServer<GSlice>,
  GSelectors extends TSelectors<GSlice>,
  GReducers extends TReducers<GSlice>
>(params: { config: TConfig<GSlice, GDefaultServer, GSelectors, GReducers> }): boolean {
  // is `defaultServer` in params.config ===> SSR
  // is-not `defaultServer` in params.config ===> CSR
  return Object.prototype.hasOwnProperty.call(params.config, "defaultServer");
}
