import { DatePicker } from "arms_v2.8_webui";
import { cellEditorClassname } from "../style";

export default function dateEditor({ row, column, onRowChange }) {
  const value = row[column.key] ? row[column.key] : new Date();
  return (
    <div className={cellEditorClassname}>
      <DatePicker
        value={row[column.key]}
        disabled={column.editable ? column.editable : false}
        {...column.inputProps}
        onChange={(date) => onRowChange({ ...row, [column.key]: date })}
      />
    </div>
  );
}
