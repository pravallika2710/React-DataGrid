import { useState, useRef } from "react";
import DataGrid from "../components/datagrid/DataGrid";

const columns = [
  { field: "id", headerName: "ID", width: 200 },
  { field: "title", headerName: "Title", width: 200 },
  { field: "count", headerName: "Count", width: 200 },
];

export default function ScrollToRow({ direction }) {
  const [rows] = useState(() => {
    const rows = [];

    for (let i = 0; i < 1000; i++) {
      rows.push({
        id: i,
        title: `Title ${i}`,
        count: i * 1000,
      });
    }

    return rows;
  });
  const [value, setValue] = useState(10);
  const gridRef = useRef(null);

  return (
    <>
      <div style={{ marginBlockEnd: 5 }}>
        <span style={{ marginInlineEnd: 5 }}>Row index: </span>
        <input
          style={{ inlineSize: 50 }}
          type="number"
          value={value}
          onChange={(event) => setValue(event.target.valueAsNumber)}
        />
        <button
          type="button"
          onClick={() => gridRef.current.scrollToRow(value)}
        >
          Scroll to row
        </button>
      </div>
      <DataGrid
        ref={gridRef}
        columnData={columns}
        rowData={rows}
        headerRowHeight={25}
        direction={direction}
      />
    </>
  );
}
