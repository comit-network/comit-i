import moment from "moment";

export function now() {
  return moment().unix();
}

export function relativeMinutesToTimestamp(minutes: number) {
  return now() + minutes * 60;
}
