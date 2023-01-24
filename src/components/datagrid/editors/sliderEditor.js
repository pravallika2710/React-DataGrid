import { Slider } from "arms_v2.8_webui";
import React from "react";
import { cellEditorClassname } from "../style";

export default function sliderEditor({ column, row, onRowChange }) {
  const min = column.inputProps?.minValue ? column.inputProps?.minValue : 0;
  const max = column.inputProps?.maxValue ? column.inputProps?.maxValue : 100;
  const step = column.inputProps?.step ? column.inputProps?.step : 0.1;
  const value = row[column.key];
  return (
    <div className={cellEditorClassname}>
      <Slider
        disabled={column.editable ? column.editable : false}
        value={value}
        handleChange={(event) =>
          onRowChange({ ...row, [column.key]: event.target.value })
        }
        minValue={min}
        maxValue={max}
        step={step}
        {...column.inputProps}
      />
      <span style={{ marginLeft: 10 }}> {Math.round(value)}</span>
    </div>
  );
}
