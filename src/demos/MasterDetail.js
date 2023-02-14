import { useEffect, useMemo, useRef, useState } from "react";
import { css } from "@linaria/core";
import { faker } from "@faker-js/faker";

import DataGrid from "../components/datagrid/DataGrid";
import { CellExpanderFormatter } from "./CellExpanderFormatter";

function createDepartments() {
  const departments = [];
  for (let i = 1; i < 30; i++) {
    departments.push({
      type: "MASTER",
      id: i,
      department: faker.commerce.department(),
      expanded: false,
    });
  }
  return departments;
}

const productsMap = new Map();
function getProducts(parentId) {
  if (productsMap.has(parentId)) return productsMap.get(parentId);
  const products = [];
  for (let i = 0; i < 20; i++) {
    products.push({
      id: i,
      product: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: faker.commerce.price(),
    });
  }
  productsMap.set(parentId, products);
  return products;
}

const productColumns = [
  { field: "id", topHeader: "id", headerName: "ID", width: 35 },
  {
    field: "product",
    topHeader: "product",
    headerName: "Product",
    width: 100,
  },
  {
    field: "description",
    topHeader: "description",
    headerName: "Description",
    width: 100,
  },
  { field: "price", topHeader: "price", headerName: "Price", width: 100 },
];

export default function MasterDetail({ direction }) {
  const columns = useMemo(() => {
    return [
      {
        field: "expanded",
        topHeader: "expanded",
        headerName: "",
        minWidth: 30,
        width: 30,
        colSpan(args) {
          return args.type === "ROW" && args.row.type === "DETAIL"
            ? 3
            : undefined;
        },
        cellClass(row) {
          return row.type === "DETAIL"
            ? css`
                padding: 24px;
              `
            : undefined;
        },
        valueFormatter({ row, isCellSelected, onRowChange }) {
          if (row.type === "DETAIL") {
            return (
              <ProductGrid
                isCellSelected={isCellSelected}
                parentId={row.parentId}
                direction={direction}
              />
            );
          }

          return (
            <CellExpanderFormatter
              expanded={row.expanded}
              isCellSelected={isCellSelected}
              onCellExpand={() => {
                onRowChange({ ...row, expanded: !row.expanded });
              }}
            />
          );
        },
      },
      { field: "id", topHeader: "id", headerName: "ID", width: 100 },
      {
        field: "department",
        topHeader: "department",
        headerName: "Department",
        width: 400,
      },
    ];
  }, [direction]);
  const [rows, setRows] = useState(createDepartments);

  function onRowsChange(rows, { indexes }) {
    const row = rows[indexes[0]];
    if (row.type === "MASTER") {
      if (!row.expanded) {
        rows.splice(indexes[0] + 1, 1);
      } else {
        rows.splice(indexes[0] + 1, 0, {
          type: "DETAIL",
          id: row.id + 100,
          parentId: row.id,
        });
      }
      setRows(rows);
    }
  }

  return (
    <DataGrid
      rowKeyGetter={rowKeyGetter}
      columnData={columns}
      rowData={rows}
      onRowsChange={onRowsChange}
      headerRowHeight={45}
      rowHeight={(args) =>
        args.type === "ROW" && args.row.type === "DETAIL" ? 300 : 45
      }
      className="fill-grid"
      enableVirtualization={false}
      summaryRowHeight={24}
      direction={direction}
    />
  );
}

function ProductGrid({ parentId, isCellSelected, direction }) {
  const gridRef = useRef(null);
  useEffect(() => {
    if (!isCellSelected) return;
    gridRef.current.element.querySelector <
      HTMLDivElement >
      '[tabindex="0"]'.focus({ preventScroll: true });
  }, [isCellSelected]);
  const products = getProducts(parentId);

  function onKeyDown(event) {
    if (event.isDefaultPrevented()) {
      event.stopPropagation();
    }
  }

  return (
    <div onKeyDown={onKeyDown}>
      <DataGrid
        ref={gridRef}
        rowData={products}
        headerRowHeight={45}
        columnData={productColumns}
        rowKeyGetter={rowKeyGetter}
        style={{ blockSize: 250 }}
        direction={direction}
      />
    </div>
  );
}

function rowKeyGetter(row) {
  return row.id;
}
