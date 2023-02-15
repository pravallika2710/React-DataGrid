import React from 'react';
import clsx from "clsx"

import {
  cellClassname,
  cellFrozenClassname,
  cellFrozenLastClassname,
  row
} from "../style"

export function getRowStyle(rowIdx, height) {
  if (height !== undefined) {
    return {
      "--rdg-grid-row-start": rowIdx,
      "--rdg-row-height": `${height}px`
    }
  }
  return {
    "--rdg-grid-row-start": rowIdx
  }
}

export function getCellStyle(column, colSpan) {

  return {
    // zIndex:2,
    gridColumnStart: column.index + 1,
    gridColumnEnd: colSpan !== undefined ? `span ${colSpan}` : undefined,
    insetInlineStart: column.frozen
      ? `var(--rdg-frozen-left-${column.index})`
      : undefined
  }
}

export function getCellClassname(column, ...extraClasses) {
  return clsx(
    cellClassname,
    {
      [cellFrozenClassname]: column.frozen,
      [cellFrozenLastClassname]: column.isLastFrozenColumn
    },
    ...extraClasses
  )
}
