

import AllFeatures from './AllFeatures';
import CommonFeatures from './CommonFeatures';
import { css } from "@linaria/core"
import React, { StrictMode, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Nav from './Nav';
import CellNavigation from './CellNavigation';
import NoRows from './NoRows';
import ColumnsReordering from './ColumnsReordering';
import ColumnSpanning from './ColumnSpanning';
import ContextMenuDemo from './ContextMenu';
import CustomizableComponents from './CustomizableComponents';
import Grouping from './Grouping';
import HeaderFilters from './HeaderFilters';
import InfiniteScrolling from './InfiniteScrolling';
import MasterDetail from './MasterDetail';
import MillionCells from './MillionCells';
import ResizableGrid from './Resizable';
import RowsReordering from './RowsReordering';
import ScrollToRow from './ScrollToRow';
import TreeView from './TreeView';
import VariableRowHeight from './VariableRowHeight';



css`
  @at-root {
    :root,
    body {
      padding: 0;
      margin: 0;
      font-family: sans-serif;
    }

    :root {
      color-scheme: light dark;

      @media (prefers-color-scheme: light) {
        background-color: #fff;
        color: #111;
      }

      @media (prefers-color-scheme: dark) {
        background-color: hsl(0deg 0% 10%);
        color: #fff;
      }
    }

    #root {
      display: grid;
      grid-template-columns: auto 1fr;
    }

    
    .rdg.fill-grid {
    
    }
    .rdg.small-grid {
      block-size: 300px;
    }

   
  }
`;



function App() {
  const [direction, setDirection] = useState('ltr');
  return (
    <Router>
      <Nav direction={direction} onDirectionChange={setDirection} />
      <main className="aaaa" dir={direction}>
        <Routes>
          <Route index element={<Navigate to="common-features" replace />} />
          <Route path="common-features" element={<CommonFeatures direction={direction} />} />
          <Route path="all-features" element={<AllFeatures direction={direction} />} />
          <Route path="cell-navigation" element={<CellNavigation direction={direction} />} />
          <Route path="column-spanning" element={<ColumnSpanning direction={direction} />} />
          <Route path="columns-reordering" element={<ColumnsReordering direction={direction} />} />
          <Route path="context-menu" element={<ContextMenuDemo direction={direction} />} />
          <Route path="customizable-components" element={<CustomizableComponents direction={direction} />}/>
          <Route path="grouping" element={<Grouping direction={direction} />} />
          <Route path="header-filters" element={<HeaderFilters direction={direction} />} />
          <Route path="infinite-scrolling" element={<InfiniteScrolling direction={direction} />} />
          <Route path="master-detail" element={<MasterDetail direction={direction} />} />
          <Route path="million-cells" element={<MillionCells direction={direction} />} />
          <Route path="no-rows" element={<NoRows direction={direction} />} />
          <Route path="resizable-grid" element={<ResizableGrid direction={direction} />} />
          <Route path="rows-reordering" element={<RowsReordering direction={direction} />} />
          <Route path="scroll-to-row" element={<ScrollToRow direction={direction} />} />
          <Route path="tree-view" element={<TreeView direction={direction} />} />
          <Route path="variable-row-height" element={<VariableRowHeight direction={direction} />} />
          {/* <Route path="animation" element={<Animation direction={direction} />} /> */}
          <Route path="*" element="Nothing to see here" />
        </Routes>
      </main>
    </Router>
  );
}

export default App;


