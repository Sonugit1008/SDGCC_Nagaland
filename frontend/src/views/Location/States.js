import React, { Component, Fragment } from "react";
import PageHeader from "../common/PageHeader";
import { connect } from "react-redux";
import { Label, Row } from "reactstrap";
import { ExportToExcel } from "../common/ExportToExcel";
import apiAuth from "../../helpers/ApiAuth";
import { NotificationManager } from "../../components/common/react-notifications";
import { Colxx } from "../../components/common/CustomBootstrap";
import StateTable from "./StateTable";

class ViewStates extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: "",

      states: [],
      display: localStorage.getItem("states")
        ? localStorage.getItem("states")
        : "card",
    };
  }

  componentDidMount() {
    this.getStates();
  }

  getStates = () => {
    this.setState({ loading: true });
    let url = "/api/state/";
    apiAuth
      .get(url)
      .then((response) => {
        let states = response.data;
        this.setState({ states: states, loading: false });
      })
      .catch(function (error) {
        console.log(error.response?.data);
        console.log(error.response?.status);
        console.log(error.response?.headers);
        NotificationManager.error(
          error.response?.data?.detail,
          `Get State Error ${error.response?.status}`,
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
          heading={"States"}
          is_filter={true}
          filter_func={(text) => this.setState({ filter: text, activePage: 0 })}
          history={this.props.history}
          match={this.props.match}
          add_new={this.props.permission?.write}
          add_new_url={"/app/state/add"}
          back_button={false}
          changeDisplay={(val) => {
            this.setState({ display: val });
          }}
        ></PageHeader>
        <Row className="mt-4 ml-2">
          <Colxx lg="3"></Colxx>
          <Colxx lg="9">
            <Row className="d-flex justify-content-end my-2">
              <ExportToExcel
                apiData={this.state.states.map((st) => {
                  const { name } = st;
                  return {
                    "State Name": name,
                  };
                })}
                fileName={"StatesData"}
              />
            </Row>
          </Colxx>
        </Row>
        {this.state.states.length ? (
          <Fragment>
            <StateTable
              states={this.state.states.filter((dept) =>
                dept.name
                  .toLowerCase()
                  .includes(this.state.filter.toLowerCase())
              )}
              getStates={() => {
                this.getStates();
              }}
            ></StateTable>{" "}
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

export default connect(mapStateToProps, mapActionsToProps)(ViewStates);
