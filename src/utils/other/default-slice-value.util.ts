import { TConfig, TReducers, TSelectors } from '../../types/config.type';
import schemaValidation from '../slice-schema-validation/schema-validation.util';
import { isConfigSsr } from './is-config-ssr.util';

type TDefault<GSlice, TSsr extends boolean> = TSsr extends true
  ? Record<'server' | 'client', GSlice>
  : GSlice;

export default function defaultSliceValue<
  GSlice,
  GSelectors extends TSelectors<GSlice>,
  GReducers extends TReducers<GSlice>,
>(params: {
  config: TConfig<GSlice, GSelectors, GReducers>;
  type: 'client' | 'server';
}) {
  let data: TDefault<GSlice, boolean>;

  if (isConfigSsr({ config: params.config })) {
    data =
      params.type === 'client'
        ? (params.config.default as TDefault<GSlice, true>).client
        : (params.config.default as TDefault<GSlice, true>).server;
  } else {
    data = params.config.default as TDefault<GSlice, false>;
  }

  return schemaValidation({
    data,
    config: params.config,
  });
}
