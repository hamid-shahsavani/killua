export type TSlice<T> = Readonly<{
  key: string;
  default: T | Record<'client' | 'server', T>;
  encrypt: boolean;
  expire: number | null;
  schema?: any;
  events?: {
    onChange?: (value: T) => void;
    onExpire?: (value: T) => void;
    onInitialize?: (
      value: T,
    ) => void | Record<'client' | 'server', (value: T) => void>;
  };
  reducers?: Record<string, (value: T, payload?: any) => T>;
  selectors?: Record<string, (value: T, payload?: any) => any>;
}>;
