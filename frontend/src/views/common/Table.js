import React, { Fragment, useState } from "react";
import {
  useTable,
  usePagination,
  useFilters,
  useGlobalFilter,
} from "react-table";
import styled from "styled-components";
import Select from "react-select";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

const Styles = styled.div`
  padding: 1rem;
  table {
    border-spacing: 0;
    // border: 1px solid black;
    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }
    th,
    td {
      margin: 0;
      padding: 0.5rem;
      // border-bottom: 1px solid black;
      // border-right: 1px solid black;
      :last-child {
        border-right: 0;
      }
      input {
        font-size: 1rem;
        padding: 0;
        margin: 0;
        border: 0;
      }
    }
  }
  .pagination {
    padding: 0.5rem;
  }
`;

function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter, filteredRows },
}) {
  const count = preFilteredRows.length;

  return (
    <input
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
      className={"form-control border p-1 text-sm"}
      placeholder={`Search ${count} records...`}
    />
  );
}

function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const options = new Set();
    preFilteredRows.forEach((row) => {
      options.add(row.values[id]);
    });
    return [...options.values()];
  }, [id, preFilteredRows]);

  // Render a multi-select box
  return (
    <Select
      value={filterValue ? { label: filterValue, value: filterValue } : null}
      onChange={(e) => {
        setFilter(e.value || undefined);
      }}
      options={options.map((option) => {
        return {
          label: option,
          value: option,
        };
      })}
    />
  );
}

function TableEdit({
  columns,
  data,
  updateMyData,
  skipPageReset,
  noPagination,
  tableStyle,
  tableIndex,
  getData,
  exportColumns,
  exportButton,
  exportName,
}) {
  const defaultColumn = React.useMemo(
    () => ({
      Filter: (props) => (
        <DefaultColumnFilter {...props} getData={(data) => getData(data)} />
      ),
    }),
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const filterTypes = React.useMemo(
    () => ({
      text: (rows, id, filterValue) => {
        let rws = rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .includes(String(filterValue).toLowerCase())
            : true;
        });

        if (rws && rws.length > 0) return rws;

        let rr = { ...rows[0] };
        rr.values = {};
        return [rr];
      },
      companyfilter: (rows, id, filterValue) => {
        let rws = rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? rowValue.company && rowValue.company[0]
              ? String(rowValue.company[0])
                  .toLowerCase()
                  .includes(String(filterValue).toLowerCase())
              : false
            : true;
        });
        if (rws && rws.length > 0) return rws;

        let rr = { ...rows[0] };
        rr.values = {};
        return [rr];
      },
      groupfilter: (rows, id, filterValue) => {
        let rws = rows.filter((row) => {
          const rowValue = row.values[id];
          let flag = false;

          if (rowValue.groups && rowValue.groups.length > 0) {
            rowValue.groups.forEach((grp) => {
              if (
                String(grp)
                  .toLowerCase()
                  .includes(String(filterValue).toLowerCase())
              )
                flag = true;
            });
          }
          return flag;
        });

        if (rws && rws.length > 0) return rws;

        let rr = { ...rows[0] };
        rr.values = {};
        return [rr];
      },
      facilityfilter: (rows, id, filterValue) => {
        let rws = rows.filter((row) => {
          const rowValue = row.values[id];
          let flag = false;

          if (rowValue.facility_name && rowValue.facility_name.length > 0) {
            rowValue.facility_name.forEach((fac) => {
              if (
                String(fac)
                  .toLowerCase()
                  .includes(String(filterValue).toLowerCase())
              )
                flag = true;
            });
          }
          return flag;
        });

        if (rws && rws.length > 0) return rws;

        let rr = { ...rows[0] };
        rr.values = {};
        return [rr];
      },
      numPlateFilter: (rows, id, filterValue) => {
        let rws = rows.filter((row) => {
          const rowValue = row.values[id];
          let flag = false;

          if (
            String(rowValue.actual_number_plate)
              .toLowerCase()
              .includes(String(filterValue).toLowerCase())
          )
            flag = true;

          if (
            String(rowValue.number_plate)
              .toLowerCase()
              .includes(String(filterValue).toLowerCase())
          )
            flag = true;

          return flag;
        });

        if (rws && rws.length > 0) return rws;

        let rr = { ...rows[0] };
        rr.values = {};
        return [rr];
      },
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows, // rows for the table based on the data passed
    prepareRow,
    page, // page is for panination purpose
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      autoResetPage: !skipPageReset,
      initialState: {
        pageIndex: Number(localStorage.getItem(tableIndex))
          ? Number(localStorage.getItem(tableIndex))
          : 0,
      },
      updateMyData,
      defaultColumn,
      filterTypes,
    },
    useFilters,
    useGlobalFilter,
    usePagination
  );

  function getRows() {
    if (pageIndex >= pageOptions.length) {
      gotoPage(0);
    }

    return noPagination ? rows : page;
  }

  async function getExportData(headers) {
    let keys = exportColumns;
    let apiData = [];

    await headers[0].filteredRows.forEach((data) => {
      let val = data.original;
      let length = keys.length;
      let obj = {};
      for (var i = 0; i < length; i++) {
        obj[keys[i].name] = val[keys[i].value];
      }

      apiData.push(obj);
    });

    let fileName = exportName ? exportName : "ExportData";
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    const ws = XLSX.utils.json_to_sheet(apiData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  return (
    <Fragment>
      {exportButton ? (
        <div className="d-flex justify-content-end mr-1">
          <button
            className="btn btn-success mt-2 ml-2"
            onClick={(e) => getExportData(headerGroups[0].headers, getRows())}
          >
            {" "}
            <i className="iconsminds-save"> Export</i>
          </button>
        </div>
      ) : (
        <></>
      )}
      <table
        id="reporttable"
        style={{ display: tableStyle || "inline-table" }}
        className="table table-responsive  mt-4 mx-1"
        // eslint-disable-next-line
        // style={{ overflowX: "auto" }}
        {...getTableProps()}
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column)}>
                  {column.render("Header")}
                  <span>
                    {column.isSorted ? (
                      column.isSortedDesc ? (
                        <i className="simple-icon-arrow-down float-right" />
                      ) : (
                        <i className="simple-icon-arrow-up float-right" />
                      )
                    ) : (
                      ""
                    )}
                  </span>
                </th>
              ))}
            </tr>
          ))}
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column)}>
                  <div>{column.isFilter ? column.render("Filter") : null}</div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {getRows().map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} className="user-list-tr">
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      {!noPagination ? (
        <div className="pagination">
          <button
            className="btn btn-sm btn-primary mr-2"
            onClick={() => {
              localStorage.setItem(tableIndex, 0);
              gotoPage(0);
            }}
            disabled={!canPreviousPage}
          >
            {"<<"}
          </button>{" "}
          <button
            className="btn btn-sm btn-primary mr-2"
            onClick={() => {
              canPreviousPage
                ? localStorage.setItem(
                    tableIndex,
                    Number(localStorage.getItem(tableIndex)) - 1
                  )
                : localStorage.setItem(tableIndex, 0);
              previousPage();
            }}
            disabled={!canPreviousPage}
          >
            {"<"}
          </button>{" "}
          <button
            className="btn btn-sm btn-primary mr-2"
            onClick={() => {
              canNextPage
                ? localStorage.setItem(
                    tableIndex,
                    Number(localStorage.getItem(tableIndex)) + 1
                  )
                : localStorage.setItem(tableIndex, pageCount - 1);
              nextPage();
            }}
            disabled={!canNextPage}
          >
            {">"}
          </button>{" "}
          <button
            className="btn btn-sm btn-primary mr-2"
            onClick={() => {
              localStorage.setItem(tableIndex, pageCount - 1);
              gotoPage(pageCount - 1);
            }}
            disabled={!canNextPage}
          >
            {">>"}
          </button>{" "}
          <span className="mt-2">
            Page{" "}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>{" "}
          </span>
          <span>
            <Fragment>| Go to page: </Fragment>
            <input
              type="number"
              min="0"
              defaultValue={pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                if (page >= 0) {
                  localStorage.setItem(tableIndex, page);
                  gotoPage(page);
                }
              }}
              style={{ width: "100px" }}
            />
          </span>{" "}
          <Select
            className={`pagination-select ${
              localStorage.getItem("__theme_color")?.includes("dark")
                ? "custom-select-add-dark"
                : ""
            }`}
            onChange={(data) => {
              setPageSize(+data.value);
            }}
            options={[10, 20, 30, 40, 50, "All"].map((page) => {
              return {
                label: page,
                value: page === "All" ? data.length : page,
              };
            })}
            value={{
              label: pageSize === data.length ? "All" : pageSize,
              value: pageSize,
            }}
          />
        </div>
      ) : null}
    </Fragment>
  );
}

