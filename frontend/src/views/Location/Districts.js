import React, { Component, Fragment } from "react";
import PageHeader from "../common/PageHeader";
import { connect } from "react-redux";
import { Col, Label, Row } from "reactstrap";
import { ExportToExcel } from "../common/ExportToExcel";
import apiAuth from "../../helpers/ApiAuth";
import { NotificationManager } from "../../components/common/react-notifications";
import { Colxx } from "../../components/common/CustomBootstrap";
import Select from "react-select";
import DistrictTable from "./DistrictTable";

class ViewDistricts extends Component {
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
          heading={"Districts"}
          is_filter={true}
          filter_func={(text) => this.setState({ filter: text, activePage: 0 })}
          history={this.props.history}
          match={this.props.match}
          add_new={this.props.permission?.write}
          add_new_url={"/app/district/add"}
          back_button={false}
          changeDisplay={(val) => {
            this.setState({ display: val });
          }}
        ></PageHeader>
        <Row className="mt-4 ml-2">
          <Colxx lg="3">
            <div className="form-group">
              <Label htmlFor="policy">Select State</Label>

              <Select
                options={this.state.states.map((state) => {
                  return {
                    label: state.name,
                    value: state.id,
                  };
                })}
                value={this.state.selectedState}
                onChange={(val) => {
                  this.setState({ selectedState: val }, () => {
                    this.getDistricts(val.value);
                  });
                }}
              />
            </div>
          </Colxx>
          <Colxx lg="9">
            <Row className="d-flex justify-content-end my-2">
              <ExportToExcel
                apiData={this.state.districts.map((dist) => {
                  const { name } = dist;
                  return {
                    "State Name": this.state.selectedState?.label,
                    "District Name": name,
                  };
                })}
                fileName={"DistrictsData"}
              />
            </Row>
          </Colxx>
        </Row>
        {this.state.districts.length ? (
          <Fragment>
            <DistrictTable
              districts={this.state.districts.filter((dept) =>
                dept.name
                  .toLowerCase()
                  .includes(this.state.filter.toLowerCase())
              )}
              getDistricts={() => {
                this.getDistricts(this.state.selectedState?.value);
              }}
            ></DistrictTable>{" "}
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

export default connect(mapStateToProps, mapActionsToProps)(ViewDistricts);
