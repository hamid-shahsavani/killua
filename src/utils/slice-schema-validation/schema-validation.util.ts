import { TConfig } from '../../types/config.type';

export default function schemaValidation<TSlice>(params: {
  data: TSlice;
  schema: TConfig<TSlice>['schema'];
}): TSlice {
  if (!params.schema) {
    return params.data;
  }
  return params.schema.parse(params.data);
}
