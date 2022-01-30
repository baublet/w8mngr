import Qty from "js-quantities";

import { log } from "../config/log";

export function numberToStringUnit({
  work: startingWork,
  incomingUnit,
  outgoingUnits,
}: {
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
      const roundingFunction = !isLastUnit ? Math.floor : Math.ceil;

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
    log("error", "Unknown error converting units", {
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
