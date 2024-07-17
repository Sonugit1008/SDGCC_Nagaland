import React, { Component, Fragment } from "react";
import PageHeader from "../common/PageHeader";
import { connect } from "react-redux";
import { Card, Label, Row } from "reactstrap";
import { Colxx } from "../../components/common/CustomBootstrap";
import Select from "react-select";
import apiAuth from "../../helpers/ApiAuth";
import { NotificationManager } from "../../components/common/react-notifications";
import _ from "lodash";
import Table from "../common/Table";
import { ExportToExcel } from "../common/ExportToExcel";
class DeptScheme extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: "",
      reports: [],
      column_list: [
        {
          Header: "Department",
          accessor: "department",
        },
        {
          Header: "Scheme",
          accessor: "scheme",
        },
        {
          Header: "Goal",
          accessor: "goal",
        },
        {
          Header: "Indicator",
          accessor: "name",
        },
      ],
    };
  }

  componentDidMount() {
    this.getReports();
  }

  getReports = () => {
    this.setState({ loadingData: true });
    apiAuth
      .get("/api/indicator/view/")
      .then((response) => {
        let reports = response.data
          .map((ind) => {
            ind["indicator_type"] = ind.type === "SIF" ? "State" : "District";

            return ind;
          })
          .filter((dd) =>
            this.props.department?.length > 0
              ? this.props.department?.includes(dd.department)
              : true
          );
        reports = _.sortBy(reports, "id");
        this.setState({ reports, loadingData: false });
      })
      .catch(function (error) {
        console.log(error.response?.data);
        console.log(error.response?.status);
        console.log(error.response?.headers);
        NotificationManager.error(
          error.response?.data?.detail,
          `Get Report Error ${error.response?.status}`,
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
          heading={"Department Scheme"}
          is_filter={true}
          filter_func={(text) => this.setState({ filter: text, activePage: 0 })}
          history={this.props.history}
          match={this.props.match}
          back_button={true}
          changeDisplay={(val) => {
            this.setState({ display: val });
          }}
        ></PageHeader>
        {this.state.reports?.length > 0 ? (
          <>
            {this.state.reports.length ? (
              <Fragment>
                <Row className="d-flex justify-content-end">
                  <Colxx xs="1" className="px-3 mr-4">
                    <ExportToExcel
                      apiData={this.state.reports.map((data) => {
                        const { name, department, goal, scheme } = data;
                        return {
                          Department: department,
                          Scheme: scheme,
                          Goal: goal,
                          Indicator: name,
                        };
                      })}
                      fileName={`DepartmentSchemesReport`}
                    />
                  </Colxx>
                </Row>
                <Row className="rounded mt-1 ml-2">
                  <Card>
                    <Table
                      columns={this.state.column_list}
                      data={this.state.reports}
                      dataUpdateFunction={(data) =>
                        this.props.updateMyData(data)
                      }
                      tableIndex={"deptSchemeTableIndex"}
                      noPagination={
                        this.state.reports?.length > 10 ? false : true
                      }
                      columnFilter={[
                        { name: "Scheme", dropDown: false },
                        { name: "Goal", dropDown: false },
                        { name: "Indicator", dropDown: false },
                        { name: "Department", dropDown: false },
                      ]}
                    />
                  </Card>
                </Row>
              </Fragment>
            ) : (
              <Fragment>
                <div className=""></div>
              </Fragment>
            )}
          </>
        ) : (
          <>
            {this.state.loadingData ? (
              <div className="loading"></div>
            ) : (
              <div className=""></div>
            )}
          </>
        )}
      </Fragment>
    );
  }
}

const mapStateToProps = ({ authUser }) => {
  const { timezone, department } = authUser;
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
    department,
  };
};

const mapActionsToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapActionsToProps)(DeptScheme);
