export function valueFormatter(props) {
  try {
    return <>{props.row[props.column.key]}</>
  } catch {
    return null
  }
}