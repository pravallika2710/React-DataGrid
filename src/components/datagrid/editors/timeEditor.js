import { TimePicker } from "arms_v2.8_webui";
import { cellEditorClassname } from "../style";
export default function timeEditor({ row, column, onRowChange }) {
  const value = row[column.key] ? row[column.key] : new Date();
  return (
    <div className={cellEditorClassname}>
      <TimePicker
        value={value}
        disabled={column.editable ? column.editable : false}
        {...column.inputProps}
        onChange={(date) => onRowChange({ ...row, [column.key]: date })}
      />
    </div>
  );
}
