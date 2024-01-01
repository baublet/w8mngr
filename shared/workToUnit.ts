import type { ActivityType, Unit } from "../api/generated.js";

export function workToUnit({
  work,
  unit,
  activityType,
}: {
  work: number;
  unit: Unit;
  activityType: ActivityType;
}): number {
  switch (activityType) {
    case "DISTANCE":
      return convertDistance({ work, unit });
    case "WEIGHT":
      return convertWeight({ work, unit });
    case "TIMED":
      return convertTime({ work, unit });
  }
  return work;
}

function convertDistance({ work, unit }: { work: number; unit: Unit }): number {
  switch (unit) {
    case "CENTIMETERS":
    case "CM":
      return round(work / 10);
    case "MILES":
    case "MI":
      return round(work / 1609344);
    case "KILOMETERS":
    case "KM":
    case "K":
      return round(work / 1000000);
  }
  return work;
}

function convertWeight({ work, unit }: { work: number; unit: Unit }): number {
  switch (unit) {
    case "KG":
    case "KILOGRAMS":
      return round(work / 1000);
    case "OUNCES":
    case "OZ":
      return round(work * 0.035274);
    case "LB":
    case "LBS":
      return round(work * 0.00220462);
  }
  return work;
}

function convertTime({ work, unit }: { work: number; unit: Unit }): number {
  switch (unit) {
    case "MILLISECONDS":
    case "MS":
      return work * 1000;
    case "HOURS":
      return round(work / 60 / 60);
    case "MINUTES":
      return round(work / 60);
    case "DAYS":
      return round(work / 60 / 60 / 24);
  }
  return work;
}

function round(num: number): number {
  const m = Number((Math.abs(num) * 100).toPrecision(15));
  return (Math.round(m) / 100) * Math.sign(num);
}
