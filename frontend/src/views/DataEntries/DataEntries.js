import React, { Component, Fragment } from "react";
import PageHeader from "../common/PageHeader";
import { connect } from "react-redux";
import DataEntryTable from "./DataEntryTable";
import { Row } from "reactstrap";
import { ExportToExcel } from "../common/ExportToExcel";

class ViewDataEntries extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: "",
      dataEntries: [
        {
          name: "Data 1",
          department: "Information Technology",
          goal: "Goal 1",
          target: "Target 1",
          indicator: "Indicator 1",
          updated_at: "20-02-2022 09:30:00",
          updated_by: "Manish Kumawat",
          location: "Nagaland",
        },
        {
          name: "Data 2",
          department: "Information Technology",
          goal: "Goal 2",
          target: "Target 2",
          indicator: "Indicator 2",
          updated_at: "20-02-2022 09:30:00",
          updated_by: "Manish Kumawat",
          location: "Nagaland",
        },
      ],
      display: localStorage.getItem("dataEntries")
        ? localStorage.getItem("dataEntries")
        : "card",
    };
  }

  render() {
    return (
      <Fragment>
        <PageHeader
          heading={"Data Entries"}
          is_filter={true}
          filter_func={(text) => this.setState({ filter: text, activePage: 0 })}
          history={this.props.history}
          match={this.props.match}
          //   add_new={true}
          //   add_new_url={"/app/event/view/add"}
          back_button={true}
          changeDisplay={(val) => {
            this.setState({ display: val });
          }}
        ></PageHeader>
        {this.state.dataEntries.length ? (
          <Fragment>
            <Row className="d-flex justify-content-end my-2">
              <ExportToExcel
                apiData={this.state.dataEntries.map((user) => {
                  const {
                    name,
                    goal,
                    target,
                    department,
                    indicator,
                    updated_at,
                    updated_by,
                    location,
                  } = user;
                  return {
                    "Entry Name": name,
                    Department: department,
                    Goal: goal,
                    Target: target,
                    Indicator: indicator,
                    "Updated Date": updated_at,
                    "Updated By": updated_by,
                    Location: location,
                  };
                })}
                fileName={"DataEntries"}
              />
            </Row>
            <DataEntryTable
              dataEntries={this.state.dataEntries.filter((dept) =>
                dept.name
                  .toLowerCase()
                  .includes(this.state.filter.toLowerCase())
              )}
            ></DataEntryTable>{" "}
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

  return {
    timezone,
  };
};

const mapActionsToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapActionsToProps)(ViewDataEntries);
