import * as React from "react";
import { FoodType } from "api/foods/types";
import Input from "components/Forms/InputAutocompleteFood";
import Button from "components/Button/SecondaryIconFill";
import RightIcon from "components/Icons/Right";
import LeftIcon from "components/Icons/Left";

interface AutocompleteFoodComponentProps extends FoodType {
  key: number;
  onClick: () => void;
  showMeasurements: boolean;
  index: number;
  pushMacros: (
    description: string,
    calories: string,
    fat: string,
    carbs: string,
    protein: string
  ) => void;
}

function calculateMultiplier(
  originalAmount: number,
  newAmount: number
): number {
  if (originalAmount == newAmount) return 1;
  if (originalAmount > newAmount)
    return 1 - (originalAmount - newAmount) / originalAmount;
  return 1 + (newAmount - originalAmount) / originalAmount;
}

export default function AutocompleteFood(
  props: AutocompleteFoodComponentProps
): React.ReactComponentElement<any> {
  const [selectedMeasurement, setSelectedMeasurement] = React.useState(0),
    [amount, setAmount] = React.useState(
      props.measurements[selectedMeasurement].amount
    ),
    canDoPrev = selectedMeasurement > 0,
    canDoNext = selectedMeasurement < props.measurements.length - 1,
    amountChange = (event: any) => {
      setAmount(event.target.value);
    },
    calculatedAmount = isNaN(amount)
      ? props.measurements[selectedMeasurement].amount
      : amount,
    multiplier = calculateMultiplier(
      props.measurements[selectedMeasurement].amount,
      calculatedAmount
    ),
    calc = (num: number) => {
      return Math.round(num * multiplier);
    },
    calculatedCalories = calc(props.measurements[selectedMeasurement].calories),
    calculatedFat = calc(props.measurements[selectedMeasurement].fat),
    calculatedCarbs = calc(props.measurements[selectedMeasurement].carbs),
    calculatedProtein = calc(props.measurements[selectedMeasurement].protein);

  let measurementAmountRef: React.RefObject<HTMLInputElement> = null;

  React.useEffect(() => {
    if (!props.showMeasurements) return;
    props.pushMacros(
      `${calculatedAmount} ${props.measurements[selectedMeasurement].unit} ${
        props.name
      }`,
      calculatedCalories.toString(),
      calculatedFat.toString(),
      calculatedCarbs.toString(),
      calculatedProtein.toString()
    );
    if (measurementAmountRef && measurementAmountRef.current) {
      measurementAmountRef.current.focus();
    }
  });

  return (
    <div
      className={`
        flex -mx-3 text-xs border-primaryTextSlight border-b
        ${!props.showMeasurements ? "p-2" : "bg-primaryLight"}
        ${props.index > 0 ? "" : "border-t"}
      `}
      onClick={props.onClick}
    >
      {!props.showMeasurements ? (
        false
      ) : (
        <Button
          className={`p-2 ${canDoPrev ? "" : "opacity-50"}`}
          onClick={
            !canDoPrev
              ? () => {}
              : () => {
                  setSelectedMeasurement(selectedMeasurement - 1);
                  setAmount(props.measurements[selectedMeasurement - 1].amount);
                }
          }
        >
          <LeftIcon />
        </Button>
      )}
      <div className={`flex-grow ${!props.showMeasurements ? "" : "p-2"}`}>
        <div>{props.name}</div>
        {!props.showMeasurements ? (
          false
        ) : (
          <div className="mt-1">
            <div
              className="flex justify-around"
              key={props.measurements[selectedMeasurement].id}
            >
              <div className="w-8">
                <Input
                  name="amount"
                  placeholder=""
                  onChange={amountChange}
                  value={amount.toString()}
                  getRef={ref => (measurementAmountRef = ref)}
                />
              </div>
              <div className="w-16">
                {props.measurements[selectedMeasurement].unit}
              </div>
              <div className="flex-grow text-center">
                {calculatedCalories}
                <div className="text-xxs uppercase opacity-50">Calories</div>
              </div>
              <div className="flex-grow text-center">
                {calculatedFat}
                <div className="text-xxs uppercase opacity-50">Fat</div>
              </div>
              <div className="flex-grow text-center">
                {calculatedCarbs}
                <div className="text-xxs uppercase opacity-50">Carbs</div>
              </div>
              <div className="flex-grow text-center">
                {calculatedProtein}
                <div className="text-xxs uppercase opacity-50">Protein</div>
              </div>
            </div>
          </div>
        )}
      </div>
      {!props.showMeasurements ? (
        false
      ) : (
        <Button
          className={`p-2 ${canDoNext ? "" : "opacity-50"}`}
          onClick={
            !canDoNext
              ? () => {}
              : () => {
                  setSelectedMeasurement(selectedMeasurement + 1);
                  setAmount(props.measurements[selectedMeasurement + 1].amount);
                }
          }
        >
          <RightIcon />
        </Button>
      )}
    </div>
  );
}
