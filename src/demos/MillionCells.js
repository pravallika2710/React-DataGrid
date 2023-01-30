import { useMemo } from 'react';
import DataGrid from '../components/datagrid/DataGrid';



const rows = [...Array(1000).keys()];

function cellFormatter(props) {
  return (
    <>
      {props.column.key}&times;{props.row}
    </>
  );
}

export default function MillionCells({ direction }) {
  const columns = useMemo(() => {
    const columns = [];

    for (let i = 0; i < 1000; i++) {
      const key = String(i);
      columns.push({
       field: key,
        headerName: key,
        frozen: i < 5,
        width: 80,
        resizable: true,
        valueFormatter: cellFormatter
      });
    }

    return columns;
  }, []);

  return (
    <DataGrid
      columnData={columns}
      rowData={rows}
      rowHeight={22}
      className="fill-grid"
      direction={direction}
    />
  );
}
