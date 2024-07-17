import React, { Component } from "react";
import { Card, Row } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import { Button } from "reactstrap";
import { NotificationManager } from "../../components/common/react-notifications";
import apiAuth from "../../helpers/ApiAuth";
import Table from "../common/Table";
import EditDepartment from "./EditDepartment";

class DepartmentTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModel: false,
      column_list: [
        {
          Header: "Department Name",
          accessor: "name",
        },
        {
          Header: "State",
          accessor: "state",
        },
        {
          Header: "Total Users",
          accessor: "users",
        },
        {
          Header: "Total Goals",
          accessor: "goals",
        },
        {
          Header: "Total Indicators",
          accessor: "indicators",
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
      .delete(`/api/department/${data.id}/`)
      .then((res) => {
        setTimeout(() => {
          NotificationManager.success(
            "",
            `Department deleted successfully.`,
            3000,
            null,
            null,
            ""
          );
        }, 1000);
        this.setState({ deleteModal: false });
        this.props.getDepartments();
      })
      .catch((error) => {
        console.log(error);
        NotificationManager.error(
          "",
          `Department Delete Error`,
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
          {this.props.departments?.length > 0 ? (
            <Table
              columns={this.state.column_list}
              data={this.props.departments}
              dataUpdateFunction={(data) => this.props.updateMyData(data)}
              tableIndex={"departmentsTableIndex"}
              noPagination={this.props.departments?.length > 10 ? false : true}
              // columnFilter={[{ name: "Department Name", dropDown: false }]}
            />
          ) : (
            <></>
          )}
        </Card>
        <Modal
          show={this.state.modal}
          onHide={() => this.setState({ modal: false })}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header>
            <Modal.Title>Edit Department</Modal.Title>
            <i
              className="fa fa-close fa-2x cursor-pointer"
              onClick={() => {
                this.setState({ modal: false });
              }}
            />
          </Modal.Header>
          <Modal.Body>
            <EditDepartment
              department={this.state.selectedData}
              closeBack={() => {
                this.setState({ modal: false });
                this.props.getDepartments();
              }}
            />
          </Modal.Body>
        </Modal>
        <Modal
          show={this.state.deleteModal}
          onHide={() => this.setState({ deleteModal: false })}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header>
            <Modal.Title>Delete Department</Modal.Title>
            <i
              className="fa fa-close fa-2x cursor-pointer"
              onClick={() => {
                this.setState({ deleteModal: false });
              }}
            />
          </Modal.Header>
          <Modal.Body>
            <div>Department Name - {this.state.selectedDeleteData?.name}</div>
            <div className="mt-2">
              Are you sure you want to delete this department?
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

DepartmentTable.propTypes = {};

export default DepartmentTable;
