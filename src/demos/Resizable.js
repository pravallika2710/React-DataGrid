import DataGrid from "../components/datagrid/DataGrid";

const rows = [...Array(100).keys()];

function cellFormatter(props) {
  return (
    <>
      {props.column.key}&times;{props.row}
    </>
  );
}

const columns = [];
for (let i = 0; i < 50; i++) {
  const key = String(i);
  columns.push({
    field: key,
    topHeader: key,
    cellWidth: 100,
    headerName: key,
    valueFormatter: cellFormatter,
  });
}

export default function ResizableGrid({ direction }) {
  return (
    <DataGrid
      columnData={columns}
      rowData={rows}
      rowHeight={30}
      headerRowHeight={24}
      // summaryRowHeight={24}
      className="fill-grid"
      style={{ resize: "both" }}
      direction={direction}
    />
  );
}
