export function valueFormatter(props) {
  try {
    return <>{props.row[props.column.field]}</>
  } catch {
    return null
  }
}