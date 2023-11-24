export default function callSliceEvent<T>({
  event,
  slice,
}: {
  slice: T;
  event?: (slice: T) => void;
}): void {
  if (event) {
    event(slice);
  }
}
