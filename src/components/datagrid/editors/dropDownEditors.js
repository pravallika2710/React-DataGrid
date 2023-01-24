import React from "react";
import { ComboBox } from "arms_v2.8_webui";

export default function dropDownEditor({ row, onRowChange, column }) {
  const option = column.option;

  return (
    <ComboBox
      options={option}
      {...column.inputProps}
      disabled={column.editable ? column.editable : false}
      onChange={(event) =>
        onRowChange({ ...row, [column.key]: event.target.value }, true)
      }
      value={row[column.key]}
    />
  );
}
