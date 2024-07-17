import React, { Component, Fragment } from "react";
import PageHeader from "../common/PageHeader";
import { connect } from "react-redux";
import { Card, CardBody, Label, Row } from "reactstrap";
import { Colxx } from "../../components/common/CustomBootstrap";
import Select from "react-select";
import apiAuth from "../../helpers/ApiAuth";
import { NotificationManager } from "../../components/common/react-notifications";
import _ from "lodash";
import Table from "../common/Table";
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
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Button } from "react-bootstrap";
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

class PerformingDistricts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: "",
      reports: [],
      goals: [],
      years: [],
      departments: [],
      selectedGoal: {
        label: "SDG Index",
        value: "SDG Index",
      },
      selectedYear: {
        label: new Date().getFullYear() + "-" + (new Date().getFullYear() + 1).toString().substr(-2),
        value: new Date().getFullYear(),
      },
      column_list: [
        {
          Header: "District",
          accessor: "name",
        },
        {
          Header: "Score",
          accessor: "value",
        },
      ],
    };
  }

  componentDidMount() {
    this.viewDIFScore();
    this.getGoals();
  }

  getGoals = () => {
    apiAuth
      .get("/api/goal/")
      .then((response) => {
        let goals = response.data.map((goal) => {
          return goal.name;
        });
        this.setState({ goals });
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

  viewDIFScore = () => {
    this.setState({ loadingData: true, reports: [], graphData: null });
    apiAuth
      .get("/api/public/score/?type=DIF")
      .then((res) => {
        let res_data = res.data.filter((dd) =>
          this.props.department?.length > 0
            ? this.props.department?.includes(dd.department)
            : true
        );

        let data = res_data.filter(
          (sc) =>
            sc.goal === this.state.selectedGoal?.label &&
            String(sc.year) === String(this.state.selectedYear?.value) &&
            !sc.indicator &&
            sc.value !== "Null"
        );
        let years = res_data
          .filter((sc) => !sc.indicator && sc.value !== "Null")
          .map((sc) => sc.year);

        years = _.sortBy(_.unionBy(years));

        data = _.sortBy(data, "value").reverse().slice(0, 5);

        let colors = data.map((rp) => {
          let obj = rp?.value ? Number(rp?.value) : 0;

          switch (true) {
            case obj < 50:
              return "#DC3545";
            case obj < 65:
              return "#FFC107";
            case obj < 100:
              return "#28A745";
            case obj >= 100:
              return "blue";
          }
          return "rgb(197, 25, 45)";
        });

        let graphData = {
          labels: data.map((rp) => rp.name),
          datasets: [
            {
              type: "bar",
              label: `Top 5 performing districts for Goal: ${this.state.selectedGoal?.label}`,
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

    doc.save("TopDistrictReport.pdf");
  };

  render() {
    return (
      <Fragment>
        <PageHeader
          heading={"Top Performing Districts"}
          is_filter={true}
          filter_func={(text) => this.setState({ filter: text, activePage: 0 })}
          history={this.props.history}
          match={this.props.match}
          back_button={true}
          changeDisplay={(val) => {
            this.setState({ display: val });
          }}
        ></PageHeader>
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
          <Colxx sm="2">
            <div className="form-group">
              <Label htmlFor="policy">Select Year</Label>
              <Select
                // options={[
                //   {
                //     label: "2021-22",
                //     value: 2021,
                //   },
                //   {
                //     label: "2020-21",
                //     value: 2020,
                //   },
                //   {
                //     label: "2019-20",
                //     value: 2019,
                //   },
                //   {
                //     label: "2018-19",
                //     value: 2018,
                //   },
                // ]}
                options={
                  this.state.years
                    ? this.state.years.sort((a, b) => b - a)
                    .map((year) => {
                        return {
                          label: `${year}-${String(Number(year) + 1).slice(
                            2,
                            4
                          )}`,
                          value: year,
                        };
                      })
                    : []
                }
                value={this.state.selectedYear}
                onChange={(data) => {
                  this.setState({ selectedYear: data });
                }}
              />
            </div>
          </Colxx>
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
                    const { name, indicator, goal, value } = data;
                    return {
                      Name: name,
                      "Score Value": value,
                    };
                  })}
                  fileName={`TopPerformingDistrictReport`}
                />
              </Colxx>
              <Colxx lg="2" className="pt-3">
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
            <Row>
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
                        scales: {
                          xAxes: {
                            title: {
                              display: true,
                              text: "District",
                              font: {
                                size: 15,
                              },
                            },
                          },
                          yAxes: {
                            title: {
                              display: true,
                              text: "Score",
                              font: {
                                size: 15,
                              },
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
            </Row>
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
                      columnFilter={[
                        { name: "Scheme", dropDown: false },
                        { name: "Indicator", dropDown: false },
                        { name: "Department", dropDown: false },
                      ]}
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

export default connect(mapStateToProps, mapActionsToProps)(PerformingDistricts);
