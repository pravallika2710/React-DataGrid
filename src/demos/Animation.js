import { useState } from "react";
import { css } from "@linaria/core";

import DataGrid from "../components/datagrid/DataGrid";

const rangeClassname = css`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

const transitionClassname = css`
  transition: grid-template-rows 0.5s ease;

  > :is(.rdg-header-row, .rdg-row) {
    transition: line-height 0.5s ease;
  }
`;

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
    width: 150,
  },
  {
    field: "priority",
    headerName: "Priority",
    width: 150,
  },
  {
    field: "issueType",
    headerName: "Issue Type",
    width: 150,
  },
  {
    field: "complete",
    headerName: "% Complete",
    width: 150,
  },
];

const rows = createRows();

export default function ColumnsReordering({ direction }) {
  const [rowHeight, setRowHeight] = useState(24);

  return (
    <>
      <div className={rangeClassname}>
        Row Height
        <button onClick={() => setRowHeight(24)}>Small</button>
        <button onClick={() => setRowHeight(60)}>Medium</button>
        <button onClick={() => setRowHeight(90)}>Large</button>
      </div>
      <DataGrid
        className={`${transitionClassname} fill-grid`}
        columnData={columns}
        headerRowHeight={24}
        rowData={rows}
        direction={direction}
        rowHeight={rowHeight}
      />
    </>
  );
}
