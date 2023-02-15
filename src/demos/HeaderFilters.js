import { useMemo, useState } from 'react';
import { css } from '@linaria/core';
import { faker } from '@faker-js/faker';
import DataGrid from "../components/datagrid/DataGrid";
import { Parser, SUPPORTED_FORMULAS } from 'hot-formula-parser';

const rootClassname = css`
  display: flex;
  flex-direction: column;
  block-size: 100%;
  gap: 10px;

  > .rdg {
    flex: 1;
  }
`;

// Context is needed to read filter values otherwise columns are
// re-created when filters are changed and filter loses focus

export default function HeaderFilters({ direction }) {
  const [rows] = useState(createRows);

  const columns = useMemo(() => {
    return [
      {
        field: 'id',
        headerName: 'ID',
        width: 50
      },
      {
        field: 'task',
        headerName: 'Title',
        sortable: true,
        filter: true,
        width: 260,
      },
      {
        field: 'priority',
        headerName: 'Priority',
        filter: true,
        width: 250,
      },
      {
        field: 'issueType',
        headerName: 'Issue Type',
        sortable: true,
        width: 150
      },
      {
        field: 'complete',
        headerName: '% Complete',
        width: 150
      }
    ];
  }, []);

  return (
    <div className={rootClassname}>
      <DataGrid
        columnData={columns}
        rowData={rows}
        rowHeight={25}
        headerRowHeight={70}
        summaryRowHeight={24}
        direction={direction}
      />
    </div>
  );
}

function createRows() {
  const rows = [];
  for (let i = 1; i < 50; i++) {
    rows.push({
      id: i,
      task: `Task ${i}`,
      complete: Math.min(100, Math.round(Math.random() * 110)),
      priority: ['Critical', 'High', 'Medium', 'Low'][Math.floor(Math.random() * 4)],
      issueType: ['Bug', 'Improvement', 'Epic', 'Story'][Math.floor(Math.random() * 4)],
    });
  }
  return rows;
}
