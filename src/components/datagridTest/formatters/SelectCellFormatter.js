import React from 'react';
import { useFocusRef } from "../hooks/useFocusRef"
import { useDefaultComponents } from "../DataGridDefaultComponentsProvider"

export function SelectCellFormatter({
  value,
  isCellSelected,
  disabled,
  onChange,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy
}) {
  const { ref, tabIndex } = useFocusRef(isCellSelected)
  const checkboxFormatter = useDefaultComponents().checkboxFormatter

  return (
    <div>
      {checkboxFormatter(
        {
          "aria-label": ariaLabel,
          "aria-labelledby": ariaLabelledBy,
          tabIndex,
          disabled,
          checked: value,
          onChange
        },
        ref
      )}
    </div>
  )
}
