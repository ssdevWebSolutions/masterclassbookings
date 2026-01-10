import dayjs from "dayjs";

export const getTermStart = (startWeek) =>
  dayjs(startWeek).startOf("week");

export const getTermEnd = (endWeek) =>
  dayjs(endWeek).endOf("week");

export const isDateInTerm = (date, startWeek, endWeek) => {
  if (!date) return false;
  return date.isBetween(
    getTermStart(startWeek),
    getTermEnd(endWeek),
    "day",
    "[]"
  );
};

export const weekText = (date) =>
  date
    ? `Week starting ${dayjs(date).startOf("week").format("DD MMM YYYY")}`
    : "";
