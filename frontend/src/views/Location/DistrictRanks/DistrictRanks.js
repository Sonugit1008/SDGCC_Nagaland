import React, { Component, Fragment } from "react";
import PageHeader from "../../common/PageHeader";
import { connect } from "react-redux";
import { Col, Label, Row } from "reactstrap";
import { ExportToExcel } from "../../common/ExportToExcel";
import apiAuth from "../../../helpers/ApiAuth";
import { NotificationManager } from "../../../components/common/react-notifications";
import { Colxx } from "../../../components/common/CustomBootstrap";
import Select from "react-select";
import DistrictRankTable from "./DistrictRankTable";
import _ from "lodash";

class ViewDistrictRanks extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: "",
      districts: [],
      states: [],
      selectedYear: {
        label: 2022,
        value: 2022,
      },
    };
  }

  componentDidMount() {
    this.getDistricts();
  }

  getDistricts = (val) => {
    this.setState({ districts: [], loading: true });
    let url = "/api/rank/view";
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
          `Get District Rank Error ${error.response?.status}`,
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
          heading={"District Rank"}
          is_filter={true}
          filter_func={(text) => this.setState({ filter: text, activePage: 0 })}
          history={this.props.history}
          match={this.props.match}
          add_new={this.props.permission?.write}
          add_new_url={"/app/districtrank/add"}
          back_button={false}
          
        ></PageHeader>
        <Row className="mt-4 ml-2">
          <Colxx lg="3">
            <div className="form-group">
              <Label htmlFor="policy">Select Year</Label>

              <Select
                options={_.unionBy(
                  this.state.districts.map((dt) => dt.year)
                ).map((state) => {
                  return {
                    label: state,
                    value: state,
                  };
                })}
                value={this.state.selectedYear}
                onChange={(val) => {
                  this.setState({ selectedYear: val });
                }}
              />
            </div>
          </Colxx>
          <Colxx lg="9">
            <Row className="d-flex justify-content-end my-2">
              <ExportToExcel
                apiData={this.state.districts.map((dist) => {
                  const { district, year, rank } = dist;
                  return {
                    "District Name": district,
                    Year: year,
                    Rank: rank,
                  };
                })}
                fileName={"DistrictRankData"}
              />
            </Row>
          </Colxx>
        </Row>
        {this.state.districts.length ? (
          <Fragment>
            <DistrictRankTable
              districts={this.state.districts
                .filter((dt) => dt.year === this.state.selectedYear?.value)
                .filter((dept) =>
                  dept.district
                    .toLowerCase()
                    .includes(this.state.filter.toLowerCase())
                )}
              getDistricts={() => {
                this.getDistricts();
              }}
            ></DistrictRankTable>
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

export default connect(mapStateToProps, mapActionsToProps)(ViewDistrictRanks);
