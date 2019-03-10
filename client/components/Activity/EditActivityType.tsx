import * as React from "react";
import activityTypes from "shared/data/activity/activityTypes.ts";

interface ActivityTypeEditProps {
  selectedType: number;
  onChange: (event: any) => void;
}

export default function EditActivityType(props: ActivityTypeEditProps) {
  return (
    <select
      name="activity_type"
      className="minimalSelect bg-foregroundSlight border rounded border-foregroundLighter w-full p-2"
      onChange={props.onChange}
      value={props.selectedType}
    >
      {activityTypes.map((activityType: string, index: number) => (
        <option value={index} key={index}>
          {activityType}
        </option>
      ))}
    </select>
  );
}
