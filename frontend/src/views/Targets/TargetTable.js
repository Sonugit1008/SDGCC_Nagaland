import React, { Component } from "react";
import { Card, Row } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import Table from "../common/Table";
import EditTargetFields from "./EditTargetFields";

class TargetTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      selectedData: null,
      column_list: [
        // {
        //   Header: "District",
        //   accessor: "district_name",
        // },
        {
          Header: "Goal",
          accessor: "goal",
        },
        {
          Header: "Indicator",
          accessor: "name",
        },
        {
          Header: "Indicator Year",
          accessor: data => `${data.year}-${String(Number(data.year) + 1).slice(2, 4)}`,
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
          Header: "Scheme",
          accessor: "scheme",
        },
        {
          Header: "Unit",
          accessor: "unit",
        },
        // {
        //   Header: "Baseline",
        //   accessor: "baseline_value",
        // },
        // {
        //   Header: "Progress",
        //   accessor: "progress_value",
        // },
        // {
        //   Header: "Short-Term Target(2022-23)",
        //   accessor: "short_value",
        // },
        // {
        //   Header: "Mid-Term Target(2025-26)",
        //   accessor: "mid_value",
        // },
        {
          Header: "Target(2030)",
          accessor: "value",
        },
        // {
        //   Header: "Year",
        //   accessor: (row, rowIndex) => row,
        //   Cell: ({ cell: { value }, row }) => (
        //     <>
        //       {value.start_year && value.end_year ? (
        //         <>{`${value.start_year} - ${value.end_year}`}</>
        //       ) : (
        //         <></>
        //       )}
        //     </>
        //   ),
        // },
        {
          Header: "Actions",
          accessor: (row, rowIndex) => row,
          Cell: ({ cell: { value }, row }) => (
            <>
              {value ? (
                <div className="">
                  <i
                    class="fas fa-edit cursor-pointer mr-1"
                    title={"Edit"}
                    onClick={() => {
                      this.setState({ modal: true, selectedData: value });
                    }}
                  ></i>
                </div>
              ) : (
                <></>
              )}
            </>
          ),
        },
      ],
    };
  }

  render() {
    return (
      <>
        <Row className="rounded mt-4 ml-2">
          <Card>
            <Table
              columns={
                this.props.permission?.edit
                  ? this.state.column_list
                  : this.state.column_list.slice(0, -1)
              }
              data={this.props.targets}
              dataUpdateFunction={(data) => this.props.updateMyData(data)}
              tableIndex={"targetsTableIndex"}
              noPagination={this.props.targets?.length > 10 ? false : true}
              // columnFilter={[{ name: "Department Name", dropDown: false }]}
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
            <EditTargetFields
              selectedData={this.state.selectedData}
              districtOptions={this.props.districtOptions}
              closePopup={() => {
                this.props.getTargets();
                this.setState({ modal: false, selectedData: {} });
              }}
            />
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

TargetTable.propTypes = {};

export default TargetTable;
