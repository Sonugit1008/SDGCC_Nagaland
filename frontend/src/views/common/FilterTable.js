import React, { Fragment, useState } from "react";
import { useTable, useSortBy, usePagination, useFilters, useGlobalFilter, useAsyncDebounce } from "react-table";
import styled from "styled-components";

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
  .form-control {
    border-radius: 0.1rem;
    outline: medium none invert !important;
    font-size: 0.8rem;
    padding: 0.75rem;
    line-height: 1.5;
    border: 1px solid #d7d7d7;
    background: white;
    color: #212121;
    height: initial;
}
`;

function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter, filteredRows },
  getData
}) {

  const count = preFilteredRows.length

  const onChange = useAsyncDebounce(() => {
    getData(filteredRows);
  }, 500)

  return (
    <input
      value={filterValue || ''}
      onChange={e => {
        setFilter(e.target.value || undefined);
        onChange();
      }}
      className={"form-control"}
      placeholder={`Search ${count} records...`}
    />
  )
}

function TableEdit({
  columns,
  data,
  updateMyData,
  skipPageReset,
  tableStyle,
  getData
}) {

  const defaultColumn = React.useMemo(
    () => ({
      Filter: (props) => <DefaultColumnFilter {...props} getData={(data) => getData(data)} />,
    }),
    []// eslint-disable-line react-hooks/exhaustive-deps
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows
  } = useTable(
    {
      columns,
      data,
      autoResetPage: !skipPageReset,
      initialState: { pageIndex: 0 },
      updateMyData,
      defaultColumn
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,
  );

  return (
    <Fragment>
      <table
        id="reporttable"
        style={{ display: tableStyle || 'inline-table' }}
        className="table table-responsive  mt-4 ml-1 mr-1"
        {...getTableProps()}
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
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
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  <div>{column.isFilter ? column.render('Filter') : null}</div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
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
    </Fragment>
  );
}

function Table({ data, columns, getData, tableStyle }) {

  const columns_list = React.useMemo(() => columns, []);// eslint-disable-line react-hooks/exhaustive-deps
  const [dataItems, setData] = useState(data);
  const [skipPageReset, setSkipPageReset] = React.useState(false);

  React.useEffect(() => {
    setData(data);
  }, [data]);

  React.useEffect(() => {
    setSkipPageReset(false);
  }, [dataItems]);

  return (
    <Styles>
      <TableEdit
        columns={columns_list}
        data={dataItems}
        getData={getData}
        skipPageReset={skipPageReset}
        tableStyle={tableStyle}
      />
    </Styles>
  );
}

export default Table;
