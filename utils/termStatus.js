import dayjs from "dayjs";

export function getTermStatus(startWeek, endWeek) {
  const today = dayjs();

  if (today.isBefore(dayjs(startWeek), "day")) return "Future";
  if (today.isAfter(dayjs(endWeek), "day")) return "Past";
  return "Active";
}
