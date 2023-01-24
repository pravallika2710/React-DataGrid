import { Button } from "arms_v2.8_webui";

export default function buttonEditor({ row, column }) {
  var text;
  if (column.inputProps?.text !== undefined || column.inputProps?.text !== "") {
    text = column.inputProps.text;
  } else if (row[column.key] !== undefined || row[column.key] !== "") {
    row[column.key];
  } else {
    text = column.headerName;
  }
  return (
    <>
      <Button
        text={text}
        disabled={column.editable ? column.editable : false}
        onClick={column.onClick}
        {...column.inputProps}
      />
    </>
  );
}
