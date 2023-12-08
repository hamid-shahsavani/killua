export default function generateSliceKeyName(params: { key: string }): string {
  return `slice-${params.key}`;
}
