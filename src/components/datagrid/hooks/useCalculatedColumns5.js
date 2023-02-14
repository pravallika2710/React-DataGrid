import React from "react";
import { useMemo } from "react";

import { valueFormatter, toggleGroupFormatter } from "../formatters";
import { SELECT_COLUMN_KEY } from "../Columns";
import { clampColumnWidth, max, min } from "../utils";

const DEFAULT_COLUMN_WIDTH = "auto";
const DEFAULT_COLUMN_MIN_WIDTH = 40;

export function useCalculatedColumns5({
  columns,
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
 
  const { columns5, } =
    useMemo(() => {
      // Filter rawGroupBy and ignore keys that do not match the columns prop
      const groupBy = [];
      let lastFrozenColumnIndex = -1;

      const columns5 = columns.map((rawColumn, pos) => {
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
          width: rawColumn.width ??defaultWidth,
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
                width: "rawColumn.width",
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

        
     

        if (rowGroup) {
          column.groupFormatter ??= toggleGroupFormatter;
        }

        if (frozen) {
          lastFrozenColumnIndex++;
        }

        return column;
      });
      
      columns5.sort(
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
      columns5.forEach((column, idx) => {
        column.idx = idx;

        if (column.rowGroup) {
          groupBy.push(column.key);
        }

        if (column.colSpan != null) {
          colSpanColumns.push(column);
        }
      });

      if (lastFrozenColumnIndex !== -1) {
        columns5[lastFrozenColumnIndex].isLastFrozenColumn = true;
      }

      return {
        columns5,
        colSpanColumns,
        lastFrozenColumnIndex,
        groupBy,
      };
    }, [
      columns, //need to be changed
      defaultWidth,
      defaultMinWidth,
      defaultMaxWidth,
      defaultFormatter,
      defaultResizable,
      defaultSortable,
      rawGroupBy,
    ]);

  
 

  return {
    columns5,
  
  };
}
