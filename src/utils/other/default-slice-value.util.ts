import { TConfig, TDefaultServer, TReducers, TSelectors } from "../../types/config.type";
import schemaValidation from "../slice-schema-validation/schema-validation.util";
import { isConfigSsr } from "./is-config-ssr.util";

export default function defaultSliceValue<
  GSlice,
  GDefaultServer extends TDefaultServer<GSlice>,
  GSelectors extends TSelectors<GSlice>,
  GReducers extends TReducers<GSlice>
>(params: {
  config: TConfig<GSlice, GDefaultServer, GSelectors, GReducers>;
  type: "client" | "server";
}) {
  const data: GSlice = isConfigSsr({ config: params.config })
    ? params.type === "client"
      ? params.config.defaultClient
      : params.config.defaultServer!
    : params.config.defaultClient;
  return schemaValidation({
    data,
    config: params.config
  });
}
