import Qty from "js-quantities";

export function rawInputToUnit({
  work,
  unit,
  defaultUnit,
}: {
  work?: string | null;
  unit: "millimeters" | "grams" | "seconds";
  defaultUnit: string;
}): number {
  if (!work) {
    return 0;
  }
  let quantity = new Qty(work);
  if (quantity.isUnitless()) {
    quantity = new Qty(`${work} ${defaultUnit}`);
  }
  return quantity.to(unit).baseScalar;
}
