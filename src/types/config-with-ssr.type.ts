import { TConfig } from './config.type';

export type TConfigWithSSR<
  TSlice,
  TSSR extends boolean | undefined,
> = TConfig<TSlice> & {
  ssr: TSSR;
};
