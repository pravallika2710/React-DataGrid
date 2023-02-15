export function getColSpan(column, lastFrozenColumnIndex, args) {
  const colSpan =
    typeof column.colSpan === "function" ? column.colSpan(args) : 1
  if (
    Number.isInteger(colSpan) &&
    colSpan > 1 &&
    // ignore colSpan if it spans over both frozen and regular columns
    (!column.frozen || column.idx + colSpan - 1 <= lastFrozenColumnIndex)
  ) {
    return colSpan
  }
  return undefined
}
