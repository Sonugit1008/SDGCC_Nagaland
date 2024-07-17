import React, { Component, Fragment } from "react";
import PageHeader from "../common/PageHeader";
import { connect } from "react-redux";
import DepartmentTable from "./DepartmentTable";
import { NotificationManager } from "../../components/common/react-notifications";
import apiAuth from "../../helpers/ApiAuth";
import { ExportToExcel } from "../common/ExportToExcel";
import { Row } from "reactstrap";

import _ from "lodash";

class ViewDepartments extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: "",
      states: [],
      // departments: [
      //   {
      //     name: "Food & Civil Supplies",
      //     goals: 5,
      //     targets: 7,
      //     indicators: 3,
      //     updated_at: "20-02-2022 09:30:00",
      //   },
      //   {
      //     name: "RD",
      //     goals: 4,
      //     targets: 7,
      //     indicators: 6,
      //     updated_at: "20-02-2022 10:30:00",
      //   },
      //   {
      //     name: "SW",
      //     goals: 6,
      //     targets: 7,
      //     indicators: 8,
      //     updated_at: "20-02-2022 11:30:00",
      //   },
      //   {
      //     name: "H&FW",
      //     goals: 3,
      //     targets: 7,
      //     indicators: 26,
      //     updated_at: "20-02-2022 12:30:00",
      //   },
      //   {
      //     name: "PHED",
      //     goals: 7,
      //     targets: 7,
      //     indicators: 9,
      //     updated_at: "20-02-2022 13:30:00",
      //   },
      // ],
      departments: [],
      display: localStorage.getItem("departments")
        ? localStorage.getItem("departments")
        : "card",
    };

    this.getDepartments = this.getDepartments.bind(this);
  }

  componentDidMount() {
    this.getDepartments();
  }

  getDepartments() {
    let url = "/api/department/view/";
    apiAuth
      .get(url)
      .then(async (response) => {
        let departments = response.data;

        departments = departments.map((dept) => {
          let dept_indicator = dept.indicator ? dept.indicator : [];
          dept["indicators"] = dept_indicator.length;

          let goals = _.uniqWith(
            dept_indicator.map((ind) => {
              return ind.goal;
            }),
            _.isEqual
          );

          dept["goals"] = goals.length;
          dept["users"] = dept.users?.length;

          return dept;
        });

        this.setState({ departments: departments });
      })
      .catch(function (error) {
        console.log(error.response?.data);
        console.log(error.response?.status);
        console.log(error.response?.headers);
        NotificationManager.error(
          error.response?.data?.detail,
          `Get Department Error ${error.response?.status}`,
          3000,
          null,
          null,
          ""
        );
      });
  }

  render() {
    return (
      <Fragment>
        <PageHeader
          heading={"Departments"}
          is_filter={true}
          filter_func={(text) => this.setState({ filter: text, activePage: 0 })}
          history={this.props.history}
          match={this.props.match}
          add_new={this.props.permission?.write}
          add_new_url={"/app/department/add/"}
          // back_button={true}
          changeDisplay={(val) => {
            this.setState({ display: val });
          }}
        ></PageHeader>
        {this.state.departments.length > 0 ? (
          <Fragment>
            <Row className="d-flex justify-content-end my-2">
              <ExportToExcel
                apiData={this.state.departments.map((dept) => {
                  const { name, state, goals, users, indicators } = dept;
                  return {
                    "Department Name": name,
                    State: state,
                    "Total Users": users,
                    "Total Goals": goals,
                    "Total Indicators": indicators,
                  };
                })}
                fileName={"departmentsData"}
              />
            </Row>{" "}
            <DepartmentTable
              departments={this.state.departments.filter((dept) =>
                dept.name
                  .toLowerCase()
                  .includes(this.state.filter.toLowerCase())
              )}
              getDepartments={() => {
                this.getDepartments();
              }}
            ></DepartmentTable>{" "}
          </Fragment>
        ) : (
          <Fragment>
            <div className="loading"></div>
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

export default connect(mapStateToProps, mapActionsToProps)(ViewDepartments);
