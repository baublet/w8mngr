import * as React from "react";
import { FoodType } from "api/foods/types";
import Panel from "client/components/Containers/Panel";
import ItemHeading from "client/components/Type/ItemHeading";
import EditIcon from "client/components/Icons/Edit";
import TransparentIconButton from "client/components/Button/TransparentIcon";
import Markdown from "client/components/Markdown";
import MeasurementComponent from "client/components/Measurement/Measurement";

interface FoodDisplayType extends FoodType {
  index: number;
}

export default function Food(
  props: FoodDisplayType
): React.ReactComponentElement<any> {
  return (
    <Panel className={props.index == 0 ? "" : "mt-3"}>
      <TransparentIconButton
        className="absolute pin-r pin-t"
        to={`/food/${props.id}/edit`}
      >
        <EditIcon />
        <span className="screen-reader-text">Edit Food</span>
      </TransparentIconButton>
      <ItemHeading>{props.name}</ItemHeading>
      {!props.description ? (
        false
      ) : (
        <Markdown content={props.description} className="mt-3" />
      )}
      {!props.measurements.length ? (
        false
      ) : (
        <div className="mt-5">
          {props.measurements.map(measurement => (
            <MeasurementComponent {...measurement} key={measurement.id} />
          ))}
        </div>
      )}
    </Panel>
  );
}
