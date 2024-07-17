import React, { Component } from "react";
import { Card, Row } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import { Button } from "reactstrap";
import { NotificationManager } from "../../components/common/react-notifications";
import apiAuth from "../../helpers/ApiAuth";
import Table from "../common/Table";
import EditGoal from "./EditGoal";

class GoalsTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModel: false,
      modal: false,
      selectedData: null,
      column_list: [
        {
          Header: "Goal Icon",
          accessor: "image",
          Cell: ({ cell: { value } }) => (
            <>
              {value ? (
                <img
                  alt="Thumbnail"
                  src={value}
                  className="img-thumbnail list-thumbnail align-self-left ml-4"
                ></img>
              ) : (
                <></>
              )}
            </>
          ),
        },
        {
          Header: "SNO",
          accessor: "sno",
          // accessor: (row, rowIndex) => row,
          // Cell: ({ cell: { value }, row }) => (
          //   <>{value ? <>{row.index + 1}</> : <></>}</>
          // ),
        },
        {
          Header: "Goal",
          accessor: "name",
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
      .delete(`/api/goal/delete/${data.id}/`)
      .then((res) => {
        setTimeout(() => {
          NotificationManager.success(
            "Goals",
            `Goal deleted successfully.`,
            3000,
            null,
            null,
            ""
          );
        }, 1000);
        this.setState({ deleteModal: false });
        this.props.getGoals();
      })
      .catch((error) => {
        console.log(error);
        NotificationManager.error(
          "",
          `Goal Delete Error`,
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
                ? this.state.column_list
                : this.state.column_list.slice(0, -1)
            }
            data={this.props.goals}
            dataUpdateFunction={(data) => this.props.updateMyData(data)}
            tableIndex={"goalsTableIndex"}
            noPagination={this.props.goals?.length > 10 ? false : true}
            // columnFilter={[{ name: "Goal", dropDown: false }]}
          />
        </Card>
        <Modal
          show={this.state.modal}
          onHide={() => this.setState({ modal: false })}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header>
            <Modal.Title>Edit Goal</Modal.Title>
            <i
              className="fa fa-close fa-2x cursor-pointer"
              onClick={() => {
                this.setState({ modal: false });
              }}
            />
          </Modal.Header>
          <Modal.Body>
            <EditGoal
              goal={this.state.selectedData}
              closeBack={() => {
                this.setState({ modal: false });
                this.props.getGoals();
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
            <Modal.Title>Delete Goal</Modal.Title>
            <i
              className="fa fa-close fa-2x cursor-pointer"
              onClick={() => {
                this.setState({ deleteModal: false });
              }}
            />
          </Modal.Header>
          <Modal.Body>
            <div>Goal Name - {this.state.selectedDeleteData?.name}</div>
            <div className="mt-2">
              Are you sure you want to delete this goal?
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

GoalsTable.propTypes = {};

export default GoalsTable;
