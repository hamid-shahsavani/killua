import { TSliceConfig } from '../types/slice-config.type';

export default function defaultSliceValue<T>(params: {
  config: TSliceConfig<T>;
  type: 'client' | 'server';
}) {
  const defaultSliceValue: {
    client: T;
    server: T;
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
