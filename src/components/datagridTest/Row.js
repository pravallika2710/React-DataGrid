import React, { memo, forwardRef } from "react";
import clsx from "clsx";

import Cell from "./Cell";
import { RowSelectionProvider, useLatestFunc } from "./hooks";
import { getColSpan, getRowStyle } from "./utils";
import { rowClassname, rowSelectedClassname ,wholeRowFridge} from "./style";

function Row(
  {
    className,headerHeight,singleRowFridgeIndex,summaryRowHeight,rows,rowFridgeIndexEnd,      //need to be changed
    rowIdx,
    gridRowStart,
    height,
    selectedCellIdx,
    isRowSelected,
    copiedCellIdx,
    draggedOverCellIdx,
    lastFrozenColumnIndex,
    row,
    viewportColumns,
    selectedCellEditor,
    selectedCellDragHandle,
    onRowClick,
    onRowDoubleClick,
    rowClass,
    setDraggedOverRowIdx,
    onMouseEnter,
    onRowChange,
    selectCell,
    ...props
  },
  ref
) {
  const handleRowChange = useLatestFunc((column, newRow) => {
    onRowChange(column, rowIdx, newRow);
  });

  function handleDragEnter(event) {
    setDraggedOverRowIdx?.(rowIdx);
    onMouseEnter?.(event);
  }

  className = clsx(
    rowClassname,
    `rdg-row-${rowIdx % 2 === 0 ? "even" : "odd"}`,
    {
      [rowSelectedClassname]: selectedCellIdx === -1,
    },
   
    rowClass?.(row),
    className
  );

  const cells = [];

  for (let index = 0; index < viewportColumns.length; index++) {
    const column = viewportColumns[index];
    // const column = viewportColumns[3].children[0]
    // const column = viewportColumns.haveChildren===true?viewportColumns.children[index]:viewportColumns[index]
  
    const { idx } = column;
    const colSpan = getColSpan(column, lastFrozenColumnIndex, {
      type: "ROW",
      row,
    });
    if (colSpan !== undefined) {
      index += colSpan - 1;
    }

    const isCellSelected = selectedCellIdx === idx;

    if (isCellSelected && selectedCellEditor) {
      cells.push(selectedCellEditor);
    } else {
      console.log("row1",rowIdx)
      cells.push(
        <Cell
          key={column.field}
          column={column}
          colSpan={colSpan}
          row={row}
          rowFridgeIndexEnd={rowFridgeIndexEnd}                    //need to be changed
          singleRowFridgeIndex={singleRowFridgeIndex}              //need to be changed
          summaryRowHeight={summaryRowHeight}                     //need to be changed
          headerHeight={headerHeight}                             //need to be changed
          allrow={rows}                                          //need to be changed
          rowIndex={rowIdx}                                        //need to be changed
          isCopied={copiedCellIdx === idx}
          isDraggedOver={draggedOverCellIdx === idx}
          isCellSelected={isCellSelected}
          dragHandle={isCellSelected ? selectedCellDragHandle : undefined}
          onRowClick={onRowClick}
          onRowDoubleClick={onRowDoubleClick}
          onRowChange={handleRowChange}
          selectCell={selectCell}
        />
      );
    }
  }
console.log("summery",summaryRowHeight)

  return (
    <RowSelectionProvider value={isRowSelected}>
      <div
        role="row"
        ref={ref}
        className={className}
        onMouseEnter={handleDragEnter}
        style={{...getRowStyle(gridRowStart, height)}}
        {...props}
      >
        {cells}
      </div>
    </RowSelectionProvider>
  );
}

const RowComponent = memo(forwardRef(Row));

export default RowComponent;

export function defaultRowRenderer(key, props) {
  return <RowComponent key={key} {...props} />;
}
