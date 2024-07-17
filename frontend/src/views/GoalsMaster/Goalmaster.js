import React, { Component, Fragment } from "react";
import PageHeader from "../common/PageHeader";
import { connect } from "react-redux";
import GoalsTable from "./GoalsTable";
import apiAuth from "../../helpers/ApiAuth";
import { NotificationManager } from "../../components/common/react-notifications";
// import _ from "lodash";

class ViewGoals extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: "",
      selectedGoal: null,
      goals: [],
    };
  }

  handleChangeGoal = (selectedGoal) => {
    this.setState({ selectedGoal });
  };

  componentDidMount() {
    this.getGoals();
  }

  getGoals = () => {
    apiAuth
      .get("/api/goal/")
      .then((response) => {
        let goals = response.data;
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

  render() {
    return (
      <Fragment>
        <PageHeader
          heading={"Goals Master"}
          is_filter={true}
          filter_func={(text) => this.setState({ filter: text, activePage: 0 })}
          history={this.props.history}
          match={this.props.match}
          add_new={this.props.permission?.write}
          add_new_url={"/app/goalsmaster/add/"}
          // back_button={true}
          changeDisplay={(val) => {
            this.setState({ display: val });
          }}
        ></PageHeader>
        <>
          {this.state.goals.length > 0 ? (
            <Fragment>
              {" "}
              <GoalsTable
                goals={this.state.goals.filter((dept) =>
                  dept.name
                    .toLowerCase()
                    .includes(this.state.filter.toLowerCase())
                )}
                getGoals={() => {
                  this.getGoals();
                }}
                permission={this.props.permission}
              ></GoalsTable>{" "}
            </Fragment>
          ) : (
            <Fragment>
              <div className="loading"></div>
            </Fragment>
          )}
        </>
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
