import React from "react";

const columns = [
  {
    Header: "First Name",
    accessor: "first_name",
  },

  {
    Header: "Last Name",
    accessor: "last_name",
  },
  {
    Header: "Email",
    accessor: "email",
  },
  {
    Header: "Mobile",
    accessor: "mobile",
  },
  {
    Header: "Groups",
    accessor: "groups",
  },
  {
    Header: "Facility",
    accessor: (row, rowIndex) => row,
    Cell: ({ cell: { value } }) => (
      <>
        {value.facility} {value.facility_name}
      </>
    ),
  },
  {
    Header: "Error",
    accessor: (row, rowIndex) => row,
    Cell: ({ cell: { value } }) => (
      <>
        <p className="text-danger">{value?.error}</p>
      </>
    ),
  },
];

export default columns;
