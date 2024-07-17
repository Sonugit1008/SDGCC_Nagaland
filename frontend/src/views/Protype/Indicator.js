import React, { Component, Fragment } from "react";
import PageHeader from "../common/PageHeader";
import { connect } from "react-redux";
import { Table, Label, Row } from "reactstrap";
import apiAuth from "../../helpers/ApiAuth";
import { NotificationManager } from "../../components/common/react-notifications";


class ViewIndicator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: "",
      districts: [],
      states: [],
      display: localStorage.getItem("districts")
        ? localStorage.getItem("districts")
        : "card",
    };
  }

  componentDidMount() {
    this.getStates();
  }

  getStates = () => {
    let url = "/api/state/";
    apiAuth
      .get(url)
      .then((response) => {
        let states = response.data;

        this.setState({ states: states }, () => {
          if (states.length > 0) {
            this.setState({
              selectedState: {
                label: states[0]?.name,
                value: states[0]?.id,
              },
            });

            this.getDistricts(states[0]?.id);
          }
        });
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

  getDistricts = (val) => {
    this.setState({ districts: [], loading: true });
    let url = "/api/district/?state=" + val;
    apiAuth
      .get(url)
      .then((response) => {
        let districts = response.data;

        this.setState({ districts: districts, loading: false });
      })
      .catch(function (error) {
        console.log(error.response?.data);
        console.log(error.response?.status);
        console.log(error.response?.headers);
        NotificationManager.error(
          error.response?.data?.detail,
          `Get District Error ${error.response?.status}`,
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
          heading={"Indicator"}
          is_filter={true}
          filter_func={(text) => this.setState({ filter: text, activePage: 0 })}
          history={this.props.history}
          match={this.props.match}
          add_new={this.props.permission?.write}
          add_new_url={"/app/protype/addindicatorvalue/"}
          back_button={false}
          changeDisplay={(val) => {
            this.setState({ display: val });
          }}
        ></PageHeader>
        
        {this.state.districts.length ? (
          <Fragment>
           <Table striped bordered hover>
      <thead>
        <tr>
          <th>Sr .No</th>
          <th>Goal</th>
          <th>Department</th>
          <th>Inicator</th>
          <th>Percentage/Number/Ratio</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>Mark</td>
          <td>Mark</td>
          <td>Otto</td>
          <td>@mdo</td>
        </tr>
      </tbody>
    </Table>
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

export default connect(mapStateToProps, mapActionsToProps)(ViewIndicator);
