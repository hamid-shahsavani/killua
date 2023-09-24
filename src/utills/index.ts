export type IsExactlyNever<T> = [T] extends [never] ? true : false;

export type RemoveNeverProperties<T> = {
  [K in keyof T as IsExactlyNever<T[K]> extends true ? never : K]: T[K];
};
