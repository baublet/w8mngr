import { coalesce } from "./coalesce";

it.each([
  [[false, "3"], "3"],
  [["3", "4"], "3"],
  [["0", "4"], "0"],
  [["", "4"], "4"],
])("returns the right value", (args: any, expected) => {
  expect(coalesce(...(args as [any, any]))).toEqual(expected);
});

it("passes type tests", () => {
  let a: string | undefined;
  const b = "test";

  // @ts-expect-error
  const c: number = coalesce(a, b);
  // @ts-expect-error
  const d: undefined = coalesce(a, b);
  // @ts-expect-error
  const e: null = coalesce(a, b);

  const f: string = coalesce(a, b);
  expect(f).toEqual(b);

  const aa: { id: string }[] = [];
  const bb: never[] = [];

  // @ts-expect-error
  const cc: never[] = coalesce(aa, bb);
  // @ts-expect-error
  const dd: string[] = coalesce(aa, bb);

  const ee: { id: string }[] = coalesce(aa, bb);
});
