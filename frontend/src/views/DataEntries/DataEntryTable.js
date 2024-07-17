import React, { Component } from "react";
import { Card, Row } from "react-bootstrap";
import Table from "../common/Table";

class TargetTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModel: false,
      column_list: [
        {
          Header: "Entry Name",
          accessor: "name",
        },
        {
          Header: "Department",
          accessor: "department",
        },
        {
          Header: "Goal",
          accessor: "goal",
        },
        {
          Header: "Target",
          accessor: "target",
        },
        {
          Header: "Indicator",
          accessor: "indicator",
        },
        {
          Header: "Updated Date",
          accessor: "updated_at",
        },
        {
          Header: "Updated By",
          accessor: "updated_by",
        },
        {
          Header: "Location",
          accessor: "location",
        },
      ],
    };
  }

  render() {
    return (
      <Row className="rounded mt-4 ml-2">
        <Card>
          <Table
            columns={this.state.column_list}
            data={this.props.dataEntries}
            dataUpdateFunction={(data) => this.props.updateMyData(data)}
            tableIndex={"dataEntriesTableIndex"}
            noPagination={this.props.dataEntries?.length > 10 ? false : true}
            columnFilter={[
              { name: "Entry Name", dropDown: false },
              { name: "Department", dropDown: true },
              { name: "Goal", dropDown: true },
              { name: "Target", dropDown: true },
              { name: "Indicator", dropDown: true },
              { name: "Updated Date", dropDown: false },
              { name: "Updated By", dropDown: false },
              { name: "Location", dropDown: false },
            ]}
          />
        </Card>
      </Row>
    );
  }
}

TargetTable.propTypes = {};

export default TargetTable;
