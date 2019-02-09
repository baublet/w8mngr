import dateFromShortDate from "./dateFromShortDate";

const memoize = require("lodash.memoize");

const displayDate = (date: Date | number): string => {
  if (!date) {
    date = new Date();
  }
  if (!(date instanceof Date)) {
    date = dateFromShortDate(date);
  }

  return date.toLocaleDateString("en-us", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
};

export default memoize(displayDate);
