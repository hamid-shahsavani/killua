import {
  TConfig,
  TDefaultServer,
  TReducers,
  TSelectors
} from '../../types/config.type';

export function generateSliceConfigChecksum<
  GSlice,
  GDefaultServer extends TDefaultServer<GSlice>,
  GSelectors extends TSelectors<GSlice>,
  GReducers extends TReducers<GSlice>
>(params: {
  config: TConfig<GSlice, GDefaultServer, GSelectors, GReducers>;
}): string {
  // generate checksum with slice config (include defaultServer, defaultClient, expire, obfuscate)
  const sliceConfigChecksum: string = btoa(
    JSON.stringify({
      defaultServer: params.config.defaultServer,
      defaultClient: params.config.defaultClient,
      expire: params.config.expire,
      obfuscate: params.config.obfuscate
    })
  ).toString();

  return sliceConfigChecksum;
}
