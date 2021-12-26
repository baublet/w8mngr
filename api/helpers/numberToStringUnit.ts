import Qty from "js-quantities";

import { log } from "../config";

export function numberToStringUnit({
  work,
  incomingUnit,
  outgoingUnit,
}: {
  work: number;
  incomingUnit: string;
  outgoingUnit: string;
}): string {
  if (!work) {
    return "0";
  }
  const loweredIncomingUnit = incomingUnit.toLowerCase();
  const loweredOutgoingUnit = outgoingUnit.toLowerCase();
  try {
    const quantity = new Qty(work, loweredIncomingUnit).to(loweredOutgoingUnit);
    const roundedQuantity = round(quantity.scalar);
    return new Qty(roundedQuantity, loweredOutgoingUnit).toString();
  } catch (error) {
    log("error", "Unknown error converting units", {
      incomingUnit,
      outgoingUnit,
      work,
      error,
    });
    return `${work}`;
  }
}

function round(num: number): number {
  const m = Number((Math.abs(num) * 100).toPrecision(15));
  return (Math.round(m) / 100) * Math.sign(num);
}
