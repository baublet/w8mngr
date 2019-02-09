import * as React from "react";
import Panel from "components/Panels/Panel";
import Input from "components/Forms/Input";

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
    <Panel>
      <Input
        name="description"
        value={values.description}
        placeholder="Description"
        onChange={onChange}
      />
      <div className="flex">
        <div>
          <Input
            name="calories"
            value={values.calories}
            placeholder="Calories"
            onChange={onChange}
          />
        </div>
        <div className="ml-1">
          <Input
            name="fat"
            value={values.fat}
            placeholder="Fat"
            onChange={onChange}
          />
        </div>
        <div className="ml-1">
          <Input
            name="carbs"
            value={values.carbs}
            placeholder="Carbs"
            onChange={onChange}
          />
        </div>
        <div className="ml-1">
          <Input
            name="protein"
            value={values.protein}
            placeholder="Protein"
            onChange={onChange}
          />
        </div>
      </div>
    </Panel>
  );
}
