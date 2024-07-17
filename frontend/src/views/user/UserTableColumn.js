import React, { Fragment } from "react";
import { Link } from "react-router-dom";

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
    Header: "Mobile",
    accessor: "mobile",
  },

  {
    Header: "Email",
    accessor: "email",
  },

  {
    Header: "Company",
    accessor: "company",
    Cell: ({ cell: { value } }) => (
      <Fragment>{value.map((company) => `${company} `)}</Fragment>
    ),
  },

  {
    Header: "Groups",
    accessor: "groups",
    Cell: ({ cell: { value } }) => (
      <Fragment>{value.map((group) => `${group} `)}</Fragment>
    ),
  },

  {
    Header: "Edit",
    accessor: (row, rowIndex) => row,
    Cell: ({ cell: { value } }) => (
      <Fragment>
        <Link
          to={`/app/usermanagement/edit/${value.id}`}
          className="btn btn-sm btn-light"
        >
          <i className="iconsminds-file-edit"> </i>
        </Link>
      </Fragment>
    ),
  },
];

export default columns;
