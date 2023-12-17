export default function timeStringToSeconds(params: {
  timeString: string;
}): number {
  const timeComponents: string[] = params.timeString.split('-');
  let seconds = 0;
  for (const component of timeComponents) {
    const unit: string = component.slice(-1);
    const value: number = parseInt(component.slice(0, -1), 10);
    switch (unit) {
      case 'd':
        seconds += value * 86400;
        break;
      case 'h':
        seconds += value * 3600;
        break;
      case 'm':
        seconds += value * 60;
        break;
      case 's':
        seconds += value;
        break;
      default:
        return NaN;
    }
  }
  return seconds;
}
