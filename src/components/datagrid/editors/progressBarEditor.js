import React from "react";
import { ProgressBar } from "arms_v2.8_webui";
import { cellEditorClassname } from "../style";
export default function progressBarEditor({ row, column }) {
  const value = row[column.key];
  return (
    <div className={cellEditorClassname}>
      <ProgressBar
        value={value}
        {...column.inputProps}
      />
      {Math.round(value)}%
    </div>
  );
}
