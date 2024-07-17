import React, { Component } from "react";
import { Card, Row } from "react-bootstrap";
import Table from "../common/Table";
import { Modal } from "react-bootstrap";
import { Button } from "reactstrap";
import apiAuth from "../../helpers/ApiAuth";
import { NotificationManager } from "../../components/common/react-notifications";
import EditDistrict from "./EditDistrict";

class DistrictTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModel: false,
      column_list: [
        {
          Header: "SNO",
          accessor: (row, rowIndex) => row,
          Cell: ({ cell: { value }, row }) => (
            <>{value ? <p>{row.index + 1}</p> : ""}</>
          ),
        },
        {
          Header: "District Name",
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
      .delete(`/api/district/${data.id}/`)
      .then((res) => {
        setTimeout(() => {
          NotificationManager.success(
            "",
            `District deleted successfully.`,
            3000,
            null,
            null,
            ""
          );
        }, 1000);
        this.setState({ deleteModal: false });
        this.props.getDistricts();
      })
      .catch((error) => {
        console.log(error);
        NotificationManager.error(
          "",
          `District Delete Error`,
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
            columns={this.state.column_list}
            data={this.props.districts}
            dataUpdateFunction={(data) => this.props.updateMyData(data)}
            tableIndex={"districtsTableIndex"}
            noPagination={this.props.districts?.length > 10 ? false : true}
          />
        </Card>
        <Modal
          show={this.state.modal}
          onHide={() => this.setState({ modal: false })}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header>
            <Modal.Title>Edit District</Modal.Title>
            <i
              className="fa fa-close fa-2x cursor-pointer"
              onClick={() => {
                this.setState({ modal: false });
              }}
            />
          </Modal.Header>
          <Modal.Body>
            <EditDistrict
              district={this.state.selectedData}
              closeBack={() => {
                this.setState({ modal: false });
                this.props.getDistricts();
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
            <Modal.Title>Delete District</Modal.Title>
            <i
              className="fa fa-close fa-2x cursor-pointer"
              onClick={() => {
                this.setState({ deleteModal: false });
              }}
            />
          </Modal.Header>
          <Modal.Body>
            <div>District Name - {this.state.selectedDeleteData?.name}</div>
            <div className="mt-2">
              Are you sure you want to delete this district?
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

DistrictTable.propTypes = {};

export default DistrictTable;
