export const isString = (x: unknown): x is string => typeof x === 'string';

export const isEmptyString = (x: unknown): x is string =>
  isString(x) && x.length === 0;

export const isBoolean = (x: unknown): x is boolean => typeof x === 'boolean';

export const isNumber = (x: unknown): x is number => typeof x === 'number';

export const isObject = (
  x: unknown,
): x is Record<number | string | symbol, any> =>
  typeof x === 'object' && !Array.isArray(x) && x !== null;

export const isEmptyObject = (x: unknown): x is Record<any, any> =>
  isObject(x) && Object.keys(x).length === 0;

export const isFunction = (x: unknown): x is Function =>
  typeof x === 'function';

export const isUndefined = (x: unknown): x is undefined => x === undefined;

export const isNull = (x: unknown): x is null => x === null;
