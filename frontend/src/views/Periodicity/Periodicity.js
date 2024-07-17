import React, { Component } from "react";
import { connect } from "react-redux";
import PageHeader from "../common/PageHeader";
import CardBodyCell from "../common/CardBodyCell";
import { Button, Row } from "reactstrap";
import { Colxx } from "../../components/common/CustomBootstrap";
import { NotificationManager } from "../../components/common/react-notifications";
import apiAuth from "../../helpers/ApiAuth";
import { Modal } from "react-bootstrap";
import EditPeriodicity from "./EditPeriodicity";

class Periodicity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      periodicity: [],
    };
  }

  componentDidMount() {
    this.getPeriodicity();
  }

  getPeriodicity() {
    let url = "/api/periodicity/";
    apiAuth
      .get(url)
      .then((response) => {
        let periodicity = response.data;

        this.setState({ periodicity: periodicity });
      })
      .catch(function (error) {
        console.log(error.response?.data);
        console.log(error.response?.status);
        console.log(error.response?.headers);
        NotificationManager.error(
          error.response?.data?.detail,
          `Get Error ${error.response?.status}`,
          3000,
          null,
          null,
          ""
        );
      });
  }

  deleteData = (data) => {
    apiAuth
      .delete(`/api/periodicity/${data.id}/`)
      .then((res) => {
        setTimeout(() => {
          NotificationManager.success(
            "",
            `Periodicity deleted successfully.`,
            3000,
            null,
            null,
            ""
          );
        }, 1000);
        this.setState({ deleteModal: false });
        this.getPeriodicity();
      })
      .catch((error) => {
        console.log(error);
        NotificationManager.error(
          "",
          `Periodicity Delete Error`,
          3000,
          null,
          null,
          ""
        );
      });
  };

  render() {
    return (
      <>
        <PageHeader
          heading={"Periodicity"}
          is_filter={false}
          filter_func={(text) => this.setState({ filter: text })}
          history={this.props.history}
          match={this.props.match}
          add_new={this.props.permission?.write}
          add_new_url={"/app/periodicity/add"}
          back_button={false}
          displaySelector={false}
          changeDisplay={(val) => {
            this.setState({ display: val });
          }}
        ></PageHeader>
        <Row>
          {this.state.periodicity.map((data) => {
            return (
              <Colxx lg="2">
                <CardBodyCell
                  className={"iconsminds-timer"}
                  name={data.name}
                  value={data.no_of_days ? data.no_of_days : "0"}
                  periodicity={true}
                  editPeriodicity={() => {
                    this.setState({ modal: true, selectedData: data });
                  }}
                  deletePeriodicity={() => {
                    this.setState({
                      deleteModal: true,
                      selectedDeleteData: data,
                    });
                  }}
                />
              </Colxx>
            );
          })}
        </Row>
        <Modal
          show={this.state.modal}
          onHide={() => this.setState({ modal: false })}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header>
            <Modal.Title>Edit Periodicity</Modal.Title>
            <i
              className="fa fa-close fa-2x cursor-pointer"
              onClick={() => {
                this.setState({ modal: false });
              }}
            />
          </Modal.Header>
          <Modal.Body>
            <EditPeriodicity
              periodicity={this.state.selectedData}
              closeBack={() => {
                this.setState({ modal: false });
                this.getPeriodicity();
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
            <Modal.Title>Delete Periodicity</Modal.Title>
            <i
              className="fa fa-close fa-2x cursor-pointer"
              onClick={() => {
                this.setState({ deleteModal: false });
              }}
            />
          </Modal.Header>
          <Modal.Body>
            <div>Periodicity Name - {this.state.selectedDeleteData?.name}</div>
            <div className="mt-2">
              Are you sure you want to delete this Periodicity?
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
      </>
    );
  }
}

const mapStateToProps = ({ authUser }) => {
  const { timezone } = authUser;

  let flag = {
    write: false,
    edit: false,
  };
  authUser.roles.forEach((role) => {
    if (role === "system_administrator" || role === "superadmin") {
      flag.write = true;
      flag.edit = true;
    }
  });
  return {
    timezone: timezone,
    permission: flag,
  };
};

const mapActionsToProps = (dispatch) => {
  return {};
};
export default connect(mapStateToProps, mapActionsToProps)(Periodicity);
