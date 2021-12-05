import React from "react";
import cx from "classnames";
import { Link, useHistory } from "react-router-dom";

import { ItemHeading } from "../Type/ItemHeading";
import { Input } from "../Forms";
import { SystemGhostIconButton } from "../Button/SystemGhostIcon";
import { Add } from "../Icons/Add";

import { foodLogLocalStorage } from "../../helpers";
import { SystemOutlineButton } from "../Button/SystemOutline";
import { GhostInvertedButton } from "../Button/GhostInverted";

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
hover:bg-gray-50
hover:bg-opacity-50
border
border-transparent
border-gray-100
hover:border-gray-100
rounded
p-4
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
              <div className="block mt-2 text-gray-700 text-opacity-80 leading-tight">
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
            <div className="mt-2 p-2 gap-4 border-t border-gray-100 flex w-full text-xs text-gray-400 group-hover:text-gray-600">
              <div className="w-1/12">amount</div>
              <div className="w-4/12">measurement</div>
              <div className="w-3/12">calories</div>
              <div className="w-1/12">fat</div>
              <div className="w-1/12">carbs</div>
              <div className="w-1/12">protein</div>
              <div className="w-1/12"></div>
            </div>
          </div>
        )}
      </div>
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
    <div className="w-full flex items-center gap-4 border-t p-2 border-gray-100 text-xs uppercase text-gray-500 hover:bg-gray-50">
      <div className="w-1/12">
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
      <div className="w-4/12">{measurement}</div>
      <div className="w-3/12">
        {getMeasurementWithMultiplier({
          currentAmount: uiMutableAmount,
          originalAmount: amount,
          measurementValue: calories,
        })}
      </div>
      <div className="w-1/12">
        {getMeasurementWithMultiplier({
          currentAmount: uiMutableAmount,
          originalAmount: amount,
          measurementValue: fat,
        })}
      </div>
      <div className="w-1/12">
        {getMeasurementWithMultiplier({
          currentAmount: uiMutableAmount,
          originalAmount: amount,
          measurementValue: carbs,
        })}
      </div>
      <div className="w-1/12">
        {getMeasurementWithMultiplier({
          currentAmount: uiMutableAmount,
          originalAmount: amount,
          measurementValue: protein,
        })}
      </div>
      <div className="w-1/12 flex justify-end">
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
  if(isNaN(finalNumber)) {
    return "0";
  }
  return `${finalNumber}`;
}
