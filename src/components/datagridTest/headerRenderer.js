import React, {useState, useEffect, useContext} from "react";
import { css } from "@linaria/core";

import { useFocusRef } from "./hooks";
import { useDefaultComponents } from "./DataGridDefaultComponentsProvider";
import FilterContext from './filterContext';
import FiltersDropdown from './FiltersDropdown'

const headerSortCell = css`
  @layer rdg.SortableHeaderCell {
    cursor: pointer;
    display: flex;

    &:focus {
      outline: none;
    }
  }
`;

const headerSortCellClassname = `rdg-header-sort-cell ${headerSortCell}`;

const headerSortName = css`
  @layer rdg.SortableHeaderCellName {
    flex-grow: 1;
    overflow: hidden;
    overflow: clip;
    text-overflow: ellipsis;
  }
`;

const headerSortNameClassname = `rdg-header-sort-name ${headerSortName}`;

const filterClassname = css`
  display: grid;
  grid-template-columns: auto auto;
  grid-gap: 10px;
  padding: 4px;
  font-size: 14px;
  inline-size: 100%;
`;

export default function headerRenderer({
  column,
  rows,
  cellHeight,              //need to be chnaged
  sortDirection,
  priority,
  onSort,
  isCellSelected,
  setFilters,
}) {
  const unique = [...new Set(rows?.map(item => item?.[column.field]))]
  const [options, setOptions] = useState([])
  useEffect(() => {
    let dummy = []
    unique.forEach(x => {
      dummy.push({
        key: column.field,
        listname: x,
        value: x
      })
    })
    setOptions(dummy)
  }, [column])

  const [open, setOpen] = useState(false)

  if (column.haveChildren === true) {
    return (
      <div>
        <div
          style={{
            borderBlockEnd: "1px solid var(--rdg-border-color)",
            height: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              height: "inherit",
              justifyContent: "center",
            }}
          >
            {column.headerName}
          </div>
        </div>
        <div
          style={{
            display: "flex",

            // gridTemplateColumns:"1fr 1fr 1fr",
            boxSizing: "border-box",
          }}
        >
          {column.children!== undefined && column.children.map((info, index) => {
            var ddd;
            if (index === column.children.length - 1) {
              ddd = "none";
            } else {
              ddd = "1px solid var(--rdg-border-color)";
            }
            return (
              <div
                style={{
                  margin: "",
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderInlineEnd: ddd,
                }}
              >
                {RecursiveScan(column.children, info, cellHeight, index, onSort, sortDirection, priority, isCellSelected, setFilters, options)}
              </div>
            );
          })}
        </div>
      </div>
    );
  } else {
    if(!column.sortable && !column.filter) {
      return (
        <div style={{ height: `${cellHeight}px` }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "inherit",
            }}
          >
            {column.headerName}
          </div>
        </div>
      );
    }
    if (column.sortable && !column.filter) {
      return (
        <SortableHeaderCell
          onSort={onSort}
          sortDirection={sortDirection}
          priority={priority}
          isCellSelected={isCellSelected}
        >
          {column.headerName}
        </SortableHeaderCell>
      )
    }
    if (column.filter && !column.sortable)
    return (
      <>
        <FilterRenderer column={column} isCellSelected={isCellSelected}>
          {({ filters, ...rest }) => (
            <div className={filterClassname}>
              <input
                {...rest}
                value={filters?.[column.field]}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    [column.field]: e.target.value
                  })
                }
                onKeyDown={inputStopPropagation}
              />
              {/* <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16" onClick={() => setOpen(true)}>
                <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5v-2zm1 .5v1.308l4.372 4.858A.5.5 0 0 1 7 8.5v5.306l2-.666V8.5a.5.5 0 0 1 .128-.334L13.5 3.308V2h-11z" />
              </svg>
              {open && <FiltersDropdown options={options} setFilters={setFilters} filters={filters} column={column} />} */}
            </div>
          )}
        </FilterRenderer>
      </>
    ) 
    if (column.filter && column.sortable)
    return (
      <>
        <SortableHeaderCell
          onSort={onSort}
          sortDirection={sortDirection}
          priority={priority}
          isCellSelected={isCellSelected}
        >
          {column.headerName}
        </SortableHeaderCell>
        <FilterRenderer column={column} isCellSelected={isCellSelected}>
          {({ filters, ...rest }) => (
            <div className={filterClassname}>
              <input
                {...rest}
                value={filters?.[column.field]}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    [column.field]: e.target.value
                  })
                }
                onKeyDown={inputStopPropagation}
              />
              {/* <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16" onClick={() => setOpen(true)}>
                <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5v-2zm1 .5v1.308l4.372 4.858A.5.5 0 0 1 7 8.5v5.306l2-.666V8.5a.5.5 0 0 1 .128-.334L13.5 3.308V2h-11z" />
              </svg> */}
              {/* {open && <FiltersDropdown options={options} setFilters={setFilters} filters={filters} column={column} />} */}
            </div>
          )}
        </FilterRenderer>
      </>
    )
  }
}

