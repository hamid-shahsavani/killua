export default function callSliceEvent<TSlice>({
  event,
  slice,
}: {
  slice: TSlice;
  event?: (slice: TSlice) => void;
}): void {
  if (event) {
    event(slice);
  }
}
