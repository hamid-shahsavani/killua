import {
  TConfig,
  TDefaultServer,
  TReducers,
  TSelectors
} from '../../types/config.type';
import { schemaValidation } from '../slice-schema-validation/schema-validation.util';
import { isConfigSsr } from './is-config-ssr.util';

export function defaultSliceValue<
  GSlice,
  GDefaultServer extends TDefaultServer<GSlice>,
  GSelectors extends TSelectors<GSlice>,
  GReducers extends TReducers<GSlice>
>(params: {
  config: TConfig<GSlice, GDefaultServer, GSelectors, GReducers>;
}): {
  client: GSlice;
  server?: GSlice;
} {
  return {
    client: schemaValidation({
      data: params.config.defaultClient,
      config: params.config
    }),
    ...(isConfigSsr({ config: params.config }) && {
      server: schemaValidation({
        data: params.config.defaultServer!,
        config: params.config
      })
    })
  };
}
