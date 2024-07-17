import React, { Component, Fragment } from "react";
import PageHeader from "../common/PageHeader";
import { connect } from "react-redux";
import LocationTable from "./LocationTable";
import { Row } from "reactstrap";
import { ExportToExcel } from "../common/ExportToExcel";
import apiAuth from "../../helpers/ApiAuth";
import { NotificationManager } from "../../components/common/react-notifications";

class ViewLocations extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: "",
      locations: [],
      districts: [],
      display: localStorage.getItem("locations")
        ? localStorage.getItem("locations")
        : "card",
    };
  }

  componentDidMount() {
    this.getDistricts();
  }

  getDistricts = () => {
    let url = "/api/district/";
    apiAuth
      .get(url)
      .then((response) => {
        let districts = response.data;

        this.setState({ districts: districts }, () => {
          this.getLocations();
        });
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

  getLocations = () => {
    let url = "/api/location/";
    apiAuth
      .get(url)
      .then((response) => {
        let districtDB = new Map();
        this.state.districts.forEach((dist) => {
          districtDB.set(dist.id, dist.name);
        });
        let locations = response.data.map((data) => {
          data.district = districtDB.get(data.district);
          return data;
        });

        this.setState({ locations: locations, loading: false });
      })
      .catch(function (error) {
        console.log(error.response?.data);
        console.log(error.response?.status);
        console.log(error.response?.headers);
        NotificationManager.error(
          error.response?.data?.detail,
          `Get Location Error ${error.response?.status}`,
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
          heading={"Locations"}
          is_filter={true}
          filter_func={(text) => this.setState({ filter: text, activePage: 0 })}
          history={this.props.history}
          match={this.props.match}
          add_new={this.props.permission?.write}
          add_new_url={"/app/location/add"}
          back_button={false}
          changeDisplay={(val) => {
            this.setState({ display: val });
          }}
        ></PageHeader>
        {this.state.locations.length ? (
          <Fragment>
            <Row className="d-flex justify-content-end my-2">
              <ExportToExcel
                apiData={this.state.locations.map((user) => {
                  const {
                    name,
                    latitude,
                    longitude,
                    pincode,
                    district,
                    description,
                  } = user;
                  return {
                    "Location Name": name,
                    Latitude: latitude,
                    Longitude: longitude,
                    District: district,
                    Pincode: pincode,
                    "Location Description": description,
                  };
                })}
                fileName={"locationsData"}
              />
            </Row>
            <LocationTable
              locations={this.state.locations.filter((dept) =>
                dept.name
                  .toLowerCase()
                  .includes(this.state.filter.toLowerCase())
              )}
            ></LocationTable>{" "}
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

export default connect(mapStateToProps, mapActionsToProps)(ViewLocations);
