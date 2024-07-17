import React, { Component } from "react";
import { Card, Row } from "react-bootstrap";
import { Modal } from "react-bootstrap";

import Table from "../common/Table";
import EditGoalFields from "./EditGoalFields";

class GoalTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      column_list: [
        {
          Header: "Goal",
          accessor: "goal",
        },
        {
          Header: "District Indicator",
          accessor: "name",
        },
        {
          Header: "Periodicity",
          accessor: "periodicity",
        },
        {
          Header: "Department",
          accessor: "department",
        },
        {
          Header: "Unit",
          accessor: "unit",
        },
        {
          Header: "Baseline",
          accessor: "baseline",
        },
        {
          Header: "Progress",
          accessor: "progress",
        },
        {
          Header: "Year",
          accessor: (row, rowIndex) => row,
          Cell: ({ cell: { value }, row }) => (
            <>
              {value.start_year && value.end_year ? (
                <>{`${value.start_year} - ${value.end_year}`}</>
              ) : (
                <></>
              )}
            </>
          ),
        },
        // {
        //   Header: "Actions",
        //   accessor: (row, rowIndex) => row,
        //   Cell: ({ cell: { value }, row }) => (
        //     <>
        //       {value ? (
        //         <div className="">
        //           <i
        //             class="fas fa-edit cursor-pointer mr-1"
        //             title={"Edit"}
        //             onClick={() => {
        //               this.setState({ modal: true, selectedData: value });
        //             }}
        //           ></i>
        //         </div>
        //       ) : (
        //         <></>
        //       )}
        //     </>
        //   ),
        // },
      ],
    };
  }

  render() {
    return (
      <>
        <Row className="rounded mt-4 ml-2">
          <Card>
            <Table
              columns={this.state.column_list}
              data={this.props.goals}
              dataUpdateFunction={(data) => this.props.updateMyData(data)}
              tableIndex={"goalsTableIndex"}
              noPagination={this.props.goals?.length > 10 ? false : true}
              columnFilter={[
                { name: "UID", dropDown: false },
                { name: "Goal", dropDown: false },
                { name: "District Indicator", dropDown: false },
                { name: "Periodicity", dropDown: false },
                { name: "Department", dropDown: false },
              ]}
            />
          </Card>
        </Row>
        <Modal
          show={this.state.modal}
          onHide={() => this.setState({ modal: false })}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header>
            <Modal.Title>Edit</Modal.Title>
            <i
              className="fa fa-close fa-2x cursor-pointer"
              onClick={() => {
                this.setState({ modal: false });
              }}
            />
          </Modal.Header>
          <Modal.Body>
            <EditGoalFields
              selectedData={this.state.selectedData}
              closePopup={() => this.setState({ modal: false })}
            />
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

GoalTable.propTypes = {};

export default GoalTable;
