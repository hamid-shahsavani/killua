import {
  TConfig,
  TDefaultServer,
  TReducers,
  TSelectors
} from '../../types/config.type';

export default function schemaValidation<
  GSlice,
  GDefaultServer extends TDefaultServer<GSlice>,
  GSelectors extends TSelectors<GSlice>,
  GReducers extends TReducers<GSlice>
>(params: {
  data: GSlice;
  config: TConfig<GSlice, GDefaultServer, GSelectors, GReducers>;
}): GSlice {
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
