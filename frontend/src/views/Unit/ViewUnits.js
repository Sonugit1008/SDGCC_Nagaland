import React, { Component, Fragment } from "react";
import PageHeader from "../common/PageHeader";
import { connect } from "react-redux";
import UnitTable from "./UnitTable";
import { Row } from "reactstrap";
import { ExportToExcel } from "../common/ExportToExcel";
import apiAuth from "../../helpers/ApiAuth";
import { NotificationManager } from "../../components/common/react-notifications";

class ViewUnits extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: "",
      units: [],
      display: localStorage.getItem("units")
        ? localStorage.getItem("units")
        : "card",
    };
  }

  componentDidMount() {
    this.getUnits();
  }

  getUnits = () => {
    let url = "/api/unit/";
    apiAuth
      .get(url)
      .then((response) => {
        let units = response.data;

        this.setState({ units: units, loading: false });
      })
      .catch(function (error) {
        console.log(error.response?.data);
        console.log(error.response?.status);
        console.log(error.response?.headers);
        NotificationManager.error(
          error.response?.data?.detail,
          `Get Unit Error ${error.response?.status}`,
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
          heading={"Units"}
          is_filter={true}
          filter_func={(text) => this.setState({ filter: text, activePage: 0 })}
          history={this.props.history}
          match={this.props.match}
          add_new={this.props.permission?.write}
          add_new_url={"/app/unit/add/"}
          back_button={false}
          changeDisplay={(val) => {
            this.setState({ display: val });
          }}
        ></PageHeader>
        {this.state.units.length ? (
          <Fragment>
            <Row className="d-flex justify-content-end my-2">
              <ExportToExcel
                apiData={this.state.units.map((user) => {
                  const { name, type, value } = user;
                  return {
                    "Unit Name": name,
                    "Unit Type": type,
                    "Unit Value": value,
                  };
                })}
                fileName={"UnitsData"}
              />
            </Row>
            <UnitTable
              units={this.state.units.filter((dept) =>
                dept.name
                  .toLowerCase()
                  .includes(this.state.filter.toLowerCase())
              )}
            ></UnitTable>{" "}
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

export default connect(mapStateToProps, mapActionsToProps)(ViewUnits);
