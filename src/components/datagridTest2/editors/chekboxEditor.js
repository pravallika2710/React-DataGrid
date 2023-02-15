import { CheckBox } from "arms_v2.8_webui";
import { cellEditorClassname } from "../style";
export default function checkboxEditor({ row, column, onRowChange }) {
  return (
    <div className={cellEditorClassname}>
      <CheckBox
        checked={row[column.key]}
        disabled={column.editable ? column.editable : false}
        {...column.inputProps}
        onClick={(event) =>
          onRowChange({ ...row, [column.key]: event.target.checked })
        }
      />
    </div>
  );
}
