
import React, { Component, Fragment } from "react";
import PageHeader from "../common/PageHeader";
import { connect } from "react-redux";
import TargetTable from "./TargetTable";
import { Label, Row } from "reactstrap";
import { Colxx } from "../../components/common/CustomBootstrap";
import Select from "react-select";
import _ from "lodash";
import apiAuth from "../../helpers/ApiAuth";
import { NotificationManager } from "../../components/common/react-notifications";
import { TableExport } from "../common/TableExport";

class ViewTargets extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: "",
      selectedGoal: null,
      selectedDepartment: null,
      selectedIndicator: null,
      selectedYear: null,
      targets: [],
      districts: [],
      districtOptions: [],
      // years: [],
      display: localStorage.getItem("targets")
        ? localStorage.getItem("targets")
        : "card",
      districtDB: new Map(),
      selectedType: {
        label: "District",
        value: "DIF",
      },
      
    };
  }

  handleChangeGoal = (selectedGoal) => {
    this.setState({ selectedGoal });
  };

  handleChangeDepartment = (selectedDepartment) => {
    this.setState({ selectedDepartment });
  };

  handleChangeIndicator = (selectedIndicator) => {
    this.setState({ selectedIndicator });
  };

  handleChangeYear = (selectedYear) => {
    this.setState({ selectedYear });
  };

  componentDidMount() {
    // this.getDistricts();
    this.getTargets();
  }

  // getDistricts = () => {
  //   this.setState({ loading: true });
  //   let url = "/api/district/";
  //   apiAuth
  //     .get(url)
  //     .then((response) => {
  //       let districts = response.data;
  //       let districtDB = new Map();
  //       let options = districts.map((dist) => {
  //         districtDB.set(dist.id, dist.name);
  //         return {
  //           label: dist.name,
  //           value: dist.id,
  //         };
  //       });

  //       this.setState(
  //         {
  //           districts: districts,
  //           districtDB: districtDB,
  //           districtOptions: options,
  //         },
  //         () => {
  //           this.getTargets();
  //         }
  //       );
  //     })
  //     .catch(function (error) {
  //       console.log(error.response?.data);
  //       console.log(error.response?.status);
  //       console.log(error.response?.headers);
  //       NotificationManager.error(
  //         error.response?.data?.detail,
  //         `Get Districts Error ${error.response?.status}`,
  //         3000,
  //         null,
  //         null,
  //         ""
  //       );
  //     });
  // };

  getTargets = () => {
    this.setState({ loading: true });
    let url = "/api/targets/";
    apiAuth
      .get(url)
      .then((response) => {
        let targets = response.data.map((data) => {
          data["indicatorvalue"] =
            data.indicatorvalue?.length > 0
              ? { ...data.indicatorvalue[0] }
              : {};
          data["indicator_id"] = data.indicatorvalue?.id;
          data["progress_value"] = data.indicatorvalue?.progress_value;
          data["baseline_value"] = data.indicatorvalue?.baseline_value;
          data["value"] = data.indicatorvalue?.value;
          data["short_value"] = data.indicatorvalue?.short_value;
          data["mid_value"] = data.indicatorvalue?.mid_value;
          data["district"] = data.indicatorvalue?.district;
          data["year"]=data?.year;
          return data;
        });

        // targets = targets.map((target) => {
        //   if (this.state.districtDB.get(target.district)) {
        //     target["district_name"] = this.state.districtDB.get(
        //       target.district
        //     );
        //   }

        //   return target;
        // });

        this.setState({ targets: targets, loading: false });
      })
      .catch(function (error) {
        console.log(error.response?.data);
        console.log(error.response?.status);
        console.log(error.response?.headers);
        NotificationManager.error(
          error.response?.data?.detail,
          `Get Targets Error ${error.response?.status}`,
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
          heading={"Targets"}
          is_filter={true}
          filter_func={(text) => this.setState({ filter: text, activePage: 0 })}
          history={this.props.history}
          match={this.props.match}
          back_button={true}
          changeDisplay={(val) => {
            this.setState({ display: val });
          }}
        ></PageHeader>
        {this.state.targets.length > 0 ? (
          <Row className="mt-4 ml-2">
            <Colxx >
              <div className="form-group">
                <Label htmlFor="policy">Select Goal</Label>

                <Select
                  options={_.sortBy(
                    _.uniqWith(
                      this.state.targets.map((log) => log["goal"]),
                      _.isEqual
                    )
                  ).map((log) => {
                    return {
                      label: log,
                      value: log,
                    };
                  })}
                  defaultValue={this.state.selectedGoal}
                  onChange={this.handleChangeGoal}
                />
              </div>
            </Colxx>
            <Colxx >
              <div className="form-group">
                <Label htmlFor="policy">Select Department</Label>

                <Select
                  options={_.uniqWith(
                    this.state.targets
                      .filter(
                        (target) =>
                          target.goal === this.state.selectedGoal?.value
                      )
                      .map((log) => log["department"]),
                    _.isEqual
                  ).map((log) => {
                    return {
                      label: log,
                      value: log,
                    };
                  })}
                  defaultValue={this.state.selectedDepartment}
                  onChange={this.handleChangeDepartment}
                />
              </div>
            </Colxx>
            <Colxx >
              <div className="form-group">
                <Label htmlFor="policy">Select Type</Label>

                <Select
                  options={[
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
            <Colxx >
              <div className="form-group">
                <Label htmlFor="policy">Select Indicator</Label>
                <Select
                  options={_.uniqWith(
                    this.state.targets
                      .filter(
                        (target) =>
                          target.goal === this.state.selectedGoal?.value
                      )
                      .filter(
                        (target) =>
                          target.department ===
                          this.state.selectedDepartment?.value
                      )
                      .filter(
                        (target) =>
                          target.type === this.state.selectedType?.value
                      )
                      .map((log) => log["name"]),
                    _.isEqual
                  ).map((log) => {
                    return {
                      label: log,
                      value: log,
                    };
                  })}
                  defaultValue={this.state.selectedIndicator}
                  onChange={this.handleChangeIndicator}
                />
              </div>
            </Colxx>
            <Colxx>
              <div className="form-group">
                <Label htmlFor="policy">Select Year</Label>
                <Select
               options={_.uniqWith(
                this.state.targets
                  .filter(
                    (target) =>
                      target.goal === this.state.selectedGoal?.value
                  )
                  .filter(
                    (target) =>
                      target.department ===
                      this.state.selectedDepartment?.value
                  )
                  .filter(
                    (target) =>
                      target.type === this.state.selectedType?.value
                  )
                  .filter(
                    (target) =>
                      target.name === this.state.selectedIndicator?.value
                  )
                  .map((log) => log["year"]),
                _.isEqual
              ).sort((a, b) => b - a)
              .map((log) => {
                return {
                  label: `${log}-${String(Number(log) + 1).slice(
                            2,
                            4
                          )}`,
                          value: log,
                };
              })}
              defaultValue={this.state.selectedYear}
              onChange={this.handleChangeYear}
                
                />
              </div>
            </Colxx>
            <Colxx>
               <TableExport  fileName={"TargetsData"} />
            </Colxx>
          </Row>
        ) : (
          <div className="loading"></div>
        )}
        {this.state.targets
          .filter(
            (target) => 
              target.goal === this.state.selectedGoal?.value
          )
          .filter(
            (target) =>
              target.department === this.state.selectedDepartment?.value
          )
          .filter(
            (target) => 
              target.type === this.state.selectedType?.value
          )
          
          .filter(
            (target) => 
              target.name === this.state.selectedIndicator?.value
          )
          .filter(
            (target) =>
              target.year === this.state.selectedYear?.value
          )
          .length > 0 ? (
          <Fragment>
            <TargetTable
              targets={this.state.targets
                .filter(
                  (target) => target.goal === this.state.selectedGoal?.value
                )
                .filter(
                  (target) =>
                    target.department === this.state.selectedDepartment?.value
                )
                .filter(
                  (target) => target.type === this.state.selectedType?.value
                )
                .filter(
                  (target) =>
                    target.name === this.state.selectedIndicator?.value
                )
                .filter((dept) =>
                  dept.goal
                    .toLowerCase()
                    .includes(this.state.filter.toLowerCase())
                )
                .filter(
                  (target) =>
                    target.year === this.state.selectedYear?.value
                )
              }
              districtOptions={this.state.districtOptions}
              getTargets={() => {
                this.setState({ targets: [] });
                this.getTargets();
              }}
              permission={this.props.permission}
            ></TargetTable>
          </Fragment>
        ) : (
          <Fragment>
            <div></div>
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

export default connect(mapStateToProps, mapActionsToProps)(ViewTargets);
