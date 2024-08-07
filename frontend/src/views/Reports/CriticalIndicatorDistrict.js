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
import { ExportToExcel } from "../common/ExportToExcel";
import JsPDF from "jspdf";
import autoTable from "jspdf-autotable";

class CriticalIndicatorDistrict extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: "",
      reports: [],
      districts: [],
      years: [],
      selectedDistrict: {
        label: "Kohima",
        value: "Kohima",
      },
      selectedYear: {
        label: new Date().getFullYear() + "-" + (new Date().getFullYear() + 1).toString().substr(-2),
        value: new Date().getFullYear(),
      },
      selectedType: {
        label: "All",
        value: "All",
      },
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
          Header: "Year",
          accessor: data => `${data.year}-${String(Number(data.year) + 1).slice(2, 4)}`,
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
      historyTargetsDIF: {},
    };
  }

  componentDidMount() {
    this.viewGoalsData();
    this.getDistricts();
  }

  getDistricts = () => {
    apiAuth
      .get("/api/district/")
      .then((response) => {
        let districts = response.data;
        this.setState({ districts: districts });
      })
      .catch(function (error) {
        console.log(error.response?.data);
        console.log(error.response?.status);
        console.log(error.response?.headers);
        NotificationManager.error(
          error.response?.data?.detail,
          `Get Districts Error ${error.response?.status}`,
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

        let years = targetsDIF.map((sc) => sc.year);

        years = _.sortBy(_.unionBy(years));

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

        this.setState({
          targetReports: targetsDIF,
          historyTargetsDIF: historyTargetsDIF,
          loading: false,
          years,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  viewDIFScore = () => {
    this.setState({ loadingData: true, reports: [], graphData: null });
    apiAuth
      .get(
        "/api/public/score/?type=DIF"
        // `/api/public/score/?type=${
        //   this.state.selectedType?.value === "DIF"
        //     ? "DIF"
        //     : this.state.selectedType?.value === "SIF"
        //     ? "SIF"
        //     : ""
        // }`
      )
      .then((res) => {
        let data = res.data
          .filter((dd) =>
            this.props.department?.length > 0
              ? this.props.department?.includes(dd.department)
              : true
          )
          .filter(
            (sc) =>
              sc.name === this.state.selectedDistrict?.label &&
              String(sc.year) === String(this.state.selectedYear?.value) &&
              sc.indicator &&
              sc.value !== "Null"
          );
        data = data
          .map((dt) => {
            dt.target = this.state.historyTargetsDIF[dt.goal]
              ? this.state.historyTargetsDIF[dt.goal][dt.indicator]
                ? this.state.historyTargetsDIF[dt.goal][dt.indicator][dt.year]
                  ? this.state.historyTargetsDIF[dt.goal][dt.indicator][dt.year]
                  : null
                : null
              : null;
            return dt;
          })
          .filter((dt) => dt.target);

        data = data.map((dt) => {
          dt.diff = Math.abs(Number(dt.target) - Number(dt.value));
          return dt;
        });
        data = _.sortBy(data, "diff").reverse().slice(0, 5);

        this.setState({
          reports: data,
          loadingData: false,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getRpeotPDf = () => {
    // const report = new JsPDF("", "pt", "a4");
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

    doc.save("CriticalIndicatorDistrictReport.pdf");
  };

  render() {
    return (
      <Fragment>
        <PageHeader
          heading={"Critical Indicators(District)"}
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
                  <Label htmlFor="policy">Select District</Label>

                  <Select
                    options={this.state.districts.map((dist) => {
                      return {
                        label: dist.name,
                        value: dist.name,
                      };
                    })}
                    defaultValue={this.state.selectedDistrict}
                    onChange={(val) => {
                      this.setState({ selectedDistrict: val });
                    }}
                  />
                </div>
              </Colxx>
              <Colxx sm="2">
                <div className="form-group">
                  <Label htmlFor="policy">Select Year</Label>
                  <Select
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
              {/* <Colxx lg="2">
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
                          value,
                          year,
                          target,
                          department,
                          scheme,
                        } = data;
                        return {
                          Name: name,
                          "Goal Name": goal,
                          "Indicator Name": indicator,
                          Department: department,
                          Scheme: scheme,
                          Year: year,
                          "Score Value": value,
                          Target: target,
                        };
                      })}
                      fileName={`DistrictCriticalIndicatorReport`}
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
            {this.state.reports?.length > 0 ? (
              <>
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
    department
  };
};

const mapActionsToProps = (dispatch) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(CriticalIndicatorDistrict);
