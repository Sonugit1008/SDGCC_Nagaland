import React, { Component } from "react";
import Table from "./Table";
import { Colxx } from "./CustomBootstrap";
import { ProgressBar, Row } from "react-bootstrap";

class DataTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columns: [
        {
          Header: "District",
          accessor: "properties.distname",
        },
        {
          Header: "Progress",
          accessor: (row, rowIndex) => row,
          Cell: ({ cell: { value } }) => (
            <>
              {value && (
                <ProgressBar
                  variant="success"
                  now={value.properties.distarea / 100}
                />
              )}
            </>
          ),
        },
        {
          Header: "Male",
          accessor: "properties.totpopmale",
        },
        {
          Header: "Female",
          accessor: "properties.totpopfema",
        },
      ],
    };
  }

  render() {
    return (
      <Row className="rounded">
        <Colxx lg="12">
          {console.log(
            this.props.showProgress,
            "dddddddd",
            this.props.showProgress
              ? this.state.columns
              : this.state.columns
                  .slice(0, 1)
                  .concat(this.state.columns.slice(2, 4))
          )}
          <Table
            columns={
              this.props.showProgress
                ? this.state.columns
                : this.state.columns
                    .slice(0, 1)
                    .concat(this.state.columns.slice(2, 4))
            }
            data={this.props.features}
            noPagination={true}
          />
        </Colxx>
      </Row>
    );
  }
}

export default DataTable;
