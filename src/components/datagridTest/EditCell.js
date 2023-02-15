import React from 'react';
import { useEffect, useRef } from "react"
import { css } from "@linaria/core"

import { useLatestFunc } from "./hooks"
import { getCellStyle, getCellClassname, onEditorNavigation } from "./utils"

/*
 * To check for outside `mousedown` events, we listen to all `mousedown` events at their birth,
 * i.e. on the window during the capture phase, and at their death, i.e. on the window during the bubble phase.
 *
 * We schedule a check at the birth of the event, cancel the check when the event reaches the "inside" container,
 * and trigger the "outside" callback when the event bubbles back up to the window.
 *
 * The event can be `stopPropagation()`ed halfway through, so they may not always bubble back up to the window,
 * so an alternative check must be used. The check must happen after the event can reach the "inside" container,
 * and not before it run to completion. `requestAnimationFrame` is the best way we know how to achieve this.
 * Usually we want click event handlers from parent components to access the latest commited values,
 * so `mousedown` is used instead of `click`.
 *
 * We must also rely on React's event capturing/bubbling to handle elements rendered in a portal.
 */

const cellEditing = css`
  @layer rdg.EditCell {
    padding: 0;
  }
`

export default function EditCell({
  column,
  colSpan,
  row,
  onRowChange,
  closeEditor
}) {
  const frameRequestRef = useRef()
  const commitOnOutsideClick =
    column.editorOptions?.commitOnOutsideClick !== false

  // We need to prevent the `useEffect` from cleaning up between re-renders,
  // as `onWindowCaptureMouseDown` might otherwise miss valid mousedown events.
  // To that end we instead access the latest props via useLatestFunc.
  const commitOnOutsideMouseDown = useLatestFunc(() => {
    onClose(true)
  })

  useEffect(() => {
    if (!commitOnOutsideClick) return

    function onWindowCaptureMouseDown() {
      frameRequestRef.current = requestAnimationFrame(commitOnOutsideMouseDown)
    }

    // eslint-disable-next-line no-restricted-globals
    addEventListener("mousedown", onWindowCaptureMouseDown, { capture: true })

    return () => {
      // eslint-disable-next-line no-restricted-globals
      removeEventListener("mousedown", onWindowCaptureMouseDown, {
        capture: true
      })
      cancelFrameRequest()
    }
  }, [commitOnOutsideClick, commitOnOutsideMouseDown])

  function cancelFrameRequest() {
    cancelAnimationFrame(frameRequestRef.current)
  }

  function onKeyDown(event) {
    if (event.key === "Escape") {
      event.stopPropagation()
      // Discard changes
      onClose()
    } else if (event.key === "Enter") {
      event.stopPropagation()
      onClose(true)
    } else {
      const onNavigation =
        column.editorOptions?.onNavigation ?? onEditorNavigation
      if (!onNavigation(event)) {
        event.stopPropagation()
      }
    }
  }

  function onClose(commitChanges) {
    if (commitChanges) {
      onRowChange(row, true)
    } else {
      closeEditor()
    }
  }

  const { cellClass } = column
  const className = getCellClassname(
    column,
    "rdg-editor-container",
    !column.editorOptions?.renderFormatter && cellEditing,
    typeof cellClass === "function" ? cellClass(row) : cellClass
  )

  return (
    <div
      role="gridcell"
      // aria-colindex is 1-based
      aria-colindex={column.idx + 1}
      aria-colspan={colSpan}
      aria-selected
      className={className}
      style={getCellStyle(column, colSpan)}
      onKeyDown={onKeyDown}
      onMouseDownCapture={commitOnOutsideClick ? cancelFrameRequest : undefined}
    >
      {column.editor != null && (
        <>
          {column.editor({
            column,
            row,
            onRowChange,
            onClose
          })}
          {column.editorOptions?.renderFormatter &&
            column.formatter({
              column,
              row,
              isCellSelected: true,
              onRowChange
            })}
        </>
      )}
    </div>
  )
}
