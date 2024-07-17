import React, { Component, Fragment } from "react";
import PageHeader from "../common/PageHeader";
import { connect } from "react-redux";
import SchemeTable from "./SchemeTable";
import { Row } from "reactstrap";
import { ExportToExcel } from "../common/ExportToExcel";
import apiAuth from "../../helpers/ApiAuth";
import { NotificationManager } from "../../components/common/react-notifications";

class ViewSchemes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: "",
      schemes: [],
      indicators: [],
      display: localStorage.getItem("schemes")
        ? localStorage.getItem("schemes")
        : "card",
    };
  }

  componentDidMount() {
    this.getSchemes();
  }

  getSchemes = () => {
    let url = "/api/scheme/";
    this.setState({ loading: true });
    apiAuth
      .get(url)
      .then((response) => {
        let schemes = response.data;
        this.setState({ schemes: schemes, loading: false });
      })
      .catch(function (error) {
        console.log(error.response?.data);
        console.log(error.response?.status);
        console.log(error.response?.headers);
        NotificationManager.error(
          error.response?.data?.detail,
          `Get Scheme Error ${error.response?.status}`,
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
          heading={"Schemes"}
          is_filter={true}
          filter_func={(text) => this.setState({ filter: text, activePage: 0 })}
          history={this.props.history}
          match={this.props.match}
          add_new={this.props.permission?.write}
          add_new_url={"/app/scheme/add"}
          back_button={false}
          changeDisplay={(val) => {
            this.setState({ display: val });
          }}
        ></PageHeader>
        {this.state.schemes.length > 0 ? (
          <Fragment>
            <Row className="d-flex justify-content-end my-2">
              <ExportToExcel
                apiData={this.state.schemes.map((user) => {
                  const { name, description, scheme_comment } = user;
                  return {
                    "Scheme Name": name,
                    "Scheme Description": description,
                    "Scheme Comment": scheme_comment,
                  };
                })}
                fileName={"schemesData"}
              />
            </Row>
            <SchemeTable
              schemes={this.state.schemes.filter((dept) =>
                dept.name
                  .toLowerCase()
                  .includes(this.state.filter.toLowerCase())
              )}
              getSchemes={() => {
                this.getSchemes();
              }}
              permission={this.props.permission}
            ></SchemeTable>{" "}
          </Fragment>
        ) : (
          <Fragment>
            {this.state.loading ? <div className="loading"></div> : <></>}
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

export default connect(mapStateToProps, mapActionsToProps)(ViewSchemes);
