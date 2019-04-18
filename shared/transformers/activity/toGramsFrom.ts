const massUnits = {
  g: 1,
  kg: 1000,
  kilo: 1000,
  kilos: 1000,
  kilogram: 1000,
  kilograms: 1000,
  lb: 453.592,
  pounds: 453.592,
  pound: 453.592,
  st: 6350.29,
  stone: 6350.29,
  stones: 6350.29
};

export default function toGramsFrom(num: number, unit: string): number {
  if (!massUnits[unit]) {
    return num;
  }
  return Math.floor(massUnits[unit] * num);
}
