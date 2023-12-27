import { TConfig, TReducers, TSelectors } from '../../types/config.type';
import schemaValidation from '../slice-schema-validation/schema-validation.util';

export default function defaultSliceValue<
  GSlice,
  GSelectors extends TSelectors<GSlice>,
  GReducers extends TReducers<GSlice>,
>(params: {
  config: TConfig<GSlice, GSelectors, GReducers>;
  type: 'client' | 'server';
}) {
  const data: GSlice =
    params.type === 'client'
      ? params.config.defaultClient
      : params.config.defaultServer!;

  return schemaValidation({
    data,
    config: params.config,
  });
}
