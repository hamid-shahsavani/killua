export default function isAvailableCsr(): boolean {
  return typeof window !== 'undefined';
}
