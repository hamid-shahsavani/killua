import { describe, expect, it } from 'vitest';
import defaultSliceValue from '../src/utils/default-slice-value.util';
import { TConfig } from '../src/types/config.type';

describe('default-slice-value.util.ts', (): void => {
  it('should return the default value when type is "client" and ssr is false', (): void => {
    const config: TConfig<string> = {
      key: 'test',
      ssr: false,
      encrypt: true,
      default: 'default value',
    };
    const result = defaultSliceValue<string>({ config, type: 'client' });
    expect(result).toBe(config.default);
  });
  it('should return the default value when type is "server" and ssr is true', (): void => {
    const config: TConfig<string> = {
      key: 'test',
      ssr: true,
      encrypt: true,
      defaultClient: 'client value',
      defaultServer: 'server value',
    };
    const result = defaultSliceValue<string>({ config, type: 'server' });
    expect(result).toBe(config.defaultServer);
  });
  it('should return the default value when type is "server" and ssr is false', (): void => {
    const config: TConfig<string> = {
      key: 'test',
      ssr: true,
      encrypt: true,
      defaultClient: 'client value',
      defaultServer: 'server value',
    };
    const result = defaultSliceValue({ config, type: 'client' });
    expect(result).toBe(config.defaultClient);
  });
});
