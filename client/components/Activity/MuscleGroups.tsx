import * as React from "react";
import muscleGroups from "shared/data/activity/muscleGroups";
import PillButton from "../Button/PillButton";

interface MuscleGroupsProps {
  selectedGroups: string;
}

export default function MuscleGroups(props: MuscleGroupsProps) {
  return (
    <div className="mt-2">
      {muscleGroups.map((group: string, index: number) => {
        if (props.selectedGroups[index] == "0") return false;
        return (
          <PillButton
            key={index}
            to={`/activities/search?muscle_groups=${group}`}
          >
            {group}
          </PillButton>
        );
      })}
    </div>
  );
}
