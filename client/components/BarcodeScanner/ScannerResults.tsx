import React from "react";
import cx from "classnames";

import {
  GetCurrentUserFoodLogDocument,
  useCreateOrUpdateFoodLogMutation,
} from "../../generated";
import { Input } from "../Forms/Input";
import { getMeasurementWithMultiplier } from "../Foods/FoodListItem";
import { Add } from "../Icons/Add";
import { SecondaryOutlineButton } from "../Button/SecondaryOutline";
import { CloseIcon } from "../Icons/Close";

export function ScannerResults({
  code,
  day,
  close,
  setLoadingFinished,
  notFound,
  onAdded,
}: {
  code: string;
  day: string;
  close: () => void;
  setLoadingFinished: () => void;
  notFound: () => void;
  onAdded: () => void;
}) {
  const [loading, setLoading] = React.useState(true);
  const [result, setResult] = React.useState<
    | {
        name: string;
        image?: string;
        description: string;
        measurements: {
          amount: number;
          measurement: string;
          calories: number;
          fat: number;
          carbs: number;
          protein: number;
        }[];
      }
    | undefined
  >(undefined);

  React.useEffect(() => {
    fetch(`https://world.openfoodfacts.org/api/v0/product/${code}.json`)
      .then(async (result) => {
        const json: {
          product: {
            serving_size: string;
            ingredients_text_en: string;
            product_name_en: string;
            product_name_en_imported: string;
            nutriments: {
              carbohydrates: number;
              carbohydrates_100g: number;
              carbohydrates_serving: number;
              carbohydrates_unit: string;
              carbohydrates_value: number;
              energy: number;
              "energy-kcal": number;
              "energy-kcal_100g": number;
              "energy-kcal_serving": number;
              "energy-kcal_unit": string;
              "energy-kcal_value": number;
              energy_100g: number;
              energy_serving: number;
              energy_unit: string;
              energy_value: number;
              fat: number;
              fat_100g: number;
              fat_serving: number;
              fat_unit: number;
              fat_value: number;
              proteins: number;
              proteins_100g: number;
              proteins_serving: number;
              proteins_unit: string;
              proteins_value: number;
            };
          };
        } = await result.json();
        if (!json || !json.product) {
          notFound();
          return;
        }
        setResult({
          name: json.product.product_name_en,
          description: json.product.product_name_en_imported,
          measurements: [
            {
              amount: 100,
              measurement: "g",
              calories: json.product.nutriments["energy-kcal_100g"],
              fat: json.product.nutriments.fat_100g,
              carbs: json.product.nutriments.carbohydrates_100g,
              protein: json.product.nutriments.proteins_100g,
            },
            ...(!json.product.serving_size
              ? []
              : [
                  {
                    amount: 1,
                    measurement: `serving (${json.product.serving_size})`,
                    calories: json.product.nutriments["energy-kcal_serving"],
                    fat: json.product.nutriments.fat_serving,
                    carbs: json.product.nutriments.carbohydrates_serving,
                    protein: json.product.nutriments.proteins_serving,
                  },
                ]),
          ],
        });
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
        setLoadingFinished();
      });
  }, [code]);

  const [createFoodLog, { loading: saving }] = useCreateOrUpdateFoodLogMutation(
    {
      onCompleted: () => {
        onAdded();
      },
      refetchQueries: [
        {
          query: GetCurrentUserFoodLogDocument,
          variables: {
            day,
          },
        },
      ],
    }
  );
  const getSaveFoodLogHandler = React.useCallback(
    ({
      amount,
      name,
      measurement,
      ...foodLog
    }: {
      amount: number;
      measurement: string;
      name: string;
      calories?: number;
      fat?: number;
      carbs?: number;
      protein?: number;
    }) => {
      const description = `${amount} ${measurement} ${name}`;
      return () =>
        createFoodLog({
          variables: {
            input: {
              day,
              foodLogs: [
                {
                  ...foodLog,
                  description,
                },
              ],
            },
          },
        });
    },
    []
  );

  if (!result || loading || !result.name) {
    return null;
  }

  return (
    <div
      className={cx(
        "toast flex flex-col gap-2 bg-opacity-95 bg-slate-900 shadow-lg text-slate-100 rounded overflow:hidden p-2 md:p-4",
        {
          "hover:bg-slate-800": !open,
          "opacity-75 pointer-events-none": saving,
        }
      )}
    >
      <div className="flex gap-4 justify-between items-center">
        <div className="w-full flex flex-col gap-2 flex-shrink cursor-pointer">
          <h4
            className={cx("font-thin", {
              "opacity-75 hover:opacity-100": !open,
            })}
          >
            {result.name}
          </h4>
          <div className="text-xs">{result.description}</div>
        </div>
        <button
          onClick={close}
          className={"bg-rose-600 hover:bg-rose-400 p-4 rounded"}
        >
          <CloseIcon />
        </button>
      </div>
      <div>
        {result.measurements.map((measurement, i) => (
          <Measurement
            name={result.name}
            measurement={measurement}
            key={i}
            getHandler={getSaveFoodLogHandler}
          />
        ))}
      </div>
    </div>
  );
}

