export default function generateSliceKeyName(key: string): string {
  return `slice${key.charAt(0).toUpperCase()}${key.slice(1)}`;
}
