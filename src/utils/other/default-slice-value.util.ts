import { TConfig } from '../../types/config.type';
import schemaValidation from '../slice-schema-validation/schema-validation.util';

export default function defaultSliceValue<TSlice>(params: {
  config: TConfig<TSlice>;
  type: 'client' | 'server';
}) {
  const data = params.config.ssr
    ? params.type === 'client'
      ? params.config.defaultClient
      : params.config.defaultServer
    : params.config.default;

  return schemaValidation({
    data,
    schema: params.config.schema,
  });
}
