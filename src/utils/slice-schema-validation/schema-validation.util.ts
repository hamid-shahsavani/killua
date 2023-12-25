import { TConfig } from '../../types/config.type';

export default function schemaValidation<TSlice>(params: {
  data: TSlice;
  config: TConfig<TSlice>;
}): TSlice {
  let returnValue = params.data;
  if (params.config.schema) {
    if ('parse' in params.config.schema) {
      returnValue = params.config.schema.parse(params.data);
    }
    if ('validateSync' in params.config.schema) {
      returnValue =
        params.config.schema.validateSync(params.data) || params.data;
    }
  }
  return returnValue;
}
