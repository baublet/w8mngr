import * as React from "react";
import DeleteButton from "components/Button/DeleteButton";
import CloseIcon from "components/Icons/Close";

interface DeleteMeasurementsProps {
  id: number;
}

export default function DeleteMeasurementsButton(
  props: DeleteMeasurementsProps
): React.ReactComponentElement<any> {
  return (
    <DeleteButton>
      <CloseIcon />
      <span className="screen-reader-text">Delete measurement</span>
    </DeleteButton>
  );
}
