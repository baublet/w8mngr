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
    const quantity = new Qty(work, loweredIncomingUnit);
    return quantity.to(loweredOutgoingUnit).toString();
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
