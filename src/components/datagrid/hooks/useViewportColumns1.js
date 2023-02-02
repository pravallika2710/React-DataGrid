import React from 'react';
import { useMemo } from "react"

import { getColSpan } from "../utils"

export function useViewportColumns1({
  columnss,dataFor,
  colSpanColumnss,
  rows,
  topSummaryRows,
  bottomSummaryRows,
  colOverscanStartIdxx,
  colOverscanEndIdxx,
  lastFrozenColumnIndex,
  rowOverscanStartIdx,
  rowOverscanEndIdx,
  columnWidths,
  isGroupRow
}) {
  // find the column that spans over a column within the visible columnss range and adjust colOverscanStartIdxx
  const startIdx = useMemo(() => {
    if (colOverscanStartIdxx === 0) return 0

    let startIdx = colOverscanStartIdxx

    const updateStartIdx = (colIdx, colSpan) => {
      if (colSpan !== undefined && colIdx + colSpan > colOverscanStartIdxx) {
        startIdx = colIdx
        return true
      }
      return false
    }

    for (const column of colSpanColumnss) {
      // check header row
      const colIdx = column.idx
      if (colIdx >= startIdx) break
      if (
        updateStartIdx(
          colIdx,
          getColSpan(column, lastFrozenColumnIndex, { type: "HEADER" })
        )
      ) {
        break
      }

      // check viewport rows
      for (
        let rowIdx = rowOverscanStartIdx;
        rowIdx <= rowOverscanEndIdx;
        rowIdx++
      ) {
        const row = rows[rowIdx]
        if (isGroupRow(row)) continue
        if (
          updateStartIdx(
            colIdx,
            getColSpan(column, lastFrozenColumnIndex, { type: "ROW", row })
          )
        ) {
          break
        }
      }

      // check summary rows
      if (topSummaryRows != null) {
        for (const row of topSummaryRows) {
          if (
            updateStartIdx(
              colIdx,
              getColSpan(column, lastFrozenColumnIndex, {
                type: "SUMMARY",
                row
              })
            )
          ) {
            break
          }
        }
      }

      if (bottomSummaryRows != null) {
        for (const row of bottomSummaryRows) {
          if (
            updateStartIdx(
              colIdx,
              getColSpan(column, lastFrozenColumnIndex, {
                type: "SUMMARY",
                row
              })
            )
          ) {
            break
          }
        }
      }
    }

    return startIdx
  }, [
    rowOverscanStartIdx,
    rowOverscanEndIdx,
    rows,
    topSummaryRows,
    bottomSummaryRows,
    colOverscanStartIdxx,
    lastFrozenColumnIndex,
    colSpanColumnss,
    isGroupRow
  ])

  const { viewportColumnss, flexWidthViewportColumnss } = useMemo(() => {
    const viewportColumnss = []
    const flexWidthViewportColumnss = []
    for (let colIdx = 0; colIdx <= colOverscanEndIdxx; colIdx++) {
      const column = columnss[colIdx]

      if (colIdx < startIdx && !column.frozen) continue
      
      viewportColumnss.push(column)
      if (typeof column.width === "string") {
        flexWidthViewportColumnss.push(column)
      }
    }

    return { viewportColumnss, flexWidthViewportColumnss }
  }, [startIdx, colOverscanEndIdxx, columnss])

  const unsizedFlexWidthViewportColumnss = useMemo(() => {
    return flexWidthViewportColumnss.filter(
      column => !columnWidths.has(column.key)
    )
  }, [flexWidthViewportColumnss, columnWidths])
  
  return {
    viewportColumnss,dataFor,
    flexWidthViewportColumnss: unsizedFlexWidthViewportColumnss
  }
}
