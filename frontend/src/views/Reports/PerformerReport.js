import React, { Component, Fragment } from "react";
import PageHeader from "../common/PageHeader";
import { connect } from "react-redux";
import { Button, Card, Label, Row } from "reactstrap";
import { Colxx } from "../../components/common/CustomBootstrap";
import Select from "react-select";
import apiAuth from "../../helpers/ApiAuth";
import { NotificationManager } from "../../components/common/react-notifications";
import _ from "lodash";
import Table from "../common/Table";
import { ExportToExcel } from "../common/ExportToExcel";
import JsPDF from "jspdf";
import autoTable from "jspdf-autotable";

class PerformerIndicator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: "",
      reports: [],
      goals: [],
      departments: [],
      years: [],
      districts: [],
      selectedGoal: {
        label: "SDG Index",
        value: "SDG Index",
      },
      selectedYear: {
        label: new Date().getFullYear() + "-" + (new Date().getFullYear() + 1).toString().substr(-2),
        value: new Date().getFullYear(),
      },
      selectedType: {
        label: "All",
        value: "All",
      },
      selectedDistrict: {
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
          Header: "Category",
          accessor: "category",
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
          Header: "Indicator Value",
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

  getGoals = () => {
    this.setState({ loadingData: true });
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
        `/api/public/score/?category=Performer&type=${
          this.state.selectedType?.value === "DIF"
            ? "DIF"
            : this.state.selectedType?.value === "SIF"
            ? "SIF"
            : ""
        }`
      )
      .then((res) => {
        let data = res.data.filter(
          (sc) =>
            String(sc.year) === String(this.state.selectedYear?.value) &&
            sc.indicator &&
            sc.value !== "Null"
        );

        if (this.state.selectedGoal?.label !== "All") {
          data = data.filter(
            (sc) => sc.goal === this.state.selectedGoal?.label
          );
        }

        if (this.state.selectedDistrict?.label !== "All") {
          data = data.filter(
            (sc) => sc.name === this.state.selectedDistrict?.label
          );
        }

        data = data
          .filter((dd) =>
            this.props.department?.length > 0
              ? this.props.department?.includes(dd.department)
              : true
          )
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

        data = data.map((dt) => {
          dt.diff = Math.abs(Number(dt.target) - Number(dt.value));
          return dt;
        });

        data = _.sortBy(data, "diff");

        this.setState({
          reports: data,
          loadingData: false,
          years,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getRpeotPDf = () => {
    const doc = new JsPDF();
    doc.autoTable({ html: "#my-table" });
    autoTable(doc, {
      theme: "grid",
      body: this.state.reports,
      columns: this.state.column_list.map((col) => {
        return { header: col.Header, dataKey: col.accessor };
      }),
    });

    doc.save("PerformerIndicatorReport.pdf");
  };

  render() {
    return (
      <Fragment>
        <PageHeader
          heading={"Performer Indicators"}
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
                    options={[
                      {
                        label: "All",
                        value: "All",
                      },
                    ].concat(
                      this.state.goals.map((goal) => {
                        return {
                          label: goal,
                          value: goal,
                        };
                      })
                    )}
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
              {this.state.selectedType?.value === "DIF" ? (
                <Colxx lg="2">
                  <div className="form-group">
                    <Label htmlFor="policy">Select District</Label>

                    <Select
                      options={[
                        {
                          label: "All",
                          value: "All",
                        },
                      ].concat(
                        this.state.districts.map((dist) => {
                          return {
                            label: dist.name,
                            value: dist.name,
                          };
                        })
                      )}
                      defaultValue={this.state.selectedDistrict}
                      onChange={(val) => {
                        this.setState({ selectedDistrict: val });
                      }}
                    />
                  </div>
                </Colxx>
              ) : (
                <></>
              )}
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
                        : this.state.selectedType.value === 'SIF' || this.state.selectedType.value === 'All'
                        ? this.state.years
                          ? this.state.years.sort((a, b) => b-a).map((year) => {
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
                          category,
                          department,
                          scheme,
                        } = data;
                        return {
                          Name: name,
                          "Goal Name": goal,
                          "Indicator Year":year,
                          "Indicator Name": indicator,
                          Category: category,
                          Department: department,
                          Scheme: scheme,
                          "Indicator Value": value,
                          "Target Value": target,
                        };
                      })}
                      fileName={`PerformerIndicatorReport`}
                    />
                  </Colxx>
                  <Colxx lg="2" className="pt-3">
                    <Button
                      onClick={() => {
                        this.getRpeotPDf();
                      }}
                      className="ml-5 mt-2"
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
    department,
  };
};

const mapActionsToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapActionsToProps)(PerformerIndicator);
