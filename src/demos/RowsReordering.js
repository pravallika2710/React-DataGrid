import { useCallback, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

// import { DraggableRowRenderer } from '../components/RowRenderers';
import textEditor from "../components/datagrid/editors/textEditor";
import DataGrid from "../components/datagrid/DataGrid";
import { DraggableRowRenderer } from "./DraggableRowRenderer";

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
    topHeader: "id",
    headerName: "ID",
    cellWidth: 80,
  },
  {
    field: "task",
    topHeader: "task",
    headerName: "Title",
    cellEditor: textEditor,
    cellWidth: 200,
  },
  {
    field: "priority",
    topHeader: "priority",
    headerName: "Priority",
    cellWidth: 200,
  },
  {
    field: "issueType",
    topHeader: "issueType",
    headerName: "Issue Type",
    cellWidth: 200,
  },
  {
    field: "complete",
    topHeader: "complete",
    headerName: "% Complete",
    cellWidth: 200,
  },
];

export default function RowsReordering({ direction }) {
  const [rows, setRows] = useState(createRows);

  const rowRenderer = useCallback((key, props) => {
    function onRowReorder(fromIndex, toIndex) {
      setRows((rows) => {
        const newRows = [...rows];
        newRows.splice(toIndex, 0, newRows.splice(fromIndex, 1)[0]);
        return newRows;
      });
    }

    return (
      <DraggableRowRenderer key={key} {...props} onRowReorder={onRowReorder} />
    );
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <DataGrid
        columnData={columns}
        rowData={rows}
        headerRowHeight={25}
        onRowsChange={setRows}
        renderers={{ rowRenderer }}
        direction={direction}
      />
    </DndProvider>
  );
}
