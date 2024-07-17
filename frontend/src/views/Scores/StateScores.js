import React, { Component, Fragment } from "react";
import PageHeader from "../common/PageHeader";
import { connect } from "react-redux";
import { Button, Card, Label, Row } from "reactstrap";
import { ExportToExcel } from "../common/ExportToExcel";
import { TableExport } from "../common/TableExport";
import apiAuth from "../../helpers/ApiAuth";
import { NotificationManager } from "../../components/common/react-notifications";
import Table from "../common/Table";
import moment from "moment";
import { Modal } from "react-bootstrap";
import { Colxx } from "../../components/common/CustomBootstrap";
import Select from "react-select";
import EditScore from "./EditScore";
class StateScores extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: "",
      scores: [],
      states: [],
      selectedState: {
        label: "Nagaland",
        value: "Nagaland",
      },
      selectedScoreType: {
        label: "Goal Scores",
        value: "Goal",
      },
      column_list: [
        {
          Header: "Goal Name",
          accessor: "goal",
        },
        {
          Header: "Indicator Name",
          accessor: "indicator",
        },
        {
          Header: "Year",
          // accessor: "year",
           accessor: data => `${data.year}-${String(Number(data.year) + 1).slice(2, 4)}`,

        },
        {
          Header: "Score Value",
          accessor: "value",
        },
        {
          Header: "Category",
          accessor: "category",
        },
        {
          Header: "Report Date",
          accessor: "report_date",
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
                    title={"Edit"}
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
    this.getStates = this.getStates.bind(this);
  }

  componentDidMount() {
    this.getScores();
    this.getStates();
  }

  getScores = () => {
    let url = "/api/score/view/?type=SIF";

    if (this.state.selectedState) {
      url = url + "&state=" + this.state.selectedState?.value;
    }
    apiAuth
      .get(url)
      .then((response) => {
        let scores = response.data.map((score) => {
          score.reportdate = score.report_date;
          score.report_date = score.report_date
            ? moment(score.report_date).format("DD-MM-YYYY")
            : "";
          score.value = score.value === "Null" ? "Not available" : score.value;
          return score;
        });

        if (this.state.selectedState?.value === "Nagaland") {
          if (this.state.selectedScoreType?.value === "Indicator") {
            scores = scores.filter((score) => score.indicator);
          } else {
            scores = scores.filter((score) => !score.indicator);
          }
        }
        this.setState({ scores: scores, loading: false });
      })
      .catch(function (error) {
        console.log(error.response?.data);
        console.log(error.response?.status);
        console.log(error.response?.headers);
        NotificationManager.error(
          error.response?.data?.detail,
          `Get Score Error ${error.response?.status}`,
          3000,
          null,
          null,
          ""
        );
      });
  };

  getStates = () => {
    let url = "/api/state/view/";
    apiAuth
      .get(url)
      .then((response) => {
        let states = response.data;

        this.setState({ states: states });
      })
      .catch(function (error) {
        console.log(error.response?.data);
        console.log(error.response?.status);
        console.log(error.response?.headers);
        NotificationManager.error(
          error.response?.data?.detail,
          `Get States Error ${error.response?.status}`,
          3000,
          null,
          null,
          ""
        );
      });
  };

  deleteData = (data) => {
    apiAuth
      .delete(`/api/score/${data.id}/`)
      .then((res) => {
        setTimeout(() => {
          NotificationManager.success(
            "State Score",
            `Data deleted successfully.`,
            3000,
            null,
            null,
            ""
          );
        }, 1000);
        this.setState({ deleteModal: false });
        this.getScores();
      })
      .catch((error) => {
        console.log(error);
        NotificationManager.error(
          "",
          `Data Delete Error`,
          3000,
          null,
          null,
          ""
        );
      });
  };

 
  render() {
    return (
      <Fragment>
        <PageHeader
          heading={"State Scores"}
          is_filter={false}
          filter_func={(text) => this.setState({ filter: text, activePage: 0 })}
          history={this.props.history}
          match={this.props.match}
          back_button={true}
        ></PageHeader>
        <Row className="mt-3">
          <Colxx lg="12">
            <Card>
              <Row>
                <Colxx lg="2">
                  <div className="ml-2">
                    <Select
                      className="my-1"
                      placeholder="Select State..."
                      options={this.state.states.map((dept) => {
                        return {
                          value: dept.name,
                          label: dept.name,
                        };
                      })}
                      value={this.state.selectedState}
                      onChange={(val) => {
                        this.setState({ selectedState: val });
                      }}
                    />
                  </div>
                </Colxx>
                {this.state.selectedState?.value === "Nagaland" ? (
                  <Colxx lg="2">
                    <div className="ml-2">
                      <Select
                        className="my-1"
                        placeholder="Select Score Type..."
                        options={[
                          {
                            value: "Goal",
                            label: "Goal Scores",
                          },
                          {
                            value: "Indicator",
                            label: "Indicator Scores",
                          },
                        ]}
                        value={this.state.selectedScoreType}
                        onChange={(val) => {
                          if (val.value === "Indicator") {
                            this.setState({
                              selectedScoreType: val,
                              column_list: [
                                {
                                  Header: "Goal Name",
                                  accessor: "goal",
                                },
                                {
                                  Header: "Indicator Name",
                                  accessor: "indicator",
                                },
                                {
                                  Header: "Year",
                                  accessor: data => `${data.year}-${String(Number(data.year) + 1).slice(2, 4)}`,
                                },
                                {
                                  Header: "Score Value",
                                  accessor: "value",
                                },
                                {
                                  Header: "Category",
                                  accessor: "category",
                                },
                                {
                                  Header: "Report Date",
                                  accessor: "report_date",
                                },
                                {
                                  Header: "Vetted By",
                                  accessor: "vetted_by",
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
                                  Header: "Remarks",
                                  accessor: "remarks",
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
                                              this.setState({
                                                modal: true,
                                                selectedData: value,
                                              });
                                            }}
                                          ></i>
                                          <i
                                            class="fa fa-trash cursor-pointer ml-1"
                                            title={"Edit"}
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
                            });
                          } else {
                            this.setState({
                              selectedScoreType: val,
                              column_list: [
                                {
                                  Header: "Goal Name",
                                  accessor: "goal",
                                },
                                {
                                  Header: "Indicator Name",
                                  accessor: "indicator",
                                },
                                {
                                  Header: "Year",
                                  accessor: data => `${data.year}-${String(Number(data.year) + 1).slice(2, 4)}`,
                                },
                                {
                                  Header: "Score Value",
                                  accessor: "value",
                                },
                                {
                                  Header: "Category",
                                  accessor: "category",
                                },
                                {
                                  Header: "Report Date",
                                  accessor: "report_date",
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
                                              this.setState({
                                                modal: true,
                                                selectedData: value,
                                              });
                                            }}
                                          ></i>
                                          <i
                                            class="fa fa-trash cursor-pointer ml-1"
                                            title={"Edit"}
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
                            });
                          }
                        }}
                      />
                    </div>
                  </Colxx>
                ) : (
                  <></>
                )}
                <Colxx lg="2" className="mb-1">
                  <Button
                    className="btn mt-1"
                    onClick={() => {
                      this.setState({ scores: [], loading: true });
                      this.getScores();
                    }}
                  >
                    View
                  </Button>
                  {/* {this.state.scores.length ? (
                    <ExportToExcel
                      apiData={this.state.scores.map((data) => {
                        const {
                          name,
                          indicator,
                          goal,
                          value,
                          year,
                          vetted_by,
                          report_date,
                          remarks,
                          category,
                          department,
                          scheme,
                        } = data;
                        return this.state.selectedScoreType?.value ===
                          "Indicator" &&
                          this.state.selectedState?.value === "Nagaland"
                          ? {
                              "State Name": name,
                              "Goal Name": goal,
                              "Indicator Name": indicator,
                              Year: year,
                              "Score Value": value,
                              Category: category,
                              "Report Date": report_date,
                              "Vetted By": vetted_by,
                              Remarks: remarks,
                              Department: department,
                              Scheme: scheme,
                            }
                          : {
                              "State Name": name,
                              "Goal Name": goal,
                              Year: year,
                              "Score Value": value,
                              Category: category,
                              "Report Date": report_date,
                              "Vetted By": vetted_by,
                              Remarks: remarks,
                            };
                      })}
                      fileName={`${this.state.selectedState?.value} - ScoresData`}
                    />
                  ) : (
                    <></>
                  )} */}
                  </Colxx>
                  <Colxx lg="2" className=" mb-2">
                  <TableExport  fileName={"StateScoresData"} />
                  </Colxx>
                                  
              </Row>
            </Card>
          </Colxx>
        </Row>
        {this.state.scores.length ? (
          <Fragment>
            <Row className="rounded mt-4 ml-2">
              <Card>
                <Table
                  columns={
                    this.state.selectedScoreType?.value === "Indicator"
                      ? this.state.column_list
                      : this.state.column_list.filter(
                          (opt) => opt.Header !== "Indicator Name"
                        )
                  }
                  data={this.state.scores}
                  dataUpdateFunction={(data) => this.props.updateMyData(data)}
                  tableIndex={"scoreTableIndex"}
                  noPagination={this.state.units?.length > 10 ? false : true}
                  columnFilter={[
                    { name: "Indicator Name", dropDown: false },
                    { name: "Goal Name", dropDown: false },
                    { name: "Year", dropDown: false },
                    { name: "Score Value", dropDown: false },
                    { name: "Report Date", dropDown: false },
                    { name: "Vetted By", dropDown: false },
                    { name: "Remarks", dropDown: false },
                    { name: "Category", dropDown: false },
                    { name: "Department", dropDown: false },
                    { name: "Scheme", dropDown: false },
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
                <Modal.Title>Edit State Score</Modal.Title>
                <i
                  className="fa fa-close fa-2x cursor-pointer"
                  onClick={() => {
                    this.setState({ modal: false });
                  }}
                />
              </Modal.Header>
              <Modal.Body>
                <EditScore
                  report={this.state.selectedData}
                  closeBack={() => {
                    this.setState({ modal: false });
                    this.getScores();
                  }}
                  timezone={this.props.timezone}
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
                <Modal.Title>Delete State Score</Modal.Title>
                <i
                  className="fa fa-close fa-2x cursor-pointer"
                  onClick={() => {
                    this.setState({ deleteModal: false });
                  }}
                />
              </Modal.Header>
              <Modal.Body>
                <div>State Name - {this.state.selectedDeleteData?.name}</div>
                <div>Goal Name - {this.state.selectedDeleteData?.goal}</div>
                <div>Score Value - {this.state.selectedDeleteData?.value}</div>
                <div className="mt-2">
                  Are you sure you want to delete this data?
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
          </Fragment>
        ) : (
          <Fragment>
            {this.state.loading ? (
              <div className="loading"></div>
            ) : (
              <div className="mt-2">No data available.</div>
            )}
          </Fragment>
        )}
      </Fragment>
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
    timezone,
    permission: flag,
  };
};

const mapActionsToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapActionsToProps)(StateScores);
