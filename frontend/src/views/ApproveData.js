/* eslint-disable no-unused-vars */
import React, { Component, Fragment } from "react";
import { Row, Card, Button, CardFooter, Label } from "reactstrap";
import { connect } from "react-redux";
import PageHeader from "../common/PageHeader";
import Table from "../common/Table";
import apiAuth from "../../helpers/ApiAuth";
import { ExportToExcel } from "../common/ExportToExcel";
import { Colxx } from "../../components/common/CustomBootstrap";
import { NotificationManager } from "../../components/common/react-notifications";
import moment from "moment-timezone";
import Select from "react-select";
import { Modal } from "react-bootstrap";

class DataStatus extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: "",
      scoreData: [],
      loading: false,
      indDb: {},
      columns: [
        {
          Header: "Goal Name",
          accessor: "goal",
        },
        {
          Header: "Indicator Name",
          accessor: "indicator",
        },
        {
          Header: "Denominator Value",
          accessor: "denominator_value",
        },
        {
          Header: "Numerator Value",
          accessor: "numerator_value",
        },
        {
          Header: "Vetted By",
          accessor: "vetted_by",
        },
        {
          Header: "Remarks",
          accessor: "remarks",
        },
        {
          Header: "Report Date",
          accessor: "report_date",
        },
        {
          Header: "Status",
          accessor: "status",
          Cell: ({ cell: { value } }) =>
            value ? (
              <>
                {value === "approved" ? (
                  <p
                    className="badge badge-success badge-pill"
                    style={{ width: "80px" }}
                  >
                    Approved
                  </p>
                ) : value === "rejected" ? (
                  <p
                    className="badge badge-danger badge-pill"
                    style={{ width: "80px" }}
                  >
                    Rejected
                  </p>
                ) : (
                  <p
                    className="badge badge-info badge-pill"
                    style={{ width: "80px" }}
                  >
                    Pending
                  </p>
                )}
              </>
            ) : (
              ""
            ),
        },
        {
          Header: "Reject Reason",
          accessor: "reject_reason",
        },
        {
          Header: "Actioned By",
          accessor: "action_by",
        },
        {
          Header: "Actions",
          accessor: (row, rowIndex) => row,
          Cell: ({ cell: { value }, row }) => (
            <>
              {value ? (
                <>
                  {value.status === "pending" ? (
                    <div className="d-flex">
                      {value.editing ? (
                        <div className="d-flex flex-column">
                          <textarea
                            name="reject_reason"
                            className="w-100"
                            onChange={(e) => {
                              let data = this.state.scoreData;
                              data[row.index]["reason"] = e.target.value;

                              this.setState({ scoreData: data });
                            }}
                          />
                          <div
                            className="btn btn-sm btn-danger mt-2"
                            onClick={() => {
                              this.updateData("rejected", value);
                            }}
                          >
                            Reject
                          </div>
                        </div>
                      ) : (
                        <>
                          <div
                            className="btn btn-sm btn-primary"
                            onClick={() => {
                              this.updateData("approved", value);
                            }}
                          >
                            Approve
                          </div>
                          <div
                            className="btn btn-sm btn-danger ml-1"
                            onClick={() => {
                              let data = this.state.scoreData;
                              data[row.index]["editing"] = data[row.index][
                                "editing"
                              ]
                                ? false
                                : true;

                              this.setState({ scoreData: data });
                            }}
                          >
                            Reject
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <></>
                  )}
                </>
              ) : (
                <></>
              )}
            </>
          ),
        },
      ],
      selectedType: {
        label: "All",
        value: "all",
      },
      selectedDataType: {
        label: "State",
        value: "SIF",
      },
    };
  }

  componentDidMount() {
    if (
      this.props.roles?.includes("state_data_creator") ||
      this.props.roles?.includes("state_data_approver")
    ) {
      this.setState(
        {
          selectedDataType: {
            label: "State",
            value: "SIF",
          },
        },
        () => {
          this.getIndicators();
        }
      );
    } else if (
      this.props.roles?.includes("district_data_creator") ||
      this.props.roles?.includes("district_data_approver")
    ) {
      this.setState(
        {
          selectedDataType: {
            label: "District",
            value: "DIF",
          },
        },
        () => {
          this.getIndicators();
        }
      );
    } else {
      this.getIndicators();
    }
  }

  getIndicators = () => {
    let url = "/api/indicator/view/";
    apiAuth
      .get(url)
      .then((response) => {
        let indicators = response.data.filter((ind) => {
          if (this.props.deprtments?.length > 0) {
            return this.props.deprtments.includes(ind.department);
          }

          return true;
        });
        let indDb = {};

        indicators.forEach((ind) => {
          indDb[ind.name] = true;
        });

        this.setState({ indicators: indicators, indDb: indDb }, () => {
          this.getScores();
        });
      })
      .catch(function (error) {
        console.log(error.response?.data);
        console.log(error.response?.status);
        console.log(error.response?.headers);
        NotificationManager.error(
          error.response?.data?.detail,
          `Get Indicator Error ${error.response?.status}`,
          3000,
          null,
          null,
          ""
        );
      });
  };

  getScores = () => {
    this.setState({ scoreData: [], loading: true });
    let url = "/api/newscore/view/?status=pending&type=";

    if (this.state.selectedDataType) {
      url = url + this.state.selectedDataType?.value;
    }

    apiAuth
      .get(url)
      .then((response) => {
        let data = response.data.map((score) => {
          score.reportdate = score.report_date;
          score.report_date = score.report_date
            ? moment(score.report_date).format("DD-MM-YYYY")
            : "";

          return score;
        });

        this.setState({ scoreData: data, loading: false });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  updateData(status, data) {
    apiAuth
      .patch(`/api/newscore/${data.id}/`, {
        status: status,
        reject_reason: data.reason ? data.reason : "",
      })
      .then((response) => {
        NotificationManager.success(
          "",
          `Data ${status} successfully`,
          3000,
          null,
          null,
          ""
        );
        this.setState({ deleteModal: false });
        setTimeout(() => {
          this.getScores();
        }, 300);
      })
      .catch(function (error) {
        NotificationManager.error(
          error?.response?.data?.detail,
          `Data Update Error ${error?.response?.status}`,
          1000,
          null,
          null,
          ""
        );
      });
  }

  render() {
    return (
      <Fragment>
        <PageHeader
          heading={"Approve/Reject Data"}
          history={this.props.history}
          match={this.props.match}
          createNew={() => this.setState({ isShowModel: true })}
          back_button={true}
        ></PageHeader>
        <Row>
          <Colxx lg="12">
            <Card className="my-2">
              <Row className="mt-4 ml-2">
                <Colxx lg="3">
                  <div className="form-group">
                    <Label htmlFor="policy">Select Data Type</Label>

                    <Select
                      options={
                        this.props.roles?.includes("state_data_creator") ||
                        this.props.roles?.includes("state_data_approver")
                          ? [
                              {
                                label: "State",
                                value: "SIF",
                              },
                            ]
                          : this.props.roles?.includes(
                              "district_data_creator"
                            ) ||
                            this.props.roles?.includes("district_data_approver")
                          ? [
                              {
                                label: "District",
                                value: "DIF",
                              },
                            ]
                          : [
                              {
                                label: "State",
                                value: "SIF",
                              },
                              {
                                label: "District",
                                value: "DIF",
                              },
                            ]
                      }
                      defaultValue={this.state.selectedDataType}
                      onChange={(val) => {
                        this.setState({ selectedDataType: val });
                      }}
                    />
                  </div>
                </Colxx>

                <Colxx
                  lg="3"
                  className="d-flex justify-content-around align-items-center p-1"
                >
                  <div>
                    <Button
                      className="btn mt-1"
                      onClick={() => {
                        this.getScores();
                      }}
                    >
                      View
                    </Button>
                  </div>
                  <div>
                    {this.state.scoreData && this.state.scoreData.length > 0 ? (
                      <Fragment>
                        {" "}
                        <ExportToExcel
                          apiData={this.state.scoreData.map((report) => {
                            const {
                              name,
                              goal,
                              indicator,
                              denominator_value,
                              numerator_value,
                              vetted_by,
                              remarks,
                              report_date,
                              status,
                              reject_reason,
                              action_by,
                              action_time,
                            } = report;

                            let returnObj = {
                              Name: name,
                              "Goal Name": goal,
                            };

                            returnObj["Indicator Name"] = indicator;
                            returnObj["Denominator Value"] = denominator_value;
                            returnObj["Numerator Value"] = numerator_value;
                            returnObj["Vetted By"] = vetted_by;
                            returnObj["Remarks"] = remarks;
                            returnObj["Report Date"] = report_date;
                            returnObj["Status"] = status;
                            return returnObj;
                          })}
                          fileName={`ScoresData`}
                        />
                      </Fragment>
                    ) : (
                      <Fragment></Fragment>
                    )}
                  </div>
                </Colxx>
              </Row>
            </Card>
          </Colxx>
        </Row>
        {this.state.scoreData?.length > 0 ? (
          <Fragment>
            <Row mt="4" className="rounded ml-2 d-none d-sm-flex">
              <Fragment>
                {/* <Colxx lg="12"> */}
                <Card className="mt-4">
                  <Table
                    columns={this.state.columns.filter((col) =>
                      this.state.selectedValueType?.value === "goal"
                        ? col.Header !== "Indicator Name"
                        : true
                    )}
                    data={this.state.scoreData}
                    noPagination={
                      this.state.scoreData?.length > 10 ? false : true
                    }
                    // columnFilter={[
                    //   {
                    //     name: "Status",
                    //     dropDown: false,
                    //   },
                    // ]}
                  />
                </Card>
              </Fragment>
            </Row>
            <Modal
              show={this.state.deleteModal}
              onHide={() => this.setState({ deleteModal: false })}
              backdrop="static"
              keyboard={false}
            >
              <Modal.Header>
                <Modal.Title>Delete Data</Modal.Title>
                <i
                  className="fa fa-close fa-2x cursor-pointer"
                  onClick={() => {
                    this.setState({ deleteModal: false });
                  }}
                />
              </Modal.Header>
              <Modal.Body>
                {/* <div>
                  Name - {this.state.selectedDeleteData?.name}
                </div> */}
                <div className="mt-2">
                  Are you sure you want to delete data?
                </div>
              </Modal.Body>
              <Modal.Footer>
                <div className="w-100 d-flex justify-content-between">
                  <Button
                    color="success"
                    onClick={() => {
                      this.deleteData(this.state.selectedDeleteData?.id);
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
          </Fragment>
        ) : this.state.loading ? (
          <p className="loading"></p>
        ) : (
          <p className="ml-2 mt-2">No data available.</p>
        )}
      </Fragment>
    );
  }
}

const mapStateToProps = ({ authUser }) => {
  const { timezone } = authUser;

  return {
    timezone: timezone,
    roles: authUser.roles,
    deprtments: authUser.department,
  };
};

const mapActionsToProps = (dispatch) => {
  return {};
};
export default connect(mapStateToProps, mapActionsToProps)(DataStatus);