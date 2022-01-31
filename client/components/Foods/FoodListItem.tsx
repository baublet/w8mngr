import cx from "classnames";
import React from "react";
import { Link, useHistory } from "react-router-dom";

import { foodLogLocalStorage } from "../../helpers";
import { GhostInvertedButton } from "../Button/GhostInverted";
import { SystemGhostIconButton } from "../Button/SystemGhostIcon";
import { Input } from "../Forms";
import { Add } from "../Icons/Add";
import { ItemHeading } from "../Type/ItemHeading";

export function FoodsListItem({
  id,
  name,
  description,
  previewImageUrl,
  measurements,
}: {
  id: string;
  name: string;
  description?: string | null;
  previewImageUrl?: string | null;
  measurements: {
    edges: {
      node: {
        id: string;
        amount: number;
        measurement: string;
        calories: number;
        fat: number;
        carbs: number;
        protein: number;
      };
    }[];
  };
}) {
  const [showAll, setShowAll] = React.useState(false);

  const trimmedMeasurements = React.useMemo(() => {
    if (measurements.edges.length < 3 || showAll) {
      return measurements;
    }
    return {
      edges: measurements.edges.slice(0, 3),
    };
  }, [showAll]);

  const hasMore =
    trimmedMeasurements.edges.length !== measurements.edges.length;

  return (
    <div
      className={`
      hover:bg-slate-50
      hover:bg-opacity-50
      border
      border-slate-100
      hover:border-slate-300
      rounded-lg
      p-4
      hover:shadow-slate-500/10
      hover:shadow-lg
    `}
    >
      <div
        className={`
flex
flex-col
w-full
`}
      >
        <Link
          to={`/foods/edit/${id}`}
          className="flex w-full justify-start items-center text-left"
          title={`Edit Food: ${name}`}
        >
          {previewImageUrl && (
            <div className="self-start">
              <img
                src={previewImageUrl}
                className="w-24 h-auth rounded"
                title={description || "Food preview"}
              />
            </div>
          )}
          <div
            className={cx("flex w-full flex-col", {
              "ml-4": previewImageUrl,
            })}
          >
            <ItemHeading>{name}</ItemHeading>
            {description && (
              <div className="block mt-2 text-slate-700 text-opacity-80 leading-tight">
                {description.substr(0, 240)}
                {description.length > 240 ? "..." : ""}
              </div>
            )}
          </div>
        </Link>
        {trimmedMeasurements.edges.length === 0 ? null : (
          <div className="group mt-2">
            {trimmedMeasurements.edges.map((measurement) => (
              <Measurement
                key={measurement.node.id}
                {...measurement.node}
                foodName={name}
              />
            ))}
            <div className="w-full flex justify-end">
              {hasMore ? (
                <GhostInvertedButton
                  className="bg-slate-100 bg-opacity-50 text-slate-300 font-bold uppercase"
                  onClick={() => setShowAll(true)}
                  size="extra-small"
                  full
                >
                  {Math.abs(
                    trimmedMeasurements.edges.length - measurements.edges.length
                  )}{" "}
                  more
                </GhostInvertedButton>
              ) : null}
            </div>
            <div className="mt-2 p-2 gap-4 border-t border-slate-100 w-full hidden sm:flex">
              <Label className="w-3/12 sm:w-2/12 lg:w-1/12">amount</Label>
              <Label className="w-4/12 sm:3/12 lg:w-4/12">measurement</Label>
              <Label className="w-3/12 lg:w-3/12">calories</Label>
              <Label className="w-3/12 lg:w-1/12">fat</Label>
              <Label className="w-4/12 lg:w-1/12">carbs</Label>
              <Label className="w-3/12 lg:w-1/12">protein</Label>
              <div className="w-3/12 lg:w-1/12 flex justify-end"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Label({
  children,
  className,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={cx(
        "text-xs text-slate-400 group-hover:text-slate-600",
        className
      )}
    >
      {children}
    </div>
  );
}

function Measurement({
  foodName,
  amount,
  measurement,
  calories,
  carbs,
  fat,
  protein,
}: {
  foodName: string;
  id: string;
  amount: number;
  measurement: string;
  calories: number;
  fat: number;
  carbs: number;
  protein: number;
}) {
  const [uiMutableAmount, setAmount] = React.useState(amount);
  const amountString = uiMutableAmount.toString();
  const { push } = useHistory();

  const logThisEntry = () => {
    const foodLogStorage = foodLogLocalStorage();
    foodLogStorage.addItem({
      description: `${amountString} ${measurement} ${foodName}`,
      calories: measurementStringToNumberOrUndefined(
        getMeasurementWithMultiplier({
          currentAmount: uiMutableAmount,
          originalAmount: amount,
          measurementValue: calories,
        })
      ),
      fat: measurementStringToNumberOrUndefined(
        getMeasurementWithMultiplier({
          currentAmount: uiMutableAmount,
          originalAmount: amount,
          measurementValue: fat,
        })
      ),
      carbs: measurementStringToNumberOrUndefined(
        getMeasurementWithMultiplier({
          currentAmount: uiMutableAmount,
          originalAmount: amount,
          measurementValue: carbs,
        })
      ),
      protein: measurementStringToNumberOrUndefined(
        getMeasurementWithMultiplier({
          currentAmount: uiMutableAmount,
          originalAmount: amount,
          measurementValue: protein,
        })
      ),
    });
    push("/foodlog");
  };

  return (
    <div className="w-full flex items-center gap-4 border-t p-2 border-slate-100 text-xs uppercase text-slate-500 hover:bg-slate-100 rounded">
      <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 flex-grow w-full">
      <div className="w-3/12 sm:w-2/12 lg:w-1/12">
        <Input
          onChange={(value) => {
            const amount = parseInt(value, 10);
            if (isNaN(amount)) {
              setAmount(0);
              return;
            }
            setAmount(amount);
          }}
          type="text"
          value={amountString}
          placeholder={amountString}
          label="amount"
          showLabel={false}
        />
      </div>
      <div className="w-4/12 sm:3/12 lg:w-4/12">{measurement}</div>
      <div className="w-3/12 lg:w-3/12 text-lg font-thin">
        {getMeasurementWithMultiplier({
          currentAmount: uiMutableAmount,
          originalAmount: amount,
          measurementValue: calories,
        })}
        <Label className="sm:hidden">calories</Label>
      </div>
      <div className="w-3/12 lg:w-1/12 text-lg font-thin">
        {getMeasurementWithMultiplier({
          currentAmount: uiMutableAmount,
          originalAmount: amount,
          measurementValue: fat,
        })}<span className="opacity-75 lowercase"> g</span>
        <Label className="sm:hidden">fat</Label>
      </div>
      <div className="w-4/12 lg:w-1/12 text-lg font-thin">
        {getMeasurementWithMultiplier({
          currentAmount: uiMutableAmount,
          originalAmount: amount,
          measurementValue: carbs,
        })}<span className="opacity-75 lowercase"> g</span>
        <Label className="sm:hidden">carbs</Label>
      </div>
      <div className="w-3/12 lg:w-1/12 text-lg font-thin">
        {getMeasurementWithMultiplier({
          currentAmount: uiMutableAmount,
          originalAmount: amount,
          measurementValue: protein,
        })}<span className="opacity-75 lowercase"> g</span>
        <Label className="sm:hidden">protein</Label>
      </div>
      </div>
      <div className="w-3/12 lg:w-1/12 flex justify-end">
        <SystemGhostIconButton
          onClick={logThisEntry}
          title={`Log ${amountString} ${measurement} ${foodName}`}
        >
          <Add />
        </SystemGhostIconButton>
      </div>
    </div>
  );
}

export function measurementStringToNumberOrUndefined(
  subject?: string
): number | undefined {
  if (subject === undefined) {
    return undefined;
  }
  const numeric = parseInt(subject, 10);
  if (isNaN(numeric)) {
    return undefined;
  }
  return numeric;
}

export function getMeasurementWithMultiplier({
  currentAmount,
  measurementValue,
  originalAmount,
}: {
  originalAmount: number;
  currentAmount: number;
  measurementValue: number;
}): string {
  const originalAmountOr1 = originalAmount === 0 ? 1 : originalAmount;
  const currentAmountOr1 = currentAmount === 0 ? 1 : currentAmount;
  const multiplier = currentAmountOr1 / originalAmountOr1;
  const finalNumber = Math.ceil(measurementValue * multiplier);
  if (isNaN(finalNumber)) {
    return "0";
  }
  return finalNumber.toLocaleString();
}
