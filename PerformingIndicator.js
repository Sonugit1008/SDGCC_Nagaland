import React, { Component, Fragment } from "react";
import PageHeader from "../common/PageHeader";
import { connect } from "react-redux";
import { Button, Card, CardBody, Label, Row } from "reactstrap";
import { Colxx } from "../../components/common/CustomBootstrap";
import Select from "react-select";
import apiAuth from "../../helpers/ApiAuth";
import { NotificationManager } from "../../components/common/react-notifications";
import _ from "lodash";
import Table from "../common/Table";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  BarController,
  Legend,
  Tooltip,
  registerables as registerablesJS,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import { ExportToExcel } from "../common/ExportToExcel";
import JsPDF from "jspdf";
import autoTable from "jspdf-autotable";
ChartJS.register(...registerablesJS);
ChartJS.register(ChartDataLabels);
ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  BarController,
  Legend,
  Tooltip
);

class PerformingIndicator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: "",
      reports: [],
      goals: [],
      departments: [],
      selectedDept: {
        label: "All Departments",
        value: "All Departments",
      },
      years: [],
      // selectedGoal: {
      //   label: "SDG Index",
      //   value: "SDG Index",
      // },
      selectedGoal: {
        label: "All Goals",
        value: "All Goals",
      },
      selectedYear: {
        label: new Date().getFullYear() + "-" + (new Date().getFullYear() + 1).toString().substr(-2),
        value: new Date().getFullYear(),
      },
      selectedType: {
        label: "All",
        value: "All",
      },
      selectedCutoff: null,
      column_list: [
        {
          Header: "Name",
          accessor: "name",
        },
        {
          Header: "Goal",
          accessor: "goal",
        },
        {
          Header: "Indicator Year",
          accessor: data => `${data.year}-${String(Number(data.year) + 1).slice(2, 4)}`,
        },
        {
          Header: "Indicator",
          accessor: "indicator",
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
          Header: "Score",
          accessor: "value",
        },
        {
          Header: "Target",
          accessor: "target",
        },
      ],
    };
  }

  componentDidMount() {
    this.viewGoalsData();
    this.getGoals();
    this.getDepartments();
  }

  getDepartments = () => {
    apiAuth
      .get("/api/department/")
      .then((response) => {
        let departments = response.data
          .filter((dd) =>
            this.props.department?.length > 0
              ? this.props.department?.includes(dd.name)
              : true
          )
          .map((dept) => {
            return dept.name;
          });

        departments.unshift("All Departments");
        this.setState({ departments });
      })
      .catch(function (error) {
        console.log(error.response?.data);
        console.log(error.response?.status);
        console.log(error.response?.headers);
        NotificationManager.error(
          error.response?.data?.detail,
          `Get Departments Error ${error.response?.status}`,
          3000,
          null,
          null,
          ""
        );
      });
  };

  getGoals = () => {
    this.setState({ loadingData: true });
    apiAuth
      .get("/api/goal/")
      .then((response) => {
        let goals = response.data.map((goal) => {
          return goal.name;
        });
        goals.unshift("All Goals");
        this.setState({ goals: goals });
      })
      .catch(function (error) {
        console.log(error.response?.data);
        console.log(error.response?.status);
        console.log(error.response?.headers);
        NotificationManager.error(
          error.response?.data?.detail,
          `Get Goals Error ${error.response?.status}`,
          3000,
          null,
          null,
          ""
        );
      });
  };

  viewGoalsData = () => {
    this.setState({ loading: true });
    apiAuth
      .get("/api/goalvalue/")
      .then((response) => {
        let targetsDIF = response.data
          .filter((data) => data.type === "DIF")
          .map((data) => {
            data["indicatorvalue"] =
              data.indicatorvalue?.length > 0
                ? { ...data.indicatorvalue[0] }
                : {};
            data["indicator_id"] = data.indicatorvalue?.id;
            data["value"] = data.indicatorvalue?.value;
            return data;
          })
          .filter((dt) => Number(dt.value) >= 0);

        let goal_dif_target = _.groupBy(targetsDIF, "goal");

        let historyTargetsDIF = {};

        Object.keys(goal_dif_target).forEach((goal) => {
          if (!historyTargetsDIF[goal]) {
            historyTargetsDIF[goal] = {};
          }
          let dif_indicator_history = _.groupBy(goal_dif_target[goal], "name");

          Object.keys(dif_indicator_history).forEach((ind) => {
            if (dif_indicator_history[ind]) {
              let dif_years_indicator = _.groupBy(
                dif_indicator_history[ind],
                "year"
              );
              historyTargetsDIF[goal][ind] = {};
              Object.keys(dif_years_indicator).forEach((year) => {
                historyTargetsDIF[goal][ind][year] =
                  dif_years_indicator[year][0]?.value;
              });
            }
          });
        });

        // Targets for SIFs

        let targetsSIF = response.data
          .filter((data) => data.type === "SIF")
          .map((data) => {
            data["indicatorvalue"] =
              data.indicatorvalue?.length > 0
                ? { ...data.indicatorvalue[0] }
                : {};
            data["indicator_id"] = data.indicatorvalue?.id;
            data["value"] = data.indicatorvalue?.value;
            return data;
          })
          .filter((dt) => Number(dt.value) >= 0);

        let goal_sif_target = _.groupBy(targetsSIF, "goal");

        let historyTargetsSIF = {};

        Object.keys(goal_sif_target).forEach((goal) => {
          if (!historyTargetsSIF[goal]) {
            historyTargetsSIF[goal] = {};
          }
          let sif_indicator_history = _.groupBy(goal_sif_target[goal], "name");

          Object.keys(sif_indicator_history).forEach((ind) => {
            if (sif_indicator_history[ind]) {
              let sif_years_indicator = _.groupBy(
                sif_indicator_history[ind],
                "year"
              );
              historyTargetsSIF[goal][ind] = {};
              Object.keys(sif_years_indicator).forEach((year) => {
                historyTargetsSIF[goal][ind][year] =
                  sif_years_indicator[year][0]?.value;
              });
            }
          });
        });

        this.setState(
          {
            targetDIFReports: targetsDIF,
            targetSIFReports: targetsSIF,
            historyTargetsDIF: historyTargetsDIF,
            historyTargetsSIF: historyTargetsSIF,
            loading: false,
          },
          () => {
            this.viewDIFScore();
          }
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  viewDIFScore = () => {
    this.setState({ loadingData: true, reports: [], graphData: null });
    apiAuth
      .get(
        `/api/public/score/?type=${
          this.state.selectedType?.value === "DIF"
            ? "DIF"
            : this.state.selectedType?.value === "SIF"
            ? "SIF"
            : ""
        }`
      )
      .then((res) => {
        let data = [];
        if (this.state.selectedGoal?.label === "All Goals") {
          data = res.data.filter(
            (sc) =>
              // sc.goal === this.state.selectedGoal?.label &&
              String(sc.year) === String(this.state.selectedYear?.value) &&
              sc.indicator &&
              sc.value !== "Null"
          );
        } else {
          data = res.data.filter(
            (sc) =>
              sc.goal === this.state.selectedGoal?.label &&
              String(sc.year) === String(this.state.selectedYear?.value) &&
              sc.indicator &&
              sc.value !== "Null"
          );
        }

        // .filter((dd) =>
        //   !this.state.selectedCutoff?.value
        //     ? true
        //     : Number(dd.value ? dd.value : 0).toFixed(0) <=
        //       this.state.selectedCutoff?.value
        // );

        data = data
          .map((dt) => {
            if (dt.type === "DIF")
              dt.target = this.state.historyTargetsDIF[dt.goal]
                ? this.state.historyTargetsDIF[dt.goal][dt.indicator]
                  ? this.state.historyTargetsDIF[dt.goal][dt.indicator][dt.year]
                    ? this.state.historyTargetsDIF[dt.goal][dt.indicator][
                        dt.year
                      ]
                    : null
                  : null
                : null;

            if (dt.type === "SIF")
              dt.target = this.state.historyTargetsSIF[dt.goal]
                ? this.state.historyTargetsSIF[dt.goal][dt.indicator]
                  ? this.state.historyTargetsSIF[dt.goal][dt.indicator][dt.year]
                    ? this.state.historyTargetsSIF[dt.goal][dt.indicator][
                        dt.year
                      ]
                    : null
                  : null
                : null;
            return dt;
          })
          .filter((dt) => dt.target);

        let years = res.data
          .filter((sc) => sc.indicator && sc.value !== "Null")
          .filter((dd) =>
            this.props.department?.length > 0
              ? this.props.department?.includes(dd.department)
              : true
          )
          .map((sc) => sc.year);

        years = _.sortBy(_.unionBy(years));

        data = data
          .map((dt) => {
            dt.diff = Math.abs(Number(dt.target) - Number(dt.value));
            return dt;
          })
          .filter((dd) =>
            this.props.department?.length > 0
              ? this.props.department?.includes(dd.department)
              : true
          );

        if (this.state.selectedDept?.label !== "All Departments")
          data = data.filter(
            (dt) => dt.department === this.state.selectedDept.label
          );

        data = _.sortBy(data, "diff").slice(0, 3);

        let colors = data.map((rp) => {
          let obj = rp?.value ? Number(rp?.value).toFixed(0) : 0;

          switch (true) {
            case obj <= 49:
              return "#DC3545";
            case obj <= 64:
              return "#FFC107";
            case obj <= 99:
              return "#28A745";
            case obj >= 100:
              return "blue";
          }
          return "rgb(197, 25, 45)";
        });

        let graphData = {
          labels: data.map((rp) => rp.indicator),
          datasets: [
            {
              type: "bar",
              label: `Top 5 performing indicators for Goal: ${this.state.selectedGoal?.label}`,
              backgroundColor: colors,
              data: data.map((rp) => rp.value),
              borderColor: "white",
              borderWidth: 2,
              barPercentage: 0.4,
            },
          ],
        };
        this.setState({
          reports: data,
          graphData,
          loadingData: false,
          years,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getRpeotPDf = () => {
    // const report = new JsPDF("portrait", "pt", "a4");
    // report.html(document.querySelector("#reporttable")).then(() => {
    //   report.save("report.pdf");
    // });

    const doc = new JsPDF();
    doc.autoTable({ html: "#my-table" });
    autoTable(doc, {
      theme: "grid",
      body: this.state.reports,
      columns: this.state.column_list.map((col) => {
        return { header: col.Header, dataKey: col.accessor };
      }),
    });

    doc.save("TopIndicatorReport.pdf");
  };

  render() {
    return (
      <Fragment>
        <PageHeader
          heading={"Top Indicators"}
          is_filter={true}
          filter_func={(text) => this.setState({ filter: text, activePage: 0 })}
          history={this.props.history}
          match={this.props.match}
          back_button={true}
          changeDisplay={(val) => {
            this.setState({ display: val });
          }}
        ></PageHeader>
        {this.state.loading ? (
          <></>
        ) : (
          <>
            <Row className="mt-4 ml-2">
              <Colxx lg="2">
                <div className="form-group">
                  <Label htmlFor="policy">Select Goal</Label>

                  <Select
                    options={this.state.goals.map((goal) => {
                      return {
                        label: goal,
                        value: goal,
                      };
                    })}
                    defaultValue={this.state.selectedGoal}
                    onChange={(val) => {
                      this.setState({ selectedGoal: val });
                    }}
                  />
                </div>
              </Colxx>
              
              <Colxx lg="2">
                <div className="form-group">
                  <Label htmlFor="policy">Select Type</Label>

                  <Select
                    options={[
                      {
                        label: "All",
                        value: "All",
                      },
                      {
                        label: "District",
                        value: "DIF",
                      },
                      {
                        label: "State",
                        value: "SIF",
                      },
                    ]}
                    defaultValue={this.state.selectedType}
                    onChange={(val) => {
                      this.setState({ selectedType: val });
                    }}
                  />
                </div>
              </Colxx>
              <Colxx lg="2">
                <div className="form-group">
                  <Label htmlFor="policy">Select Year</Label>
                  <Select
                    options={
                      this.state.selectedType.value === 'DIF'
                        ? this.state.years
                          ? this.state.years.filter(year => year >= 2021).sort((a, b) => b - a).map((year) => {
                              return {
                                label: `${year}-${String(Number(year) + 1).slice(2, 4)}`,
                                value: year,
                              };
                            })
                          : []
                        : this.state.selectedType.value === 'SIF' ||this.state.selectedType.value === 'All'
                        ? this.state.years
                          ? this.state.years.sort((a, b) => b - a).map((year) => {
                              return {
                                label: `${year}-${String(Number(year) + 1).slice(2, 4)}`,
                                value: year,
                              };
                            })
                          : []
                        : []
                    }
                    value={this.state.selectedYear}
                    onChange={(data) => {
                      this.setState({ selectedYear: data });
                    }}
                  />
                </div>
              </Colxx>
              <Colxx lg="2">
                <div className="form-group">
                  <Label htmlFor="policy">Select Department</Label>

                  <Select
                    options={this.state.departments.map((dept) => {
                      return {
                        label: dept,
                        value: dept,
                      };
                    })}
                    defaultValue={this.state.selectedDept}
                    onChange={(val) => {
                      this.setState({ selectedDept: val });
                    }}
                  />
                </div>
              </Colxx>
              {/* <Colxx lg="2">
            <div className="form-group">
              <Label htmlFor="policy">Select Cutoff</Label>

              <Select
                options={Array.from(Array(101), (e, i) => {
                  return {
                    label: i,
                    value: i,
                  };
                })}
                defaultValue={this.state.selectedCutoff}
                onChange={(val) => {
                  this.setState({ selectedCutoff: val });
                }}
              />
            </div>
          </Colxx> */}
              <Colxx lg="1">
                <div className="d-flex flex-column h-100 justify-content-center">
                  <Label htmlFor="policy"></Label>
                  <Button
                    color="success"
                    className="w-100"
                    onClick={() => {
                      this.viewDIFScore();
                    }}
                  >
                    View
                  </Button>
                </div>
              </Colxx>
              {this.state.reports.length ? (
                <>
                  <Colxx lg="1" className="pt-3">
                    <ExportToExcel
                      apiData={this.state.reports.map((data) => {
                        const {
                          name,
                          indicator,
                          goal,
                          year,
                          value,
                          target,
                          department,
                          scheme,
                        } = data;
                        return {
                          Name: name,
                          "Goal Name": goal,
                          "Indicator Year":year,
                          "Indicator Name": indicator,
                          Department: department,
                          Scheme: scheme,
                          "Score Value": value,
                          "Target Value": target,
                        };
                      })}
                      fileName={`GoalTopIndicatorReport`}
                    />
                  </Colxx>
                  <Colxx lg="1" className="pt-3">
                    <Button
                      onClick={() => {
                        this.getRpeotPDf();
                      }}
                      className="ml-1 mt-2"
                      color="primary"
                    >
                      Download As PDF
                    </Button>
                  </Colxx>
                </>
              ) : (
                <></>
              )}
            </Row>
            {this.state.reports?.length > 0 && this.state.graphData ? (
              <>
                {/* <Row>
              <Colxx lg="12" className="mb-4 mt-4">
                <Card>
                  <CardBody>
                    <h2>
                      <span className="ml-3 mt-3"></span>
                    </h2>

                    <Chart
                      height={90}
                      data={this.state.graphData}
                      options={{
                        plugins: {
                          datalabels: {
                            anchor: "end",
                            align: "top",
                            formatter: Math.round,
                            font: {
                              weight: "bold",
                            },
                          },
                        },
                      }}
                    />
                    <Row className="mt-2 d-flex justify-content-center">
                      <Colxx lg="10" className="d-flex justify-content-around">
                        <div className="d-flex justify-content-center align-items-center">
                          <i
                            className="fa fa-circle text-info"
                            aria-hidden="true"
                          ></i>
                          <span className="ml-1">Achiever [100]</span>
                        </div>
                        <div className="d-flex justify-content-center align-items-center ml-2">
                          <i
                            className="fa fa-circle text-success"
                            aria-hidden="true"
                          ></i>
                          <span className="ml-1">Front Runner [65 - 99]</span>
                        </div>
                        <div className="d-flex justify-content-center align-items-center ml-2">
                          <i
                            className="fa fa-circle text-warning"
                            aria-hidden="true"
                          ></i>
                          <span className="ml-1">Performer [50 - 64]</span>
                        </div>
                        <div className="d-flex justify-content-center align-items-center ml-2">
                          <i
                            className="fa fa-circle text-danger"
                            aria-hidden="true"
                          ></i>
                          <span className="ml-1">Aspirant [0 - 49]</span>
                        </div>
                      </Colxx>
                    </Row>
                  </CardBody>
                </Card>
              </Colxx>
            </Row> */}
                {this.state.reports.length ? (
                  <Fragment>
                    <Row className="rounded mt-4 ml-2">
                      <Card>
                        <Table
                          columns={this.state.column_list}
                          data={this.state.reports}
                          dataUpdateFunction={(data) =>
                            this.props.updateMyData(data)
                          }
                          tableIndex={"deptSchemeTableIndex"}
                          noPagination={
                            this.state.reports?.length > 10 ? false : true
                          }
                          // columnFilter={[
                          //   { name: "Scheme", dropDown: false },
                          //   { name: "Indicator", dropDown: false },
                          //   { name: "Department", dropDown: false },
                          // ]}
                        />
                      </Card>
                    </Row>
                  </Fragment>
                ) : (
                  <Fragment>
                    <div className=""></div>
                  </Fragment>
                )}
              </>
            ) : (
              <>
                {this.state.loadingData ? (
                  <div className="loading"></div>
                ) : (
                  <div className="ml-4 mt-1">No data available.</div>
                )}
              </>
            )}
          </>
        )}
      </Fragment>
    );
  }
}

const mapStateToProps = ({ authUser }) => {
  const { timezone, department } = authUser;
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
    department,
  };
};

const mapActionsToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapActionsToProps)(PerformingIndicator);
