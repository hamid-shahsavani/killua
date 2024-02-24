export function generateSliceStorageKey(params: { key: string }): string {
  return `slice-${params.key}`;
}
