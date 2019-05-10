export function now() {
  return Math.floor((Date.now ? Date.now() : new Date().getTime()) / 1000);
}

export function relativeMinutesToTimestamp(minutes: number) {
  return now() + minutes * 60;
}
