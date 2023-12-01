import { TConfig } from '../types/config.type';

export default function defaultSliceValue<TSlice>(params: {
  config: TConfig<TSlice>;
  type: 'client' | 'server';
}) {
  const defaultSliceValue: {
    client: TSlice;
    server: TSlice;
  } = {
    client: params.config.ssr
      ? params.config.defaultClient
      : params.config.default,
    server: params.config.ssr
      ? params.config.defaultServer
      : params.config.default,
  };
  return defaultSliceValue[params.type];
}
