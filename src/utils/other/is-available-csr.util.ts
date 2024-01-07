export function isAvailableCsr(): boolean {
  return typeof window !== 'undefined';
}
