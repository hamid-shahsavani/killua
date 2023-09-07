export type ThunderType = {
  key: string;
  encrypt: boolean;
  expire: null | number;
  default: any;
  actions?: {
    [key: string]: (state: any, payload: any) => any;
  };
};