function RecursiveScan(masterData, subData, cellHeight, index, onSort, sortDirection, priority, isCellSelected, setFilters, options) {
  var cellHeight = cellHeight - 24;
  if (subData.haveChildren === true) {
    return (
      <div style={{ textAlign: "center" }}>
        {
          <div
            style={{
              borderBlockEnd: "1px solid var(--rdg-border-color)",
              height: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                height: "inherit",
                justifyContent: "center",
              }}
            >
              {subData.headerName}
            </div>
          </div>
        }
        <div
          style={{
            display: "flex",
            boxSizing: "border-box",
          }}
        >
          {subData.children.map((subInfo, index) => {
            var ddd;
            if (index === subData.children.length - 1) {
              ddd = "none";
            } else {
              ddd = "1px solid var(--rdg-border-color)";
            }
            return (
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderInlineEnd: ddd,
                }}
              >
                {RecursiveScan(subData.children, subInfo, cellHeight, index, onSort, sortDirection, priority, isCellSelected, setFilters, options)}
              </div>
            );
          })}
        </div>
      </div>
    );
  } else {
    if(!subData.sortable && !subData.filter)
    return (
      <div style={{ color: "red", width: subData.cellWidth, height: `${cellHeight}px` }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "inherit",

          }}
        >
          {subData.headerName}

        </div>
      </div>
    );
    if (subData.sortable && !subData.filter)
    return (
      <div style={{ width: subData.cellWidth }}>
        <SortableHeaderCell
          onSort={onSort}
          sortDirection={sortDirection}
          priority={priority}
          isCellSelected={isCellSelected}
        >
          {subData.headerName}
        </SortableHeaderCell>
      </div>
    )
    if (subData.filter && !subData.sortable)
    return (
      <>
        <FilterRenderer column={subData} isCellSelected={isCellSelected}>
          {({ filters, ...rest }) => (
            <div className={filterClassname}>
              <input
                {...rest}
                value={filters?.[subData.field]}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    [subData.field]: e.target.value
                  })
                }
                onKeyDown={inputStopPropagation}
              />
              {/* <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16" onClick={() => setOpen(true)}>
                <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5v-2zm1 .5v1.308l4.372 4.858A.5.5 0 0 1 7 8.5v5.306l2-.666V8.5a.5.5 0 0 1 .128-.334L13.5 3.308V2h-11z" />
              </svg> */}
              {/* {open && <FiltersDropdown options={options} setFilters={setFilters} filters={filters} column={subData} />} */}
            </div>
          )}
        </FilterRenderer>
      </>
    ) 
    if (subData.filter && subData.sortable)
    return (
      <>
        <SortableHeaderCell
          onSort={onSort}
          sortDirection={sortDirection}
          priority={priority}
          isCellSelected={isCellSelected}
        >
          {subData.headerName}
        </SortableHeaderCell>
        <FilterRenderer column={subData} isCellSelected={isCellSelected}>
          {({ filters, ...rest }) => (
            <div className={filterClassname}>
              <input
                {...rest}
                value={filters?.[subData.field]}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    [subData.field]: e.target.value
                  })
                }
                onKeyDown={inputStopPropagation}
              />
              {/* <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16" onClick={() => setOpen(true)}>
                <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5v-2zm1 .5v1.308l4.372 4.858A.5.5 0 0 1 7 8.5v5.306l2-.666V8.5a.5.5 0 0 1 .128-.334L13.5 3.308V2h-11z" />
              </svg> */}
              {/* {open && <FiltersDropdown options={options} setFilters={setFilters} filters={filters} column={column} />} */}
            </div>
          )}
        </FilterRenderer>
      </>
    )
  }
};

function SortableHeaderCell({
  onSort,
  sortDirection,
  priority,
  children,
  isCellSelected,
}) {
  const sortStatus = useDefaultComponents().sortStatus;
  const { ref, tabIndex } = useFocusRef(isCellSelected);

  function handleKeyDown(event) {
    if (event.key === " " || event.key === "Enter") {
      // stop propagation to prevent scrolling
      event.preventDefault();
      onSort(event.ctrlKey || event.metaKey, children);
    }
  }

  function handleClick(event) {
    onSort(event.ctrlKey || event.metaKey, children);
  }
  return (
    <span
      ref={ref}
      tabIndex={tabIndex}
      className={headerSortCellClassname}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <span className={headerSortNameClassname}>{children}</span>
      <span>{sortStatus({ sortDirection, priority })}</span>
    </span>
  );
}

function inputStopPropagation(event) {
  if (['ArrowLeft', 'ArrowRight'].includes(event.key)) {
    event.stopPropagation();
  }
}

function FilterRenderer({
  isCellSelected,
  column,
  children,
}) {
  const filters = useContext(FilterContext);
  const { ref, tabIndex } = useFocusRef(isCellSelected);
  return (
    <>
      {!column.sortable && <span className={headerSortNameClassname}>{column.headerName}</span>}
      {filters.enabled && <div>{children({ ref, tabIndex, filters })}</div>}
    </>
  );
}
