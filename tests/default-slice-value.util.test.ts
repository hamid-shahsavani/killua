import { describe, expect, it } from 'vitest';
import defaultSliceValue from '../src/utils/default-slice-value.util';
import { TSliceConfig } from '../src/types/slice-config.type';

describe('default-slice-value.util.ts', () => {
  it('should return the default value when type is "client" and ssr is false', () => {
    const config: TSliceConfig<string> = {
      key: 'test',
      ssr: false,
      expire: null,
      encrypt: true,
      default: 'default value',
    };
    const result = defaultSliceValue<string>({ config, type: 'client' });
    expect(result).toBe(config.default);
  });
  it('should return the default value when type is "server" and ssr is true', () => {
    const config: TSliceConfig<string> = {
      key: 'test',
      ssr: true,
      expire: null,
      encrypt: true,
      defaultClient: 'client value',
      defaultServer: 'server value',
    };
    const result = defaultSliceValue<string>({ config, type: 'server' });
    expect(result).toBe(config.defaultServer);
  });
  it('should return the default value when type is "server" and ssr is false', () => {
    const config: TSliceConfig<string> = {
      key: 'test',
      ssr: true,
      expire: null,
      encrypt: true,
      defaultClient: 'client value',
      defaultServer: 'server value',
    };
    const result = defaultSliceValue({ config, type: 'client' });
    expect(result).toBe(config.defaultClient);
  });
});
