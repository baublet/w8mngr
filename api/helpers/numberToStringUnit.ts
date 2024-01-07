import Qty from "js-quantities";

import { log } from "../config/log.js";
import { Context } from "../createContext.js";

export function numberToStringUnit({
  context,
  work: startingWork,
  incomingUnit,
  outgoingUnits,
}: {
  context: Context
  work?: number | string;
  incomingUnit: string;
  outgoingUnits: string[];
}): string {
  const work = startingWorkToNumber(startingWork);

  if (!work) {
    return "0";
  }
  const loweredIncomingUnit = incomingUnit.toLowerCase();
  const loweredOutgoingUnits = outgoingUnits.map((unit) => unit.toLowerCase());
  try {
    const quantityStrings: string[] = [];

    // The remainder is always stored in the loweredIncomingUnit format
    let remainder: number = work;
    for (let i = 0; i < loweredOutgoingUnits.length; i++) {
      if (remainder < 1) {
        break;
      }
      const unit = loweredOutgoingUnits[i];
      const nextUnit = loweredOutgoingUnits[i + 1];
      const isLastUnit = i + 1 > loweredOutgoingUnits.length - 1;

      // If this is the final unit in the set, round up; otherwise round down (so we can accumulate the remainder)
      const roundingFunction = !isLastUnit ? getRoundedUnit : Math.ceil;

      const rootUnit = new Qty(remainder, loweredIncomingUnit);
      const fullUnit = new Qty(
        roundingFunction(rootUnit.to(unit).scalar),
        unit
      );

      if (fullUnit.scalar > 0) {
        quantityStrings.push(fullUnit.toString());
      }
      if (nextUnit) {
        remainder -= fullUnit.to(loweredIncomingUnit).scalar;
      }
    }

    return quantityStrings.join(" ");
  } catch (error) {
    log(context, "error", "Unknown error converting units", {
      incomingUnit,
      outgoingUnits,
      work,
      error,
    });
    return `${work}`;
  }
}

function startingWorkToNumber(work: undefined | string | number): number {
  if (work === undefined) {
    return 0;
  }
  if (typeof work === "number") {
    return work;
  }
  if (typeof work === "string") {
    return parseInt(work, 10);
  }
  return 0;
}

function getRoundedUnit(num: number): number {
  return Math.round( num * 100 + Number.EPSILON ) / 100
}