function Measurement({
  name,
  getHandler,
  measurement: {
    amount: defaultAmount,
    measurement,
    calories,
    fat,
    carbs,
    protein,
  },
}: {
  name: string;
  getHandler: (args: {
    amount: number;
    name: string;
    measurement: string;
    calories: number;
    fat: number;
    carbs: number;
    protein: number;
  }) => () => void;
  measurement: {
    amount: number;
    measurement: string;
    calories: number;
    fat: number;
    carbs: number;
    protein: number;
  };
}) {
  const [amount, setAmount] = React.useState(defaultAmount.toString());
  const amountNumberMaybeNaN = parseInt(amount, 10);
  const amountNumber = isNaN(amountNumberMaybeNaN) ? 1 : amountNumberMaybeNaN;

  const save = React.useCallback(() => {
    setAmount((currentAmountString) => {
      const currentAmount = stringValueToNumberOrZero(currentAmountString);
      getHandler({
        name,
        amount: amountNumber,
        measurement,
        calories: stringValueToNumberOrZero(
          getMeasurementWithMultiplier({
            currentAmount,
            originalAmount: defaultAmount,
            measurementValue: calories,
          })
        ),
        fat: stringValueToNumberOrZero(
          getMeasurementWithMultiplier({
            currentAmount,
            originalAmount: defaultAmount,
            measurementValue: fat,
          })
        ),
        carbs: stringValueToNumberOrZero(
          getMeasurementWithMultiplier({
            currentAmount,
            originalAmount: defaultAmount,
            measurementValue: carbs,
          })
        ),
        protein: stringValueToNumberOrZero(
          getMeasurementWithMultiplier({
            currentAmount,
            originalAmount: defaultAmount,
            measurementValue: protein,
          })
        ),
      })();
      return amount;
    });
  }, []);

  return (
    <div
      className="flex gap-2 w-full cursor-pointer"
      tabIndex={1}
      aria-role="button"
      title="Add food"
    >
      <div className="hidden md:block">
        <SecondaryOutlineButton
          onClick={save}
          className="h-12 w-12 rounded-full flex items-center justify-center hover:bg-emerald-500 hover:border-transparent hover:text-slate-50"
        >
          <Add />
        </SecondaryOutlineButton>
      </div>
      <div className="flex gap-2 items-end w-full text-sm flex-col md:flex-row pointer-events-none">
        <div className="flex gap-2 items-end w-full pointer-events-auto">
          <div className="w-20">
            <Input
              placeholder="Amount"
              value={amount}
              onChange={setAmount}
              type="text"
              size="sm"
              className="text-slate-900"
            />
            <Label input>amount</Label>
          </div>
          <div className="grow">
            {measurement}
            <Label>measurement</Label>
          </div>
          <div className="md:hidden">
            <SecondaryOutlineButton
              onClick={save}
              className="h-12 w-12 rounded-full flex items-center justify-center hover:bg-emerald-500 hover:border-transparent hover:text-slate-50"
            >
              <Add />
            </SecondaryOutlineButton>
          </div>
        </div>
        <div className="flex gap-2 items-end w-full">
          <div className="grow">
            {getMeasurementWithMultiplier({
              currentAmount: amountNumber,
              originalAmount: defaultAmount,
              measurementValue: calories,
            })}
            <Label>calories</Label>
          </div>
          <div className="grow">
            {getMeasurementWithMultiplier({
              currentAmount: amountNumber,
              originalAmount: defaultAmount,
              measurementValue: fat,
            })}
            <Label>fat</Label>
          </div>
          <div className="grow">
            {getMeasurementWithMultiplier({
              currentAmount: amountNumber,
              originalAmount: defaultAmount,
              measurementValue: carbs,
            })}
            <Label>carbs</Label>
          </div>
          <div className="grow">
            {getMeasurementWithMultiplier({
              currentAmount: amountNumber,
              originalAmount: defaultAmount,
              measurementValue: protein,
            })}
            <Label>protein</Label>
          </div>
        </div>
      </div>
    </div>
  );
}

function Label({
  children,
  input,
}: React.PropsWithChildren<{ input?: boolean }>) {
  return (
    <div
      className={cx("text-xs text-slate-400 truncate", {
        "mt-2": input === undefined,
      })}
    >
      {children}
    </div>
  );
}

function stringValueToNumberOrZero(value: string): number {
  const valueNumber = parseFloat(value);
  if (isNaN(valueNumber)) {
    return 0;
  }
  return valueNumber;
}
