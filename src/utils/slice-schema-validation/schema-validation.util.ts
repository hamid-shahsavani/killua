import { TConfig } from '../../types/config.type';

export default function schemaValidation<TSlice>(params: {
  data: TSlice;
  schema: TConfig<TSlice>['schema'];
}): TSlice {
  let returnValue = params.data;
  if (params.schema) {
    if ('parse' in params.schema) {
      returnValue = params.schema.parse(params.data);
    }
    if ('validateSync' in params.schema) {
      returnValue = params.schema.validateSync(params.data) || params.data;
    }
  }
  return returnValue;
}
