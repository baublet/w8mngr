import React from "react";
import cx from "classnames";
import { Link } from "react-router-dom";

import { ItemHeading } from "../Type/ItemHeading";
import { Input } from "../Forms";

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
          className="block flex w-full justify-start items-center text-left"
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
        {measurements.edges.length === 0 ? null : (
          <div className="group">
            {measurements.edges.map((measurement) => (
              <Measurement key={measurement.node.id} {...measurement.node} />
            ))}
            <div className="mt-4 border-t border-gray-100 flex w-full text-xs text-gray-400 group-hover:text-gray-600">
              <div className="w-1/12">amount</div>
              <div className="w-3/12">measurement</div>
              <div className="w-2/12">calories</div>
              <div className="w-2/12">fat</div>
              <div className="w-2/12">carbs</div>
              <div className="w-2/12">protein</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Measurement({
  id,
  amount,
  measurement,
  calories,
  carbs,
  fat,
  protein,
}: {
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

  return (
    <div className="w-full flex items-center gap-4 mt-2 border-t pt-2 border-gray-100 inline-block text-xs uppercase text-gray-500">
      <div className="w-1/12">
        <Input
          onChange={(value) => {
            const amount = parseInt(value, 10);
            if (isNaN(amount)) {
              setAmount(0)
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
      <div className="w-3/12">{measurement}</div>
      <div className="w-2/12">
        {getMeasurementWithMultiplier({
          currentAmount: uiMutableAmount,
          originalAmount: amount,
          measurementValue: calories,
        })}
      </div>
      <div className="w-2/12">
        {getMeasurementWithMultiplier({
          currentAmount: uiMutableAmount,
          originalAmount: amount,
          measurementValue: fat,
        })}
      </div>
      <div className="w-2/12">
        {getMeasurementWithMultiplier({
          currentAmount: uiMutableAmount,
          originalAmount: amount,
          measurementValue: carbs,
        })}
      </div>
      <div className="w-2/12">
        {getMeasurementWithMultiplier({
          currentAmount: uiMutableAmount,
          originalAmount: amount,
          measurementValue: protein,
        })}
      </div>
    </div>
  );
}

function getMeasurementWithMultiplier({
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
  return `${measurementValue * multiplier}`;
}
