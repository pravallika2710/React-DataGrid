import React from 'react';
import { css } from "@linaria/core"

const cellDragHandle = css`
  @layer rdg.DragHandle {
    cursor: move;
    position: absolute;
    inset-inline-end: 0;
    inset-block-end: 0;
    inline-size: 8px;
    block-size: 8px;
    background-color: var(--rdg-selection-color);

    &:hover {
      inline-size: 16px;
      block-size: 16px;
      border: 2px solid var(--rdg-selection-color);
      background-color: var(--rdg-background-color);
    }
  }
`

const cellDragHandleClassname = `rdg-cell-drag-handle ${cellDragHandle}`

export default function DragHandle({
  rows,
  columns,
  selectedPosition,
  latestDraggedOverRowIdx,
  isCellEditable,
  onRowsChange,
  onFill,
  setDragging,
  setDraggedOverRowIdx
}) {
  function handleMouseDown(event) {
    if (event.buttons !== 1) return
    setDragging(true)
    window.addEventListener("mouseover", onMouseOver)
    window.addEventListener("mouseup", onMouseUp)

    function onMouseOver(event) {
      // Trigger onMouseup in edge cases where we release the mouse button but `mouseup` isn't triggered,
      // for example when releasing the mouse button outside the iframe the grid is rendered in.
      // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons
      if (event.buttons !== 1) onMouseUp()
    }

    function onMouseUp() {
      window.removeEventListener("mouseover", onMouseOver)
      window.removeEventListener("mouseup", onMouseUp)
      setDragging(false)
      handleDragEnd()
    }
  }

  function handleDragEnd() {
    const overRowIdx = latestDraggedOverRowIdx.current
    if (overRowIdx === undefined) return

    const { rowIdx } = selectedPosition
    const startRowIndex = rowIdx < overRowIdx ? rowIdx + 1 : overRowIdx
    const endRowIndex = rowIdx < overRowIdx ? overRowIdx + 1 : rowIdx
    updateRows(startRowIndex, endRowIndex)
    setDraggedOverRowIdx(undefined)
  }

  function handleDoubleClick(event) {
    event.stopPropagation()
    updateRows(selectedPosition.rowIdx + 1, rows.length)
  }

  function updateRows(startRowIdx, endRowIdx) {
    const { idx, rowIdx } = selectedPosition
    const column = columns[idx]
    const sourceRow = rows[rowIdx]
    const updatedRows = [...rows]
    const indexes = []
    for (let i = startRowIdx; i < endRowIdx; i++) {
      if (isCellEditable({ rowIdx: i, idx })) {
        const updatedRow = onFill({
          columnKey: column.key,
          sourceRow,
          targetRow: rows[i]
        })
        if (updatedRow !== rows[i]) {
          updatedRows[i] = updatedRow
          indexes.push(i)
        }
      }
    }

    if (indexes.length > 0) {
      onRowsChange?.(updatedRows, { indexes, column })
    }
  }

  return (
    <div
      className={cellDragHandleClassname}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
    />
  )
}
