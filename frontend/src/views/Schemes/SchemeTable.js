import React, { Component } from "react";
import { Card, Row } from "react-bootstrap";
import { NotificationManager } from "../../components/common/react-notifications";
import apiAuth from "../../helpers/ApiAuth";
// import { Link } from "react-router-dom";
import Table from "../common/Table";
import { Modal } from "react-bootstrap";
import { Button } from "reactstrap";
import EditScheme from "./EditScheme";

class SchemeTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModel: false,
      column_list: [
        {
          Header: "Scheme Name",
          accessor: "name",
        },
        {
          Header: "Scheme Description",
          accessor: "description",
        },
        {
          Header: "Scheme Comment",
          accessor: "scheme_comment",
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
      .delete(`/api/scheme/${data.id}/`)
      .then((res) => {
        setTimeout(() => {
          NotificationManager.success(
            "",
            `Scheme deleted successfully.`,
            3000,
            null,
            null,
            ""
          );
        }, 1000);
        this.setState({ deleteModal: false });
        this.props.getSchemes();
      })
      .catch((error) => {
        console.log(error);
        NotificationManager.error(
          "",
          `Scheme Delete Error`,
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
            data={this.props.schemes}
            dataUpdateFunction={(data) => this.props.updateMyData(data)}
            tableIndex={"schemesTableIndex"}
            noPagination={this.props.schemes?.length > 10 ? false : true}
            columnFilter={[
              { name: "Scheme Name", dropDown: false },
              { name: "Scheme Comment", dropDown: false },
              { name: "Scheme Description", dropDown: false },
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
            <Modal.Title>Edit Scheme</Modal.Title>
            <i
              className="fa fa-close fa-2x cursor-pointer"
              onClick={() => {
                this.setState({ modal: false });
              }}
            />
          </Modal.Header>
          <Modal.Body>
            <EditScheme
              scheme={this.state.selectedData}
              closeBack={() => {
                this.setState({ modal: false });
                this.props.getSchemes();
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
            <Modal.Title>Delete Scheme</Modal.Title>
            <i
              className="fa fa-close fa-2x cursor-pointer"
              onClick={() => {
                this.setState({ deleteModal: false });
              }}
            />
          </Modal.Header>
          <Modal.Body>
            <div>Scheme Name - {this.state.selectedDeleteData?.name}</div>
            <div className="mt-2">
              Are you sure you want to delete this scheme?
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

SchemeTable.propTypes = {};

export default SchemeTable;
