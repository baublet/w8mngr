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

  // Break the units into pairs of units and values (allows for input like "5lbs 3oz")
  const pairs = breakInputIntoValueUnitPairs(work);

  if (pairs.length === 0) {
    return Math.floor(
      new Qty(`${work} ${defaultUnit.toLowerCase()}`).to(unit).scalar,
    );
  }

  let rootUnitValue: number = 0;
  for (const [value, inputUnit] of pairs) {
    rootUnitValue += new Qty(value, inputUnit).to(unit).scalar;
  }

  return Math.floor(new Qty(rootUnitValue, unit).scalar);
}

export function breakInputIntoValueUnitPairs(
  input: string,
): [number, string][] {
  const valueUnitPairs: [number, string][] = [];

  const pairs = input.match(/(\d+\s*\w+)/g);

  if (!pairs) {
    return [];
  }

  for (const pair of pairs) {
    const digits = pair.match(/(\d+)/);
    const units = pair.match(/\s*(\D+)/);

    if (!digits || !units) {
      continue;
    }
    const digitNumber = parseInt(digits[0], 10);
    const unit = units[0].toLowerCase();
    valueUnitPairs.push([digitNumber, unit]);
  }

  return valueUnitPairs;
}
