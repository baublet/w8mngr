import Qty from "js-quantities";

import { log } from "../config/log.js";
import { Context } from "../createContext.js";

export function numberToNumericUnit({
  context,
  work,
  incomingUnit,
  outgoingUnit,
}: {
  context: Context;
  work: number;
  incomingUnit: string;
  outgoingUnit: string;
}): number {
  if (!work) {
    return 0;
  }

  const loweredIncomingUnit = incomingUnit.toLowerCase();
  const loweredOutgoingUnit = outgoingUnit.toLowerCase();
  try {
    const quantity = new Qty(work, loweredIncomingUnit).to(loweredOutgoingUnit);
    const roundedQuantity = round(quantity.scalar);
    return new Qty(roundedQuantity, loweredOutgoingUnit).scalar;
  } catch (error) {
    log(context, "error", "Unknown error converting units", {
      incomingUnit,
      outgoingUnit,
      work,
      error,
    });
    return work;
  }
}

function round(num: number): number {
  const m = Number((Math.abs(num) * 100).toPrecision(15));
  return (Math.round(m) / 100) * Math.sign(num);
}
