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
  handlePushFoodEntryData: (
    description: string,
    calories: string,
    fat: string,
    carbs: string,
    protein: string
  ) => void;
  handleAddFoodEntry: () => void;
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

function calculatedProps(
  inputAmount: number,
  amount: number,
  calories: number,
  fat: number,
  carbs: number,
  protein: number
) {
  const calculatedAmount = isNaN(inputAmount) ? amount : inputAmount,
    multiplier = calculateMultiplier(amount, calculatedAmount);
  return {
    amount: calculatedAmount,
    calories: Math.round(calories * multiplier),
    fat: Math.round(fat * multiplier),
    carbs: Math.round(carbs * multiplier),
    protein: Math.round(protein * multiplier)
  };
}

export default function AutocompleteFood(
  props: AutocompleteFoodComponentProps
): React.ReactComponentElement<any> {
  console.log("Render AutocompleteFood");
  const [selectedMeasurement, setSelectedMeasurement] = React.useState(0),
    [amount, setAmount] = React.useState(
      props.measurements[selectedMeasurement].amount
    ),
    canDoPrev = selectedMeasurement > 0,
    canDoNext = selectedMeasurement < props.measurements.length - 1,
    handleAmountChange = (event: any) => {
      setAmount(event.target.value);
    },
    {
      amount: calculatedAmount,
      calories,
      fat,
      carbs,
      protein
    } = calculatedProps(
      amount,
      props.measurements[selectedMeasurement].amount,
      props.measurements[selectedMeasurement].calories,
      props.measurements[selectedMeasurement].fat,
      props.measurements[selectedMeasurement].carbs,
      props.measurements[selectedMeasurement].protein
    ),
    renderMacro = (label: string, value: number) => {
      return (
        <div className="flex-grow text-center">
          {value}
          <div className="text-xxs uppercase opacity-50">{label}</div>
        </div>
      );
    },
    renderButton = (
      label: string,
      canDo: boolean,
      nextIndex: number,
      ButtonIcon: any
    ) => {
      return (
        <Button
          className={`p-2 ${canDo ? "" : "opacity-50"}`}
          onClick={
            !canDo
              ? () => {}
              : () => {
                  setSelectedMeasurement(nextIndex);
                  setAmount(props.measurements[nextIndex].amount);
                }
          }
        >
          <ButtonIcon />
          <span className="screen-reader-text">{label}</span>
        </Button>
      );
    };

  let measurementAmountRef: React.RefObject<HTMLInputElement> = null;

  React.useEffect(() => {
    if (!props.showMeasurements) return;
    // When a user clicks a food and shows a measurement, we want to add
    // that measurement data to the add food entry form. We pass down the
    // handlePushFoodEntryData function to handle this for us.
    props.handlePushFoodEntryData(
      `${calculatedAmount} ${props.measurements[selectedMeasurement].unit} ${
        props.name
      }`,
      calories.toString(),
      fat.toString(),
      carbs.toString(),
      protein.toString()
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
      {!props.showMeasurements
        ? false
        : renderButton(
            "Previous Measurement",
            canDoPrev,
            selectedMeasurement - 1,
            LeftIcon
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
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    props.handleAddFoodEntry();
                  }}
                >
                  <Input
                    name="amount"
                    placeholder=""
                    onChange={handleAmountChange}
                    value={amount.toString()}
                    getRef={ref => (measurementAmountRef = ref)}
                  />
                  <Button type="submit" className="screen-reader-text">
                    Add Food Entry to Food Log
                  </Button>
                </form>
              </div>
              <div className="w-16">
                {props.measurements[selectedMeasurement].unit}
              </div>
              {renderMacro("Calories", calories)}
              {renderMacro("Fat", fat)}
              {renderMacro("Carbs", carbs)}
              {renderMacro("Protein", protein)}
            </div>
          </div>
        )}
      </div>
      {!props.showMeasurements
        ? false
        : renderButton(
            "Next Measurement",
            canDoNext,
            selectedMeasurement + 1,
            RightIcon
          )}
    </div>
  );
}
