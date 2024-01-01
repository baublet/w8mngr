import addYears from "date-fns/addYears/index.js";
import subYears from "date-fns/subYears/index.js";

import { dayStringFromDate } from "../../shared/dayStringFromDate.js";
import { Maybe } from "../../shared/types.js";

export function getDateRangeWithDefault(args?: {
  from?: Maybe<Date>;
  to?: Maybe<Date>;
}) {
  let from = args?.from;
  let to = args?.to;

  if (!from && !to) {
    from = subYears(new Date(), 1);
    to = new Date();
  } else if (!from && to) {
    from = subYears(to, 1);
  } else if (from && !to) {
    to = addYears(from, 1);
  }

  return {
    from: dayStringFromDate(from as Date),
    to: dayStringFromDate(to as Date),
  };
}
