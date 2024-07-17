import React from "react";
import "./Header.css";
import { Row } from "react-bootstrap";
import { Colxx } from "../Common/CustomBootstrap";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTable, faChartLine } from "@fortawesome/free-solid-svg-icons";
import Switch from "react-toggle-switch";

export default class SubHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Row className="mt-4 d-flex justify-content-end">
        {this.props.isSDGNER ? (
          <>
            <Colxx sm="5"></Colxx>
          </>
        ) : (
          <>
            <Colxx
              onClick={() => {
                this.props.setSubTab("dashboard");
              }}
              sm="1"
              className={[
                "font-weight-bold  d-flex justify-content-center align-items-center cursor-pointer",
                this.props.subtab === "dashboard" ? "h6 text-primary" : "h6",
              ].join(" ")}
            >
              Dashboard
            </Colxx>
            <Colxx
              onClick={() => {
                this.props.setSubTab("stategraph");
              }}
              sm="1"
              className={[
                "font-weight-bold  d-flex justify-content-center align-items-center cursor-pointer",
                this.props.subtab === "stategraph" ? "h6 text-primary" : "h6",
              ].join(" ")}
            >
              State Chart
            </Colxx>
            <Colxx
              onClick={() => {
                this.props.setSubTab("statescore");
              }}
              sm="1"
              className={[
                "font-weight-bold  d-flex justify-content-center align-items-center cursor-pointer",
                this.props.subtab === "statescore" ? "h6 text-primary" : "h6",
              ].join(" ")}
            >
              State Indicators
            </Colxx>
            <Colxx
              onClick={() => {
                this.props.setSubTab("distscore");
              }}
              sm="1"
              className={[
                "font-weight-bold  d-flex justify-content-center align-items-center cursor-pointer",
                this.props.subtab === "distscore" ? "h6 text-primary" : "h6",
              ].join(" ")}
            >
              District Chart
            </Colxx>
            <Colxx
              onClick={() => {
                this.props.setSubTab("distgraph");
              }}
              sm="1"
              className={[
                "font-weight-bold  d-flex justify-content-center align-items-center cursor-pointer",
                this.props.subtab === "distgraph" ? "h6 text-primary" : "h6",
              ].join(" ")}
            >
              District Indicators
            </Colxx>
          </>
        )}
        <Colxx sm="3"></Colxx>
        <Colxx sm="2">
          <div className="form-group">
            <Select
              options={
                this.props.yearsOption
                  ? this.props.yearsOption.sort((a, b) => b - a) // Sort in descending order
                  .map((year) => {
                      return {
                        label: `${year}-${String(Number(year) + 1).slice(
                          2,
                          4
                        )}`,
                        value: year,
                      };
                    })
                  : []
              }
              value={this.props.selectedYear}
              onChange={(data) => {
                this.props.handleYear(data);
              }}
              // menuPortalTarget={document.body}
              // styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
            />
          </div>
        </Colxx>
        {/* {this.props.isSDGNER ? (
          <></>
        ) : (
          <Colxx
            sm="2"
            className="d-flex justify-content-center align-items-center"
          >
            <div className="d-flex">
              <p className="d-flex justify-content-center align-items-center mr-1">
                SIF
              </p>
              <Switch
                onClick={() => {
                  this.props.toggleDataType();
                }}
                on={this.props.displayType}
              />
              <p className="d-flex justify-content-center align-items-center ml-1">
                DIF
              </p>
            </div>
          </Colxx>
        )} */}

        <Colxx
          sm="1"
          className="d-flex justify-content-center align-items-center"
        >
          {/* <div className="border-right border-info p-1">
            <FontAwesomeIcon
              icon={faChartLine}
              className={this.props.viewFilter === "Dashboard" ? "view" : ""}
              style={{
                width: "32px",
                height: "28px",
                cursor: "pointer",
                opacity: 0.7,
              }}
              onClick={() => {
                this.props.setView("Dashboard");
              }}
            />
          </div> */}
          {/* <div className="p-1">
            {" "}
            <FontAwesomeIcon
              icon={faTable}
              style={{
                width: "32px",
                height: "28px",
                cursor: "pointer",
                opacity: 0.7,
              }}
              // eslint-disable-next-line
              className={this.props.viewFilter === "Table" ? "view" : ""}
              onClick={() => {
                this.props.setView("Table");
              }}
            />
          </div> */}
        </Colxx>
      </Row>
    );
  }
}
