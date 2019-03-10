import * as React from "react";
import muscleGroups from "shared/data/activity/muscleGroups";
import { Link } from "react-router-dom";
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
          <PillButton key={index} href={`/activities/muscle-groups/${group}`}>
            {group}
          </PillButton>
        );
      })}
    </div>
  );
}
