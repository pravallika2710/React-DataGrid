import { createContext, useContext, useMemo, useState } from "react";

import { SelectColumn } from "../components/datagridTest/Columns";

import DataGrid from "../components/datagridTest2/DataGrid";
import { css } from "@linaria/core";

const highlightClassheaderName = css`
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

function rowKeyGetter(row) {
  return row.id;
}

export default function NoRows({ direction }) {
  const [selectedRows, onSelectedRowsChange] = useState(() => new Set());
  const [rows] = useState(createRows);

  const columns = useMemo(() => {
    return [
      SelectColumn,
      {
        field: "id",
        headerName: "ID",
        sortable:true,
        // filter:true,
        haveChildren: false,
        topHeader: "id",
        cellWidth: 60,
        frozen: true,
        summaryFormatter() {
          return <strong>Total</strong>;
        },
      },
      {
        field: "aaaa",
        headerName: "AAAA",
        haveChildren: false,
        topHeader: "rdsrd",
        cellWidth: 60,
        frozen: true,
      },
    

      {
        field: "title",
        headerName: "Title",
        haveChildren: true,
        frozen: true,
        // cellWidth: 727,
        topHeader: "title",

        children: [
          // SelectColumn,
          {
            // frozen: true,
            field: "aaaa",
            headerName: "AAAA",

            haveChildren: true,
            children: [
              {
                field: "bbbb",
                headerName: "BBBB",
                haveChildren: false,
                cellWidth: 100,
                topHeader: "title",
                frozen: true,
              },

              {
                field: "cccc",
                headerName: "CCCC",
                haveChildren: false,
                cellWidth: 100,
                topHeader: "title",
                frozen: true,
              },
            ],
          },
          {
            frozen: true,
            field: "bbCbb",
            headerName: "BBBB",
            haveChildren: true,
            children: [
              {
                field: "dddd",
                headerName: "DDDD",
                haveChildren: false,
                cellWidth: 100,
                topHeader: "title",
                frozen: true,
              },
              {
                field: "eeee",
                headerName: "EEEE",
                haveChildren: false,
                cellWidth: 100,
                topHeader: "title",
                frozen: true,
              },
            ],
          },
          {
            field: "cxccc",
            headerName: "CCCC",

            haveChildren: true,
            topHeader: "title",
            frozen: true,
            children: [
              {
                field: "yuwgd",
                headerName: "HGFBGV",
                haveChildren: false,
                cellWidth: 100,
                topHeader: "title",
                frozen: true,
              },
              {
                field: "yqugd",
                headerName: "HGFBGV",
                haveChildren: true,
                topHeader: "title",
                
                frozen: true,
                children: [
                  {
                    field: "tttt",
                    headerName: "TTTT",
                    haveChildren: false,
                    topHeader: "title",
                    cellWidth: 60,
                    frozen: true,
                  },
                  {
                    field: "cvacv",
                    headerName: "FGHT",
                    haveChildren: false,
                    topHeader: "title",
                    cellWidth: 60,
                    frozen: true,
                  },
                ],
              },
            ],
          },
        ],
      },
    ];
  }, []);
  
  
  return (
    <DataGrid
      columns={columns}
      rows={rows}
      selectedRows={selectedRows}
      onSelectedRowsChange={onSelectedRowsChange}
      headerRowHeight={24}
      summaryRowHeight={24}
      rowKeyGetter={rowKeyGetter}
      className="fill-grid"
      rowClass={(row) => (row.id === "7" ? highlightClassheaderName : undefined)}
      rowFridgeIndexEnd={7}
      singleRowFridgeIndex={11}
      // direction={direction}
    />
  );
}
function createRows() {
  const rows = [];
  for (let i = 1; i < 50; i++) {
    rows.push({
      id: i,
      aaaa: `Task ${i}`,
      bbbb: Math.min(100, Math.round(Math.random() * 110)),
      cccc: ['Critical', 'High', 'Medium', 'Low'][Math.floor(Math.random() * 4)],
      dddd: ['Bug', 'Improvement', 'Epic', 'Story'][Math.floor(Math.random() * 4)],
      ffff: `ffff${i}`
    });
  }
  return rows;
}