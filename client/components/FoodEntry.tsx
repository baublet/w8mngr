import * as React from "react";
import Input from "components/Forms/InputFoodEntry";

interface FoodEntryState {
  description: string;
  calories: string;
  fat: string;
  carbs: string;
  protein: string;
  [key: string]: string | number;
}

export default function FoodEntry(props: any) {
  const initialState: FoodEntryState = {
    description: props.description,
    calories: "",
    fat: "",
    carbs: "",
    protein: ""
  };

  const [values, setValues] = React.useState(initialState),
    onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({
        ...values,
        [event.target.name]: event.target.value
      });
    };

  return (
    <>
      <Input
        name="description"
        value={values.description}
        placeholder="Description"
        onChange={onChange}
        hideLabel={true}
      />
      <div className="flex">
        <div>
          <Input
            name="calories"
            value={values.calories}
            label="Calories"
            onChange={onChange}
          />
        </div>
        <div className="ml-1">
          <Input
            name="fat"
            value={values.fat}
            label="Fat"
            onChange={onChange}
          />
        </div>
        <div className="ml-1">
          <Input
            name="carbs"
            value={values.carbs}
            label="Carbs"
            onChange={onChange}
          />
        </div>
        <div className="ml-1">
          <Input
            name="protein"
            value={values.protein}
            label="Protein"
            onChange={onChange}
          />
        </div>
      </div>
    </>
  );
}
