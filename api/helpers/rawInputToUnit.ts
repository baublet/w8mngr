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
  const quantity = new Qty(work.toLowerCase());
  if (quantity.isUnitless()) {
    return new Qty(`${work} ${defaultUnit.toLowerCase()}`).to(unit).scalar;
  }
  return quantity.to(unit).scalar;
}
