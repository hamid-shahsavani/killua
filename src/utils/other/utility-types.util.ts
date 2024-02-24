// remove param `value` from selectors and reducers
export type URemoveValueFromParam<GSlice, GFn> = GFn extends (
  value: GSlice,
  ...args: infer Rest
) => infer R
  ? (...args: Rest) => R
  : never;

// remove never properties from return object
export type URemoveNeverProperties<GReturn> = {
  [K in keyof GReturn as GReturn[K] extends never ? never : K]: GReturn[K];
};