function Table({
  data,
  columns,
  getData,
  dataUpdateFunction,
  noPagination,
  tableStyle,
  tableIndex,
  columnFilter,
  exportColumns,
  exportButton,
  exportName,
}) {
  let colmns = columns;
  if (columnFilter && columnFilter?.length > 0) {
    const colmn = columns.map((col) => {
      let coll = col;
      columnFilter.forEach((filt) => {
        if (filt.name === col.Header) {
          coll = {
            ...col,
            Filter: filt.dropDown ? SelectColumnFilter : DefaultColumnFilter,
            filter: "text",
            isFilter: true,
          };
          if (filt.arrFilter) coll.filter = filt.arrFilter;
          if (filt.isNumPlateFilter) coll.filter = filt.isNumPlateFilter;
          return coll;
        }
      });

      return coll;
    });

    colmns = colmn;
  }
  const columns_list = React.useMemo(() => colmns, []); // eslint-disable-line react-hooks/exhaustive-deps
  const [dataItems, setData] = useState(data);
  const [skipPageReset, setSkipPageReset] = React.useState(false);

  React.useEffect(() => {
    setData(data);
  }, [dataItems, data]); // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    setSkipPageReset(false);
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateMyData = (rowIndex, columnId, value) => {
    setSkipPageReset(true);

    setData((old) =>
      old.filter((row, index) => {
        if (index === rowIndex) {
          dataUpdateFunction({
            ...old[rowIndex],
            [columnId]: value,
          });
          return {
            ...old[rowIndex],
            [columnId]: value,
          };
        }
        return row;
      })
    );
  };

  return (
    <Styles>
      <TableEdit
        columns={columns_list}
        data={dataItems}
        updateMyData={updateMyData}
        skipPageReset={skipPageReset}
        noPagination={noPagination}
        tableStyle={tableStyle}
        tableIndex={tableIndex}
        getData={getData}
        exportColumns={exportColumns}
        exportButton={exportButton}
        exportName={exportName}
      />
    </Styles>
  );
}

export default Table;
