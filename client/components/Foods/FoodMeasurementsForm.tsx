import React from "react";
import { ulid } from "ulid";

import { Add } from "../Icons/Add";
import { Input } from "../Forms";
import { SystemOutlineIconButton } from "../Button/SystemOutlineIcon";
import { DeleteIconButton } from "../Button/DeleteIconButton";
import { FormSubHeading } from "../Type/FormSubHeading";

import { Measurement } from "../../generated";
import { useForm } from "../../helpers";

type FormMeasurementInput = Partial<
  Pick<
    Measurement,
    "id" | "amount" | "calories" | "carbs" | "fat" | "measure" | "protein"
  >
> & { internalId: string };

export function FoodMeasurementsForm({
  initialData = [],
}: {
  initialData?: FormMeasurementInput[];
}) {
  const [measurements, setMeasurements] = React.useState(initialData);

  const addMeasurement = React.useCallback(() => {
    setMeasurements((measurements) => [
      ...measurements,
      {
        internalId: ulid(),
      },
    ]);
  }, []);

  const deleteMeasurement = React.useCallback((internalId: string) => {
    setMeasurements((measurements) =>
      measurements.filter(
        (measurement) => measurement.internalId !== internalId
      )
    );
  }, []);

  return (
    <div>
      <FormSubHeading
        leftIcon={
          <SystemOutlineIconButton
            leftIcon={<Add />}
            onClick={addMeasurement}
          />
        }
      >
        Measurements
      </FormSubHeading>
      <div>
        {measurements.map((measurement) => (
          <MeasurementForm
            key={measurement.internalId}
            onDelete={deleteMeasurement}
            measurement={measurement}
          />
        ))}
      </div>
    </div>
  );
}

function MeasurementForm({
  measurement,
  onDelete,
}: {
  measurement: FormMeasurementInput;
  onDelete: (internalId: string) => void;
}) {
  const formData = useForm<{
    id: string | undefined;
    amount: number;
    measurement: string;
    calories: number;
    fat: number;
    carbs: number;
    protein: number;
  }>({ initialValues: measurement });
  return (
    <div className="mt-2 flex gap-2 items-center">
      <div>
        <Input
          type="text"
          placeholder="1.5"
          label="amount"
          value={formData.getValue("amount")}
          onChange={formData.getHandler("amount")}
        />
      </div>
      <div>
        <Input
          type="text"
          placeholder="cup"
          label="measurement"
          value={formData.getValue("measurement")}
          onChange={formData.getHandler("measurement")}
        />
      </div>
      <div>
        <Input
          type="text"
          placeholder=""
          label="calories"
          value={formData.getValue("calories")}
          onChange={formData.getHandler("calories")}
        />
      </div>
      <div>
        <Input
          type="text"
          placeholder=""
          label="fat"
          value={formData.getValue("fat")}
          onChange={formData.getHandler("fat")}
        />
      </div>
      <div>
        <Input
          type="text"
          placeholder=""
          label="carbs"
          value={formData.getValue("carbs")}
          onChange={formData.getHandler("carbs")}
        />
      </div>
      <div>
        <Input
          type="text"
          placeholder=""
          label="protein"
          value={formData.getValue("protein")}
          onChange={formData.getHandler("protein")}
        />
      </div>
      <div className="mb-4">
        <DeleteIconButton onClick={() => onDelete(measurement.internalId)} />
      </div>
    </div>
  );
}
