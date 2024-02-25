export function generateSliceStorageKey(params: { key: string }): string {
  return `killua-${params.key}`;
}
