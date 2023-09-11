export type ThunderType = {
    key: string;
    encrypt: boolean;
    expire: null | number;
    default: any;
    reducers?: {
        [key: string]: (thunder: any, payload: any) => any;
    };
    selectors?: {
        [key: string]: (thunder: any, payload: any) => any;
    };
};
