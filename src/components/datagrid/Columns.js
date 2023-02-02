import React from 'react';
import { SelectCellFormatter } from "./formatters"
import { useRowSelection } from "./hooks/useRowSelection"

export const SELECT_COLUMN_KEY = "select-row"

function SelectFormatter(props) {
  const [isRowSelected, onRowSelectionChange] = useRowSelection()

  return (
    <SelectCellFormatter
      aria-label="Select"
      isCellSelected={props.isCellSelected}
      value={isRowSelected}
      onChange={(checked, isShiftClick) => {
        onRowSelectionChange({ row: props.row, checked, isShiftClick })
      }}
    />
  )
}

function SelectGroupFormatter(props) {
  const [isRowSelected, onRowSelectionChange] = useRowSelection()

  return (
    <SelectCellFormatter
      aria-label="Select Group"
      isCellSelected={props.isCellSelected}
      value={isRowSelected}
      onChange={checked => {
        onRowSelectionChange({ row: props.row, checked, isShiftClick: false })
      }}
    />
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SelectColumn = {
  key: SELECT_COLUMN_KEY,
  name: "",cellWidth:34,topHeader:"checkbox",   //need to be changed
  width: 35,
  minWidth: 35,
  maxWidth: 35,
  resizable: false,
  sortable: false,
  frozen: true,
  filter: false,
  headerRenderer(props) {
    return (
      <SelectCellFormatter
        aria-label="Select All"
        isCellSelected={props.isCellSelected}
        value={props.allRowsSelected}
        onChange={props.onAllRowsSelectionChange}
      />
    )
  },
  cellRenderer(props) {
    return <SelectFormatter {...props} />;
  },
  groupFormatter(props) {
    return <SelectGroupFormatter {...props} />
  },
  
}
