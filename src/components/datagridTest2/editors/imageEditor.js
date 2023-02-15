import { ImageViewer } from "arms_v2.8_webui";
import { cellEditorClassname } from "../style";
export default function imageEditor({ row, column }) {
  const style = column.inputProps?.style
    ? column.inputProps?.style
    : { height: "100%", width: "100%" };
  return (
    <div className={cellEditorClassname}>
      <ImageViewer src={row[column.key]} style={style} {...column.inputProps} />
    </div>
  );
}
