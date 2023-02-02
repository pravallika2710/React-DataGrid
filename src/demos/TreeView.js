import { useState, useReducer, useMemo } from "react";
import { CellExpanderFormatter } from "./CellExpanderFormatter";
import { ChildRowDeleteButton } from "./ChildRowDeleteButton";

import DataGrid from "../components/datagrid/DataGrid";

// import { CellExpanderFormatter, ChildRowDeleteButton } from '../components/Formatters';

function createRows() {
  const rows = [];
  for (let i = 0; i < 100; i++) {
    const price = Math.random() * 30;
    const id = `row${i}`;
    const row = {
      id,
      name: `supplier ${i}`,
      format: `package ${i}`,
      position: "Run of site",
      price,
      children: [
        {
          id: `${id}-0`,
          parentId: id,
          name: `supplier ${i}`,
          format: "728x90",
          position: "run of site",
          price: price / 2,
        },
        {
          id: `${id}-1`,
          parentId: id,
          name: `supplier ${i}`,
          format: "480x600",
          position: "run of site",
          price: price * 0.25,
        },
        {
          id: `${id}-2`,
          parentId: id,
          name: `supplier ${i}`,
          format: "328x70",
          position: "run of site",
          price: price * 0.25,
        },
      ],
      isExpanded: false,
    };
    rows.push(row);
  }
  return rows;
}

function toggleSubRow(rows, id) {
  const rowIndex = rows.findIndex((r) => r.id === id);
  const row = rows[rowIndex];
  const { children } = row;
  if (!children) return rows;

  const newRows = [...rows];
  newRows[rowIndex] = { ...row, isExpanded: !row.isExpanded };
  if (!row.isExpanded) {
    newRows.splice(rowIndex + 1, 0, ...children);
  } else {
    newRows.splice(rowIndex + 1, children.length);
  }
  return newRows;
}

function deleteSubRow(rows, id) {
  const row = rows.find((r) => r.id === id);
  if (row?.parentId === undefined) return rows;

  // Remove sub row from flattened rows.
  const newRows = rows.filter((r) => r.id !== id);

  // Remove sub row from parent row.
  const parentRowIndex = newRows.findIndex((r) => r.id === row.parentId);
  const { children } = newRows[parentRowIndex];
  if (children) {
    const newChildren = children.filter((sr) => sr.id !== id);
    newRows[parentRowIndex] = {
      ...newRows[parentRowIndex],
      children: newChildren,
    };
  }

  return newRows;
}

function reducer(rows, { type, id }) {
  switch (type) {
    case "toggleSubRow":
      return toggleSubRow(rows, id);
    case "deleteSubRow":
      return deleteSubRow(rows, id);
    default:
      return rows;
  }
}

const defaultRows = createRows();

export default function TreeView({ direction }) {
  const [rows, dispatch] = useReducer(reducer, defaultRows);
  const [allowDelete, setAllowDelete] = useState(true);
  const columns = useMemo(() => {
    return [
      {
        field: "id",
        topHeader: "id",
        headerName: "id",
        frozen: true,
        cellWidth: 100,
      },
      {
        field: "name",
        topHeader: "name",
        headerName: "Name",
        cellWidth: 100,
      },
      {
        field: "format",
        topHeader: "format",
        headerName: "format",
        cellWidth: 200,
        valueFormatter({ row, isCellSelected }) {
          const hasChildren = row.children !== undefined;
          const style = !hasChildren ? { marginInlineStart: 30 } : undefined;
          return (
            <>
              {hasChildren && (
                <CellExpanderFormatter
                  isCellSelected={isCellSelected}
                  expanded={row.isExpanded === true}
                  onCellExpand={() =>
                    dispatch({ id: row.id, type: "toggleSubRow" })
                  }
                />
              )}
              <div className="rdg-cell-value">
                {!hasChildren && (
                  <ChildRowDeleteButton
                    isCellSelected={isCellSelected}
                    isDeleteSubRowEnabled={allowDelete}
                    onDeleteSubRow={() =>
                      dispatch({ id: row.id, type: "deleteSubRow" })
                    }
                  />
                )}
                <div style={style}>{row.format}</div>
              </div>
            </>
          );
        },
      },
      {
        field: "position",
        topHeader: "position",
        headerName: "position",
        cellWidth: 200,
      },
      {
        field: "price",
        topHeader: "price",
        headerName: "price",
        cellWidth: 200,
      },
    ];
  }, [allowDelete]);

  return (
    <>
      <label>
        Allow Delete
        <input
          type="checkbox"
          checked={allowDelete}
          onChange={() => setAllowDelete(!allowDelete)}
        />
      </label>
      <DataGrid
        columnData={columns}
        rowData={rows}
        headerRowHeight={25}
        className="big-grid"
        direction={direction}
      />
    </>
  );
}
