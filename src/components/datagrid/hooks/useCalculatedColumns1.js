import React from "react";
import { useMemo } from "react";

import { valueFormatter, toggleGroupFormatter } from "../formatters";
import { SELECT_COLUMN_KEY } from "../Columns";
import { clampColumnWidth, max, min } from "../utils";

const DEFAULT_COLUMN_WIDTH = "auto"
const DEFAULT_COLUMN_MIN_WIDTH = 80

export function useCalculatedColumns1({
  rowCol,
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
  const { columnss, colSpanColumnss, lastFrozenColumnIndexx, groupBy } =
    useMemo(() => {
      // Filter rawGroupBy and ignore keys that do not match the columnss prop
      const groupBy = [];
      let lastFrozenColumnIndexx = -1;
      const columnss = rowCol.map((rawColumn,pos) => {
        const rowGroup = rawGroupBy?.includes(rawColumn.field) ?? false;
        const frozen = rowGroup || rawColumn.frozen;

        const column = {
          ...rawColumn,
          idx: 0, 
          frozen,
          index:pos,
          key: rawColumn.field,
          isLastFrozenColumn: false,
          rowGroup,
          width: rawColumn.width ?? defaultWidth,
          minWidth: rawColumn.minWidth ?? defaultMinWidth,
          maxWidth: rawColumn.maxWidth ?? defaultMaxWidth,
          sortable: rawColumn.sortable ?? defaultSortable,
          resizable: rawColumn.resizable ?? defaultResizable,
          formatter: rawColumn.cellRenderer
          ? rawColumn.cellRenderer
          : rawColumn.valueFormatter ?? defaultFormatter,
        filter: rawColumn.filter ?? defaultFilter,
        };

        

        if (rowGroup) {
          column.groupFormatter ??= toggleGroupFormatter;
        }

        if (frozen) {
          lastFrozenColumnIndexx++;
        }

        return column;
      });

      columnss.sort(
        ({ key: aKey, frozen: frozenA }, { key: bKey, frozen: frozenB }) => {
          // Sort select column first:
          if (aKey === SELECT_COLUMN_KEY) return -1;
          if (bKey === SELECT_COLUMN_KEY) return 1;

          // Sort grouped columnss second, following the groupBy order:
          if (rawGroupBy?.includes(aKey)) {
            if (rawGroupBy.includes(bKey)) {
              return rawGroupBy.indexOf(aKey) - rawGroupBy.indexOf(bKey);
            }
            return -1;
          }
          if (rawGroupBy?.includes(bKey)) return 1;

          // Sort frozen columnss third:
          if (frozenA) {
            if (frozenB) return 0;
            return -1;
          }
          if (frozenB) return 1;

          // Sort other columnss last:
          return 0;
        }
      );

      const colSpanColumnss = [];
      columnss.forEach((column, idx) => {
        column.idx = idx;

        if (column.rowGroup) {
          groupBy.push(column.key);
        }

        if (column.colSpan != null) {
          colSpanColumnss.push(column);
        }
      });

      if (lastFrozenColumnIndexx !== -1) {
        columnss[lastFrozenColumnIndexx].isLastFrozenColumn = true;
      }

      return {
        columnss,
        colSpanColumnss,
        lastFrozenColumnIndexx,
        groupBy,
      };
    }, [
      rowCol,
      defaultWidth,
      defaultMinWidth,
      defaultMaxWidth,
      defaultFormatter,
      defaultResizable,
      defaultSortable,
      rawGroupBy,
    ]);

  const {
    templateColumnss,
    layoutCssVarss,
    totalFrozenColumnWidthh,
    columnMetricss,
  } = useMemo(() => {
    const columnMetricss = new Map();
    let left = 0;
    let totalFrozenColumnWidthh = 0;
    const templateColumnss = [];

    for (const column of columnss) {
      let width = columnWidths.get(column.key) ?? column.width;
      if (typeof width === "number") {
        width = clampColumnWidth(width, column);
      } else {
        // This is a placeholder width so we can continue to use virtualization.
        // The actual value is set after the column is rendered
        width = column.minWidth;
      }
      templateColumnss.push(`${width}px`);
      columnMetricss.set(column, { width, left });
      left += width;
    }

    if (lastFrozenColumnIndexx !== -1) {
      const columnMetric = columnMetricss.get(columnss[lastFrozenColumnIndexx]);
      totalFrozenColumnWidthh = columnMetric.left + columnMetric.width;
    }

    const layoutCssVarss = {
      gridTemplateColumnss: templateColumnss.join(" "),
    };

    for (let i = 0; i <= lastFrozenColumnIndexx; i++) {
      const column = columnss[i];
     
      layoutCssVarss[`--rdg-frozen-left-${column.idx}`] = `${
        columnMetricss.get(column).left
      }px`;
    }
   
    return {
      templateColumnss,
      layoutCssVarss,
      totalFrozenColumnWidthh,
      columnMetricss,
    };
  }, [columnWidths, columnss, lastFrozenColumnIndexx]);

  const [colOverscanStartIdxx, colOverscanEndIdxx] = useMemo(() => {
    if (!enableVirtualization) {
      return [0, columnss.length - 1];
    }
    // get the viewport's left side and right side positions for non-frozen columnss
    const viewportLeft = scrollLeft + totalFrozenColumnWidthh;
    const viewportRight = scrollLeft + viewportWidth;
    
    // get first and last non-frozen column indexes
    const lastColIdx = columnss.length - 1;
    const firstUnfrozenColumnIdx = min(lastFrozenColumnIndexx + 1, lastColIdx);

    // skip rendering non-frozen columnss if the frozen columnss cover the entire viewport
    if (viewportLeft >= viewportRight) {
      return [firstUnfrozenColumnIdx, firstUnfrozenColumnIdx];
    }

    // get the first visible non-frozen column index
    let colVisibleStartIdx = firstUnfrozenColumnIdx;
    while (colVisibleStartIdx < lastColIdx) {
      const { left, width } = columnMetricss.get(columnss[colVisibleStartIdx]);
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
      const { left, width } = columnMetricss.get(columnss[colVisibleEndIdx]);
      // if the right side of the column is beyond or equal to the right side of the available viewport,
      // then it the last column that's at least partially visible, as the previous column's right side is not beyond the viewport.
      if (left + width >= viewportRight) {
        break;
      }
      colVisibleEndIdx++;
    }

    const colOverscanStartIdxx = max(
      firstUnfrozenColumnIdx,
      colVisibleStartIdx - 1
    );
    const colOverscanEndIdxx = min(lastColIdx, colVisibleEndIdx + 1);

    return [colOverscanStartIdxx, colOverscanEndIdxx];
  }, [
    columnMetricss,
    columnss,
    lastFrozenColumnIndexx,
    scrollLeft,
    totalFrozenColumnWidthh,
    viewportWidth,
    enableVirtualization,
  ]);
  
  return {
    columnss,
    colSpanColumnss,
    colOverscanStartIdxx,
    colOverscanEndIdxx,
    templateColumnss,
    layoutCssVarss,
    columnMetricss,
    lastFrozenColumnIndexx,
    totalFrozenColumnWidthh,
    groupBy,
  };
}
