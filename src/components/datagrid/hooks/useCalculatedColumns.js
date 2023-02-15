import React from "react";
import { useMemo } from "react";

import { valueFormatter, toggleGroupFormatter } from "../formatters";
import { SELECT_COLUMN_KEY } from "../Columns";
import { clampColumnWidth, max, min } from "../utils";

const DEFAULT_COLUMN_WIDTH = "auto";
const DEFAULT_COLUMN_MIN_WIDTH = 40;

export function useCalculatedColumns({
  rawColumns,
  arr5, //need to be changed
  columnWidths,
  viewportWidth,
  scrollLeft,
  defaultColumnOptions,
  rawGroupBy,
  enableVirtualization,
}) {
  const defaultWidth = defaultColumnOptions?.width ?? DEFAULT_COLUMN_WIDTH;
  const defaultMinWidth =
    defaultColumnOptions?.minWidth ?? DEFAULT_COLUMN_MIN_WIDTH;
  const defaultMaxWidth = defaultColumnOptions?.maxWidth ?? undefined;
  const defaultFormatter = defaultColumnOptions?.formatter ?? valueFormatter;
  const defaultSortable = defaultColumnOptions?.sortable ?? false;
  const defaultResizable = defaultColumnOptions?.resizable ?? false;
  const defaultFilter = defaultColumnOptions?.dilter ?? false;
 
  const { columns, colSpanColumns, lastFrozenColumnIndex, groupBy } =
    useMemo(() => {
      // Filter rawGroupBy and ignore keys that do not match the columns prop
      const groupBy = [];
      let lastFrozenColumnIndex = -1;

      const columns = rawColumns?.map((rawColumn, pos) => {
        //need to be changed
        const rowGroup = rawGroupBy?.includes(rawColumn.field) ?? false;
        const frozen = rowGroup || rawColumn.frozen;

        var recursiveChild = (subChild, rawColumn) => {
          return (
            subChild.haveChildren === true &&
            subChild?.children.map((subChild2, index1) => {
              const rawChild2 = {
                ...subChild2,
                parent: subChild.field,
                topHeader: rawColumn.field,
                children: recursiveChild(subChild2, rawColumn),
                idx: index1,
                 key: subChild2.field
              };
              return rawChild2;
            })
          );
        };

 

        const column = {
          ...rawColumn,
          idx: 0,
          parent:null,
          index: pos,
          key: rawColumn.field,
          frozen,
          isLastFrozenColumn: false,
          rowGroup,
          width: rawColumn.width ?  Number(arr5.filter((arr, index) => index === rawColumn.index)):defaultWidth,
          minWidth: rawColumn.minWidth ?? defaultMinWidth,
          // minWidth:one(),
          maxWidth: rawColumn.maxWidth ?? defaultMaxWidth,
          sortable: rawColumn.sortable ?? defaultSortable,
          resizable: rawColumn.resizable ?? defaultResizable,
          formatter: rawColumn.cellRenderer
            ? rawColumn.cellRenderer
            : rawColumn.valueFormatter ?? defaultFormatter,
          filter: rawColumn.filter ?? defaultFilter,
          topHeader: rawColumn.field,
          children:
            rawColumn.haveChildren === true &&
            rawColumn?.children.map((child, index1) => {

              const rawChild = {
                ...child,
                parent: rawColumn.field,
                topHeader: rawColumn.field,
                children:
                  child.haveChildren === true &&
                  child?.children.map((subChild, index2) => {
                    const rawChild1 = {
                      ...subChild,
                      topHeader: rawColumn.field,
                      parent: child.field,
                      children: recursiveChild(subChild, rawColumn),
                      idx: index2,
                      key: subChild.field,
                    };
                    return rawChild1;
                  }),
                idx: index1,
              };
              return rawChild;
            }),
        };

        
        column.width =   Number(arr5.filter((arr, index) => index === pos)) - 1;

        if (rowGroup) {
          column.groupFormatter ??= toggleGroupFormatter;
        }

        if (frozen) {
          lastFrozenColumnIndex++;
        }

        return column;
      });
      
      columns?.sort(
        ({ key: aKey, frozen: frozenA }, { key: bKey, frozen: frozenB }) => {
          // Sort select column first:
          if (aKey === SELECT_COLUMN_KEY) return -1;
          if (bKey === SELECT_COLUMN_KEY) return 1;

          // Sort grouped columns second, following the groupBy order:
          if (rawGroupBy?.includes(aKey)) {
            if (rawGroupBy.includes(bKey)) {
              return rawGroupBy.indexOf(aKey) - rawGroupBy.indexOf(bKey);
            }
            return -1;
          }
          if (rawGroupBy?.includes(bKey)) return 1;

          // Sort frozen columns third:
          if (frozenA) {
            if (frozenB) return 0;
            return -1;
          }
          if (frozenB) return 1;

          // Sort other columns last:
          return 0;
        }
      );

      const colSpanColumns = [];
      columns.forEach((column, idx) => {
        column.idx = idx;

        if (column.rowGroup) {
          groupBy.push(column.key);
        }

        if (column.colSpan != null) {
          colSpanColumns.push(column);
        }
      });

      if (lastFrozenColumnIndex !== -1) {
        columns[lastFrozenColumnIndex].isLastFrozenColumn = true;
      }

      return {
        columns,
        colSpanColumns,
        lastFrozenColumnIndex,
        groupBy,
      };
    }, [
      rawColumns, //need to be changed
      defaultWidth,
      defaultMinWidth,
      defaultMaxWidth,
      defaultFormatter,
      defaultResizable,
      defaultSortable,
      rawGroupBy,
    ]);

  const {
    templateColumns,
    layoutCssVars,
    totalFrozenColumnWidth,
    columnMetrics,
  } = useMemo(() => {
    const columnMetrics = new Map();
    let left = 0;
    let totalFrozenColumnWidth = 0;
    const templateColumns = [];
  
    for (const column of columns) {
      let width = columnWidths.get(column.key) ?? column.width; //need to be changed
     
      if (typeof width === "number") {
        width = clampColumnWidth(width, column);
     
      } else {
        // This is a placeholder width so we can continue to use virtualization.
        // The actual value is set after the column is rendered
        width = column.minWidth;
      }
      templateColumns.push(`${width}px`);
      columnMetrics.set(column, { width, left });
      left += width;
    }

    if (lastFrozenColumnIndex !== -1) {
      const columnMetric = columnMetrics.get(columns[lastFrozenColumnIndex]);

      totalFrozenColumnWidth = columnMetric.left + columnMetric.width;
    }

    const layoutCssVars = {};

    // const children=rowArray.filter(columns[i].topHeader===)

    for (let i = 0; i <= lastFrozenColumnIndex; i++) {
      const column = columns[i];
      // columns[i].cellWidth=rowArray.cellWidth
   
      layoutCssVars[`--rdg-frozen-left-${column.idx}`] = `${
        columnMetrics.get(column).left
      }px`;
    }
    
    return {
      templateColumns,
      layoutCssVars,
      totalFrozenColumnWidth,
      columnMetrics,
    };
  }, [columnWidths, columns, lastFrozenColumnIndex]);

  const [colOverscanStartIdx, colOverscanEndIdx] = useMemo(() => {
    if (!enableVirtualization) {
      return [0, columns.length - 1];
    }
    // get the viewport's left side and right side positions for non-frozen columns
    const viewportLeft = scrollLeft + totalFrozenColumnWidth;
    const viewportRight = scrollLeft + viewportWidth;
    // get first and last non-frozen column indexes
    const lastColIdx = columns.length - 1;
    const firstUnfrozenColumnIdx = min(lastFrozenColumnIndex + 1, lastColIdx);

    // skip rendering non-frozen columns if the frozen columns cover the entire viewport
    if (viewportLeft >= viewportRight) {
      return [firstUnfrozenColumnIdx, firstUnfrozenColumnIdx];
    }

    // get the first visible non-frozen column index
    let colVisibleStartIdx = firstUnfrozenColumnIdx;
    while (colVisibleStartIdx < lastColIdx) {
      const { left, width } = columnMetrics.get(columns[colVisibleStartIdx]);
      // if the right side of the columnn is beyond the left side of the available viewport,
      // then it is the first column that's at least partially visible
      if (left + width > viewportLeft) {
        break;
      }
      colVisibleStartIdx++;
    }

    // get the last visible non-frozen column index
    let colVisibleEndIdx = colVisibleStartIdx;
    while (colVisibleEndIdx < lastColIdx) {
      const { left, width } = columnMetrics.get(columns[colVisibleEndIdx]);
      // if the right side of the column is beyond or equal to the right side of the available viewport,
      // then it the last column that's at least partially visible, as the previous column's right side is not beyond the viewport.
      if (left + width >= viewportRight) {
        break;
      }
      colVisibleEndIdx++;
    }

    const colOverscanStartIdx = max(
      firstUnfrozenColumnIdx,
      colVisibleStartIdx - 1
    );
    const colOverscanEndIdx = min(lastColIdx, colVisibleEndIdx + 1);

    return [colOverscanStartIdx, colOverscanEndIdx];
  }, [
    columnMetrics,
    columns,
    lastFrozenColumnIndex,
    scrollLeft,
    totalFrozenColumnWidth,
    viewportWidth,
    enableVirtualization,
  ]);
 

  return {
    columns,
    colSpanColumns,
    colOverscanStartIdx,
    colOverscanEndIdx,
    templateColumns,
    layoutCssVars,
    columnMetrics,
    lastFrozenColumnIndex,
    totalFrozenColumnWidth,
    groupBy,
  };
}
