import React, { Component, Fragment } from "react";
import PageHeader from "../common/PageHeader";
import { connect } from "react-redux";
// import IndicatorTable from "./IndicatorTable";
import { Button, Card, Label, Row } from "reactstrap";
import { Colxx } from "../../components/common/CustomBootstrap";
import Select from "react-select";
import apiAuth from "../../helpers/ApiAuth";
import { NotificationManager } from "../../components/common/react-notifications";
import _ from "lodash";
import Table from "../common/Table";
import moment from "moment";
import JsPDF from "jspdf";
import { ExportToExcel } from "../common/ExportToExcel";
import autoTable from "jspdf-autotable";
class GetReports extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: "",
      selectedGoal: null,
      goals: [],
      indicators: [],
      departments: [],
      districts: [],
      schemes: [],
      reports: [],
      periodicities: [],
      selectedDept: {
        label: "All",
        value: "All",
      },
      selectedType: {
        label: "All",
        value: "All",
      },
      selectedDistrict: {
        label: "All",
        value: "All",
      },
      selectedGoal: {
        label: "All",
        value: "All",
      },
      selectedScheme: {
        label: "All",
        value: "All",
      },
      selectedPeriodicity: {
        label: "All",
        value: "All",
      },
      selectedYear: {
        label: "All",
        value: "All",
      },
      display: localStorage.getItem("goals")
        ? localStorage.getItem("goals")
        : "card",
      column_list: [
        {
          Header: "Name",
          accessor: "name",
        },
        {
          Header: "Goal Name",
          accessor: "goal",
        },
        {
          Header: "Indicator Name",
          accessor: "indicator.name",
        },
        {
          Header: "Department Name",
          accessor: "indicator.department",
        },
        {
          Header: "Scheme Name",
          accessor: "indicator.scheme",
        },
        {
          Header: "Periodicity",
          accessor: "indicator.periodicity",
        },
        {
          Header: "Type",
          accessor: "type",
          Cell: ({ cell: { value }, row }) => (
            <>{value === "DIF" ? "District" : "State"}</>
          ),
        },
        {
          Header: "Year",
          accessor: "year",
        },
        {
          Header: "Score Value",
          accessor: "value",
        },
        {
          Header: "Report Date",
          accessor: "report_date",
        },
      ],
    };
  }

  handleChangeGoal = (selectedGoal) => {
    this.setState({ selectedGoal });
  };

  componentDidMount() {
    this.getGoals();
    this.getDepartments();
    this.getDistricts();
    this.getSchemes();
    this.getPeriodicity();
  }

  getGoals = () => {
    this.setState({ report: [] });
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

        departments.unshift("All");
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

  getDistricts = () => {
    apiAuth
      .get("/api/district/")
      .then((response) => {
        let districts = response.data.map((dept) => {
          return dept.name;
        });

        districts.unshift("All");
        this.setState({ districts });
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

  getSchemes = () => {
    apiAuth
      .get("/api/scheme/")
      .then((response) => {
        let schemes = response.data.map((dept) => {
          return dept.name;
        });

        schemes.unshift("All");
        this.setState({ schemes });
      })
      .catch(function (error) {
        console.log(error.response?.data);
        console.log(error.response?.status);
        console.log(error.response?.headers);
        NotificationManager.error(
          error.response?.data?.detail,
          `Get Schemes Error ${error.response?.status}`,
          3000,
          null,
          null,
          ""
        );
      });
  };

  getPeriodicity = () => {
    apiAuth
      .get("/api/periodicity/")
      .then((response) => {
        let periodicities = response.data.map((dept) => {
          return dept.name;
        });

        periodicities.unshift("All");
        this.setState({ periodicities });
      })
      .catch(function (error) {
        console.log(error.response?.data);
        console.log(error.response?.status);
        console.log(error.response?.headers);
        NotificationManager.error(
          error.response?.data?.detail,
          `Get Periodicity Error ${error.response?.status}`,
          3000,
          null,
          null,
          ""
        );
      });
  };

  getReports = () => {
    this.setState({ loadingData: true, reports: [] });
    apiAuth
      .get("/api/datareport/")
      .then((response) => {
        let reports = response.data
          .map((ind) => {
            ind["indicator_type"] = ind.type === "SIF" ? "State" : "District";

            return ind;
          })
          .map((score) => {
            score.reportdate = score.report_date;
            score.report_date = score.report_date
              ? moment(score.report_date).format("DD-MM-YYYY")
              : "";

            return score;
          })
          .filter((dd) =>
            this.props.department?.length > 0
              ? this.props.department?.includes(dd.indicator?.department)
              : true
          );
        reports = _.sortBy(reports, "id");

        if (
          this.state.selectedDept?.label !== "All" &&
          this.state.selectedDept
        ) {
          reports = reports.filter(
            (rp) => rp.indicator?.department === this.state.selectedDept?.label
          );
        }

        if (
          this.state.selectedDistrict?.label !== "All" &&
          this.state.selectedDistrict
        ) {
          reports = reports.filter(
            (rp) => rp.name === this.state.selectedDistrict?.label
          );
        }

        if (
          this.state.selectedGoal?.label !== "All" &&
          this.state.selectedGoal
        ) {
          reports = reports.filter(
            (rp) => rp.goal === this.state.selectedGoal?.label
          );
        }

        if (
          this.state.selectedType?.label !== "All" &&
          this.state.selectedType
        ) {
          reports = reports.filter(
            (rp) => rp.type === this.state.selectedType?.value
          );
        }

        if (
          this.state.selectedScheme?.label !== "All" &&
          this.state.selectedScheme
        ) {
          reports = reports.filter(
            (rp) => rp.indicator?.scheme === this.state.selectedScheme?.label
          );
        }

        if (
          this.state.selectedPeriodicity?.label !== "All" &&
          this.state.selectedPeriodicity
        ) {
          reports = reports.filter(
            (rp) =>
              rp.indicator?.periodicity ===
              this.state.selectedPeriodicity?.label
          );
        }

        if (
          this.state.selectedYear?.label !== "All" &&
          this.state.selectedYear
        ) {
          reports = reports.filter(
            (rp) => String(rp?.year) === this.state.selectedYear?.label
          );
        }

        this.setState({ reports, loadingData: false });
      })
      .catch(function (error) {
        console.log(error.response?.data);
        console.log(error.response?.status);
        console.log(error.response?.headers);
        NotificationManager.error(
          error.response?.data?.detail,
          `Get Report Error ${error.response?.status}`,
          3000,
          null,
          null,
          ""
        );
      });
  };

  getRpeotPDf = async () => {
    // const report = new JsPDF("portrait", "pt", "a4");
    // await report.html(document.querySelector("#reporttable")).then(() => {
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

    doc.save("Report.pdf");
  };

  render() {
    return (
      <Fragment>
        <PageHeader
          heading={"Get Reports"}
          is_filter={true}
          filter_func={(text) => this.setState({ filter: text, activePage: 0 })}
          history={this.props.history}
          match={this.props.match}
          back_button={true}
          changeDisplay={(val) => {
            this.setState({ display: val });
          }}
        ></PageHeader>
        <>
          <Row className="mt-4 ml-2">
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
            <Colxx lg="2">
              <div className="form-group">
                <Label htmlFor="policy">Select District</Label>

                <Select
                  options={this.state.districts.map((district) => {
                    return {
                      label: district,
                      value: district,
                    };
                  })}
                  defaultValue={this.state.selectedDistrict}
                  onChange={(val) => {
                    this.setState({ selectedDistrict: val });
                  }}
                />
              </div>
            </Colxx>
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
                  onChange={this.handleChangeGoal}
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
                <Label htmlFor="policy">Select Scheme</Label>
                <Select
                  options={this.state.schemes.map((scheme) => {
                    return {
                      label: scheme,
                      value: scheme,
                    };
                  })}
                  defaultValue={this.state.selectedScheme}
                  onChange={(val) => {
                    this.setState({ selectedScheme: val });
                  }}
                />
              </div>
            </Colxx>
            <Colxx lg="2">
              <div className="form-group">
                <Label htmlFor="policy">Select Periodicity</Label>
                <Select
                  options={this.state.periodicities?.map((scheme) => {
                    return {
                      label: scheme,
                      value: scheme,
                    };
                  })}
                  defaultValue={this.state.selectedPeriodicity}
                  onChange={(val) => {
                    this.setState({ selectedPeriodicity: val });
                  }}
                />
              </div>
            </Colxx>
            <Colxx lg="2">
              <div className="form-group">
                <Label htmlFor="policy">Select Year</Label>

                <Select
                  options={[
                    {
                      label: "All",
                      value: "All",
                    },
                    {
                      label: "2018",
                      value: 2018,
                    },
                    {
                      label: "2019",
                      value: 2019,
                    },
                    {
                      label: "2020",
                      value: 2020,
                    },
                    {
                      label: "2021",
                      value: 2021,
                    },
                    {
                      label: "2022",
                      value: 2022,
                    },
                  ]}
                  defaultValue={this.state.selectedYear}
                  onChange={(val) => {
                    this.setState({ selectedYear: val });
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
                    this.getReports();
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
                        type,
                        report_date,
                      } = data;
                      return {
                        Name: name,
                        "Goal Name": goal,
                        "Indicator Name": indicator?.name,
                        "Department Name": indicator?.department,
                        "Scheme Name": indicator?.scheme,
                        Periodicity: indicator?.periodicity,
                        Type: type === "DIF" ? "District" : "State",
                        Year: year,
                        "Score Value": value,
                        "Report Date": report_date,
                      };
                    })}
                    fileName={`SDGScoresReport`}
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

          {this.state.reports.length ? (
            <Fragment>
              <Row className="rounded mt-4 ml-2 reportTable">
                <Card>
                  <Table
                    columns={this.state.column_list}
                    data={this.state.reports}
                    dataUpdateFunction={(data) => this.props.updateMyData(data)}
                    tableIndex={"scoreTableIndex"}
                    noPagination={this.state.units?.length > 10 ? true : false}
                    // columnFilter={[
                    //   { name: "Indicator Name", dropDown: false },
                    //   { name: "Goal Name", dropDown: false },
                    //   { name: "Year", dropDown: false },
                    //   { name: "Score Value", dropDown: false },
                    //   { name: "Report Date", dropDown: false },
                    //   { name: "Vetted By", dropDown: false },
                    //   { name: "Remarks", dropDown: false },
                    // ]}
                  />
                </Card>
              </Row>
            </Fragment>
          ) : (
            <Fragment>
              {this.state.loadingData ? (
                <div className="loading"></div>
              ) : (
                <div className="mt-2 ml-4">
                  No data available for seleted filter.
                </div>
              )}
            </Fragment>
          )}
        </>
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

export default connect(mapStateToProps, mapActionsToProps)(GetReports);
