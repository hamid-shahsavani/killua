export default function isClientSide(): boolean {
  return typeof window !== 'undefined';
}
