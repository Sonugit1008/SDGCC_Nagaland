import React, { Component } from "react";
import { Card, Row } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import { Button } from "reactstrap";
import { Colxx } from "../../components/common/CustomBootstrap";
import { NotificationManager } from "../../components/common/react-notifications";
import apiAuth from "../../helpers/ApiAuth";
import Table from "../common/Table";
import EditIndicator from "./EditIndicator";
class GoalTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModel: false,
      column_list: [
        {
          Header: "Goal",
          accessor: "goal",
        },
        {
          Header: "Indicator",
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
          Header: "Scheme",
          accessor: "scheme",
        },
        {
          Header: "Type",
          accessor: "indicator_type",
        },
        {
          Header: "Year",
          accessor: "year",
        },
        {
          Header: "Comment",
          accessor: "comment",
        },
        {
          Header: "Numerator Label",
          accessor: "numerator_label",
        },
        {
          Header: "Denominator Label",
          accessor: "denominator_label",
        },
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
                  <i
                    class="fa fa-trash cursor-pointer ml-1"
                    title={"Delete"}
                    onClick={() => {
                      this.setState({
                        deleteModal: true,
                        selectedDeleteData: value,
                      });
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
    this.deleteData = this.deleteData.bind(this);
  }
  deleteData = (data) => {
    apiAuth
      .delete(`/api/indicator/${data.id}/`)
      .then((res) => {
        setTimeout(() => {
          NotificationManager.success(
            "Indicators",
            `Indicator deleted successfully.`,
            3000,
            null,
            null,
            ""
          );
        }, 1000);
        this.setState({ deleteModal: false });
        this.props.getIndicators();
      })
      .catch((error) => {
        console.log(error);
        NotificationManager.error(
          "",
          `Indicator Delete Error`,
          3000,
          null,
          null,
          ""
        );
      });
  };
  render() {
    return (
      <Row className="rounded mt-4 ml-2">
        <Card>
          <Table
            columns={
              this.props.permission?.write
                ? this.state.column_list.filter((col) =>
                    this.props.selectedType === "DIF" || "SIF"
                      ? true
                      : col.Header !== "Numerator Label" &&
                        col.Header !== "Denominator Label"
                  )
                : this.state.column_list.slice(0, -1)
            }
            data={this.props.indicators}
            dataUpdateFunction={(data) => this.props.updateMyData(data)}
            tableIndex={"indicatorsTableIndex"}
            noPagination={this.props.indicators?.length > 10 ? false : true}
            columnFilter={[
              { name: "Unit", dropDown: false },
              { name: "Scheme", dropDown: false },
              { name: "Goal", dropDown: false },
              { name: "Type", dropDown: false },
              { name: "Year", dropDown: false },
              { name: "Indicator", dropDown: false },
              { name: "Periodicity", dropDown: false },
              { name: "Department", dropDown: false },
              { name: "Comment", dropDown: false },
            ]}
          />
        </Card>
        <Modal
          show={this.state.modal}
          onHide={() => this.setState({ modal: false })}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header>
            <Modal.Title>Edit Indicator</Modal.Title>
            <i
              className="fa fa-close fa-2x cursor-pointer"
              onClick={() => {
                this.setState({ modal: false });
              }}
            />
          </Modal.Header>
          <Modal.Body>
            <Row className="w-100">
              <Colxx lg="12">
                <EditIndicator
                  indicator={this.state.selectedData}
                  closeBack={() => {
                    this.setState({ modal: false });
                    this.props.getIndicators();
                  }}
                />
              </Colxx>
            </Row>
          </Modal.Body>
        </Modal>
        <Modal
          show={this.state.deleteModal}
          onHide={() => this.setState({ deleteModal: false })}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header>
            <Modal.Title>Delete Indicator</Modal.Title>
            <i
              className="fa fa-close fa-2x cursor-pointer"
              onClick={() => {
                this.setState({ deleteModal: false });
              }}
            />
          </Modal.Header>
          <Modal.Body>
            <div>Indicator Name - {this.state.selectedDeleteData?.name}</div>
            <div className="mt-2">
              Are you sure you want to delete this indicator?
            </div>
          </Modal.Body>
          <Modal.Footer>
            <div className="w-100 d-flex justify-content-between">
              <Button
                color="success"
                onClick={() => {
                  this.deleteData(this.state.selectedDeleteData);
                }}
              >
                Yes
              </Button>
              <Button
                color="danger"
                onClick={() => {
                  this.setState({
                    selectedDeleteData: null,
                    deleteModal: false,
                  });
                }}
              >
                No
              </Button>
            </div>
          </Modal.Footer>
        </Modal>
      </Row>
    );
  }
}

GoalTable.propTypes = {};

export default GoalTable;
