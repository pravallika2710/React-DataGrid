import { useMemo, useState } from "react";
import { SelectColumn } from "../components/datagrid/Columns";
import DataGrid from "../components/datagrid/DataGrid";
import { css } from "@linaria/core";


const highlightClassName = css`
  .rdg-cell {
    background-color: #9370db;
    color: white;
    position: sticky;
    top: 30px;
    z-index: 2;
  }

  &:hover .rdg-cell {
    background-color: #800080;
  }
`;
export default function NoRows({ direction }) {
  const [selectedRows, onSelectedRowsChange] = useState(() => new Set());
  
  const columns = useMemo(() => {
    return [
      SelectColumn,
      {
        field: "id",
        headerName: "ID",
        sortable: true,
        filter: true,
        haveChildren: false,
        width: 240,
        // frozen: true,
      },
      {
        field: "rdsrd",
        headerName: "AASS",
        // sortable: true,
        haveChildren: false,
        width: 240,
        // frozen: true,
        filter: true,
      },

      {
        field: "title",
        headerName: "Title",
        haveChildren: true,
        // frozen: true,
        children: [
          {
            field: "aaaa",
            headerName: "AAAA",

            haveChildren: true,
            children: [
              {
                field: "vvvv",
                headerName: "VVVV",
                haveChildren: false,
                width: 260,
                sortable: true,
                filter: true,
              },

              {
                field: "rrrr",
                headerName: "RRRR",
                haveChildren: false,
                width: 100,
                sortable: true,
                // frozen: true,
              },
              {
                field: "uuuu",
                headerName: "UUUU",
                haveChildren: false,
                width: 240,
                filter: true
                // frozen: true,
              },
            ],
          },
          {
            // frozen: true,
            field: "bbbb",
            headerName: "BBBB",
            haveChildren: true,
            children: [
              {
                field: "wsdc",
                headerName: "HGTF",
                haveChildren: false,
                width: 100,
                // frozen: true,
              },
              {
                field: "yugd",
                headerName: "HGFBGV",
                haveChildren: false,
                width: 100,
                // frozen: true,
              },
            ],
          },
          {
            field: "cccc",
            headerName: "CCCC",

            haveChildren: true,
            // frozen: true,
            children: [
              {
                field: "yuwgd",
                headerName: "HGFBGV",
                haveChildren: false,
                width: 100,
                // frozen: true,
              },
              {
                field: "yqugd1",
                headerName: "HGFBGV1",
                haveChildren: true,
                width: 100,
                // frozen: true,
                children: [
                  {
                    field: "cvdcv",
                    headerName: "FGHT",
                    haveChildren: false,
                    width: 60,
                    // frozen: true,
                  },
                  {
                    field: "cvacv",
                    headerName: "FGHT",
                    haveChildren: false,
                    width: 60,
                    // frozen: true,
                  },
                ],
              },
            ],
          },
        ],
      },
    ];
  }, []);

  
function createRows() {
  const rows = [];
  for (let i = 1; i < 50; i++) {
    rows.push({
      id: i,
      rdsrd: `Task ${i}`,
      vvvv: Math.min(100, Math.round(Math.random() * 110)),
      rrrr: ['Critical', 'High', 'Medium', 'Low'][Math.floor(Math.random() * 4)],
      uuuu: ['Bug', 'Improvement', 'Epic', 'Story'][Math.floor(Math.random() * 4)],
      wsdc: `wsdc${i}`,
      yugd: Math.min(100, Math.round(Math.random() * 110)),
      cvdcv: ['Critical', 'High', 'Medium', 'Low'][Math.floor(Math.random() * 4)],
      cvacv: ['Bug', 'Improvement', 'Epic', 'Story'][Math.floor(Math.random() * 4)],
    });
  }
  return rows;
}

  const [rows, setRows] = useState(createRows);

  const selectedCellHeaderStyle = {
    backgroundColor: "green",
    fontSize: "12px",
  };
  return (
    <DataGrid
      columnData={columns}
      rowData={rows}
      selectedRows={selectedRows}
      onRowsChange={setRows}
      onFill={true}
      onSelectedRowsChange={onSelectedRowsChange}
      selectedCellHeaderStyle={selectedCellHeaderStyle}
      headerRowHeight={24}
      className="fill-grid"
      rowClass={(row) => (row.id === "7" ? highlightClassName : undefined)}
      rowFridgeIndexEnd={7}
    />
  );
}
