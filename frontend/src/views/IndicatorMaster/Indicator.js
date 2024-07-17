import React, { Component, Fragment } from "react";
import PageHeader from "../common/PageHeader";
import { connect } from "react-redux";
import IndicatorTable from "./IndicatorTable";
import { Label, Row } from "reactstrap";
import { Colxx } from "../../components/common/CustomBootstrap";
import Select from "react-select";
import apiAuth from "../../helpers/ApiAuth";
import { NotificationManager } from "../../components/common/react-notifications";
import _ from "lodash";
import { ExportToExcel } from "../common/ExportToExcel";
class ViewIndicators extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: "",
      selectedGoal: null,
      goals: [],
      indicators: [],
      departments: [],
      selectedDept: {
        label: "All",
        value: "All",
      },
      selectedType: {
        label: "All",
        value: "All",
      },
      display: localStorage.getItem("goals")
        ? localStorage.getItem("goals")
        : "card",
    };
  }

  handleChangeGoal = (selectedGoal) => {
    this.setState({ selectedGoal });
  };

  componentDidMount() {
    this.getIndicators();
    this.getGoals();
    this.getDepartments();
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

  getDepartments = () => {
    apiAuth
      .get("/api/department/")
      .then((response) => {
        let departments = response.data.map((dept) => {
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

  getIndicators = () => {
    this.setState({ loadingData: true });
    apiAuth
      .get("/api/indicator/view/")
      .then((response) => {
        let indicators = response.data.map((ind) => {
          ind["indicator_type"] = ind.type === "SIF" ? "State" : "District";

          return ind;
        });
        indicators = _.sortBy(indicators, "id");
        // let goals = _.uniqBy(
        //   indicators.map((data) => {
        //     return data.goal;
        //   })
        // );
        this.setState({ indicators, loadingData: false });
      })
      .catch(function (error) {
        console.log(error.response?.data);
        console.log(error.response?.status);
        console.log(error.response?.headers);
        NotificationManager.error(
          error.response?.data?.detail,
          `Get indicator Error ${error.response?.status}`,
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
          heading={"Indicators Master"}
          is_filter={true}
          filter_func={(text) => this.setState({ filter: text, activePage: 0 })}
          history={this.props.history}
          match={this.props.match}
          add_new={this.props.permission?.write}
          add_new_url={"/app/indicators/add/"}
          // back_button={true}
          changeDisplay={(val) => {
            this.setState({ display: val });
          }}
        ></PageHeader>
        {this.state.indicators.length > 0 ? (
          <>
            <Row>
              <ExportToExcel
                apiData={this.state.indicators.map((indi) => {
                  console.log("ssss", indi);
                  const {
                    goal,
                    name,
                    periodicity,
                    department,
                    unit,
                    scheme,
                    indicator_type,
                    year,
                    comment,
                    numerator_label,
                    denominator_label,
                  } = indi;
                  return {
                    Goal: goal,
                    Indicator: name,
                    Periodicity: periodicity,
                    Department: department,
                    Unit: unit,
                    Scheme: scheme,
                    Type: indicator_type,
                    Year: year,
                    Comment: comment,
                    Numerator_Label: numerator_label,
                    Denominator_Label: denominator_label,
                  };
                })}
                fileName={"indicatorsData"}
              />
            </Row>
            <Row className="mt-4 ml-2">
              <Colxx lg="3">
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
              <Colxx lg="3">
                <div className="form-group">
                  <Label htmlFor="policy">Select Indicator Type</Label>

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
              <Colxx lg="3">
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
            </Row>
            {this.state.indicators
              .filter(
                (target) => target.goal === this.state.selectedGoal?.value
              )
              .filter((ind) => {
                if (this.state.selectedType?.value === "All") return true;
                return this.state.selectedType?.value === ind.type;
              })
              .filter((dept) => {
                if (this.state.selectedDept?.value === "All") return true;
                return this.state.selectedDept?.value === dept.department;
              }).length ? (
              <Fragment>
                {" "}
                <IndicatorTable
                  key={
                    this.state.selectedType?.value +
                    this.state.selectedGoal?.value +
                    this.state.selectedDept?.value
                  }
                  indicators={this.state.indicators
                    .filter(
                      (target) => target.goal === this.state.selectedGoal?.value
                    )
                    .filter((ind) => {
                      if (this.state.selectedType?.value === "All") return true;
                      return this.state.selectedType?.value === ind.type;
                    })
                    .filter((dept) => {
                      if (this.state.selectedDept?.value === "All") return true;
                      return this.state.selectedDept?.value === dept.department;
                    })
                    .filter((dept) =>
                      dept.name
                        .toLowerCase()
                        .includes(this.state.filter.toLowerCase())
                    )}
                  getIndicators={() => {
                    this.getIndicators();
                  }}
                  permission={this.props.permission}
                  selectedType={this.state.selectedType?.value}
                ></IndicatorTable>{" "}
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
              <div className=""></div>
            )}
          </>
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

export default connect(mapStateToProps, mapActionsToProps)(ViewIndicators);
