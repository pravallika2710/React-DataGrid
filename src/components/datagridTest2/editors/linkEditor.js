import { Link } from "arms_v2.8_webui";

export default function linkEditor({ row, column }) {
  return (
    <>
      <Link linkname={row[column.key]} {...column.inputProps} />
    </>
  );
}
