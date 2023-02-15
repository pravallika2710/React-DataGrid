import { useCallback, useState } from "react";
import DataGrid from "../components/datagrid/DataGrid";

function createRows() {
  const rows = [];

  for (let i = 1; i < 500; i++) {
    rows.push({
      id: i,
      task: `Task ${i}`,
      complete: Math.min(100, Math.round(Math.random() * 110)),
      priority: ["Critical", "High", "Medium", "Low"][
        Math.round(Math.random() * 3)
      ],
      issueType: ["Bug", "Improvement", "Epic", "Story"][
        Math.round(Math.random() * 3)
      ],
    });
  }

  return rows;
}

const columns = [
  {
    field: "id",
    headerName: "ID",
    width: 80,
  },
  {
    field: "task",
    headerName: "Title",
    rowDrag: true,
    width: 200,
  },
  {
    field: "priority",
    headerName: "Priority",
    width: 200,
  },
  {
    field: "issueType",
    headerName: "Issue Type",
    width: 200,
  },
  {
    field: "complete",
    headerName: "% Complete",
    width: 200,
  },
];

export default function RowsReordering({ direction }) {
  const [rows, setRows] = useState(createRows);


  return (
    <DataGrid
      columnData={columns}
      rowData={rows}
      headerRowHeight={25}
      onRowsChange={setRows}
      direction={direction}
    />
  );
}
