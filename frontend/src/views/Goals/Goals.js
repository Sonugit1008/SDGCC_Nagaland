import React, { Component, Fragment } from "react";
import PageHeader from "../common/PageHeader";
import { connect } from "react-redux";
import GoalTable from "./GoalTable";
import { Label, Row } from "reactstrap";
import { Colxx } from "../../components/common/CustomBootstrap";
import Select from "react-select";
import _ from "lodash";
import apiAuth from "../../helpers/ApiAuth";
import { NotificationManager } from "../../components/common/react-notifications";

class ViewGoals extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: "",
      goals: [],
      display: localStorage.getItem("goals")
        ? localStorage.getItem("goals")
        : "card",
    };
  }
  handleChangeGoal = (selectedGoal) => {
    this.setState({ selectedGoal });
  };

  componentDidMount() {
    this.getGoals();
  }

  getGoals = () => {
    let url = "/api/targets/";
    apiAuth
      .get(url)
      .then((response) => {
        let goals = [];

        response.data.forEach((data) => {
          let yearDB = new Map();
          if (data.indicatorvalue && data.indicatorvalue.length > 0) {
            data.indicatorvalue.forEach((indicator) => {
              let db = { ...data };
              let year = yearDB.get(
                `${indicator.start_year} - ${indicator.end_year}`
              );

              if (year) {
                year[indicator.value_type] = indicator.value;
                year[`${indicator.value_type}_id`] = indicator.id;
                yearDB.set(
                  `${indicator.start_year} - ${indicator.end_year}`,
                  year
                );
              } else {
                db[indicator.value_type] = indicator.value;
                db[`${indicator.value_type}_id`] = indicator.id;
                db["start_year"] = indicator.start_year;
                db["end_year"] = indicator.end_year;
                yearDB.set(
                  `${indicator.start_year} - ${indicator.end_year}`,
                  db
                );
              }
            });

            let yearData = [...yearDB.values()];
            goals = goals.concat(yearData);
          } else {
            goals.push(data);
          }
        });

        this.setState({ goals: goals, loading: false });
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

  render() {
    return (
      <Fragment>
        <PageHeader
          heading={"Goals"}
          is_filter={true}
          filter_func={(text) => this.setState({ filter: text, activePage: 0 })}
          history={this.props.history}
          match={this.props.match}
          add_new={this.props.permission?.write}
          add_new_url={"/app/goals/add"}
          // back_button={true}
          changeDisplay={(val) => {
            this.setState({ display: val });
          }}
        ></PageHeader>
        {this.state.goals.length > 0 ? (
          <Row className="mt-4 ml-2">
            <Colxx lg="3">
              <div className="form-group">
                <Label htmlFor="policy">Select Goal</Label>

                <Select
                  options={_.uniqWith(
                    this.state.goals.map((log) => log["goal"]),
                    _.isEqual
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
          </Row>
        ) : (
          <div className="loading"></div>
        )}
        {this.state.goals.filter(
          (target) => target.goal === this.state.selectedGoal?.value
        ).length ? (
          <Fragment>
            {" "}
            <GoalTable
              goals={this.state.goals
                .filter(
                  (target) => target.goal === this.state.selectedGoal?.value
                )
                .filter((dept) =>
                  dept.name
                    .toLowerCase()
                    .includes(this.state.filter.toLowerCase())
                )}
            ></GoalTable>{" "}
          </Fragment>
        ) : (
          <Fragment>
            <div className=""></div>
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

export default connect(mapStateToProps, mapActionsToProps)(ViewGoals);
