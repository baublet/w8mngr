import React from "react";
import { ulid } from "ulid";

import { Maybe } from "../../../api/generated";
import { FoodMeasurement, useDeleteMeasurementMutation } from "../../generated";
import { useForm } from "../../helpers";
import { DeleteIconButton } from "../Button/DeleteIconButton";
import { SystemOutlineIconButton } from "../Button/SystemOutlineIcon";
import { Input } from "../Forms";
import { Add } from "../Icons/Add";
import { FormSubHeading } from "../Type/FormSubHeading";

export type FormMeasurementInput = Partial<
  Pick<
    FoodMeasurement,
    "id" | "amount" | "calories" | "carbs" | "fat" | "measurement" | "protein"
  >
> & { internalId: string };

export function FoodMeasurementsForm({
  initialData = [],
  onChange,
}: {
  initialData?: Maybe<FormMeasurementInput[]>;
  onChange: (measurements: FormMeasurementInput[]) => void;
}) {
  const [measurements, setMeasurements] = React.useState(initialData || []);
  const [deleteMeasurementMutation] = useDeleteMeasurementMutation();

  React.useEffect(() => onChange(measurements), [measurements]);
  React.useEffect(() => setMeasurements(initialData || []), [initialData]);

  const addMeasurement = React.useCallback(() => {
    setMeasurements((measurements) => [
      ...measurements,
      {
        internalId: ulid(),
      },
    ]);
  }, []);

  const deleteMeasurement = React.useCallback(
    (internalId: string, id?: string) => {
      if (id) {
        deleteMeasurementMutation({
          variables: {
            input: {
              id,
            },
          },
        });
      }
      setMeasurements((measurements) =>
        measurements.filter(
          (measurement) => measurement.internalId !== internalId
        )
      );
    },
    []
  );

  const updateMeasurement = React.useCallback((internalId: string) => {
    return (measurementInput: FormMeasurementInput) => {
      setMeasurements((measurements) => {
        const measurementsCopy = measurements.map((measurement) => {
          if (
            measurement.id !== internalId &&
            measurement.internalId !== internalId
          ) {
            return measurement;
          }
          return measurementInput;
        });
        return measurementsCopy;
      });
    };
  }, []);

  return (
    <div>
      <FormSubHeading
        leftIcon={
          <SystemOutlineIconButton onClick={addMeasurement} type="button">
            <Add />
          </SystemOutlineIconButton>
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
            onChange={updateMeasurement(measurement.internalId)}
          />
        ))}
      </div>
    </div>
  );
}

function MeasurementForm({
  measurement,
  onDelete,
  onChange,
}: {
  measurement: FormMeasurementInput & { internalId: string };
  onDelete: (internalId: string, id?: string) => void;
  onChange: (input: FormMeasurementInput) => void;
}) {
  const formData = useForm<{
    id: string | undefined;
    internalId: string;
    amount: number;
    measurement: string;
    calories: number;
    fat: number;
    carbs: number;
    protein: number;
  }>({ initialValues: measurement, onChange });

  return (
    <div className="mt-2 flex gap-2 items-center hover:bg-slate-50 p-2 rounded border border-transparent hover:border-slate-200">
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
          placeholder="100"
          label="calories"
          value={formData.getValue("calories")}
          onChange={formData.getHandler("calories")}
        />
      </div>
      <div>
        <Input
          type="text"
          placeholder="5"
          label="fat"
          value={formData.getValue("fat")}
          onChange={formData.getHandler("fat")}
        />
      </div>
      <div>
        <Input
          type="text"
          placeholder="11.5"
          label="carbs"
          value={formData.getValue("carbs")}
          onChange={formData.getHandler("carbs")}
        />
      </div>
      <div>
        <Input
          type="text"
          placeholder="2"
          label="protein"
          value={formData.getValue("protein")}
          onChange={formData.getHandler("protein")}
        />
      </div>
      <div>
        <DeleteIconButton
          onClick={() => {
            onDelete(measurement.internalId, measurement.id);
          }}
        />
      </div>
    </div>
  );
}
