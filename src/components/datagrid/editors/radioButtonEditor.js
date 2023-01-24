import { RadioButton } from "arms_v2.8_webui";

export default function radioButtonEditor({ row, column, onRowChange }) {
  const options = column.options ? column.options : column.buttons;
  const label = column.inputProps?.label ? column.inputProps.label : "";
  const orientation = column.inputProps?.orientation
    ? column.inputProps.orientation
    : "row";
  const radiotheme = column.inputProps?.radiotheme
    ? column.inputProps.radiotheme
    : "Midblue";
  const selection = column.inputProps?.selection
    ? column.inputProps.selection
    : "active";

  return (
    <>
      <RadioButton
        label={label}
        {...column.inputProps}
        orientation={orientation}
        disabled={column.editable ? column.editable : false}
        radiotheme={radiotheme}
        selection={selection}
        onChange={(event) => {
          onRowChange({ ...row, [column.key]: event.target.value }, true);
        }}
        options={options}
        defaultValue={row[column.key] ? row[column.key] : null}
      />
    </>
  );
}
