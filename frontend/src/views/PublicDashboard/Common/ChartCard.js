import React from "react";
import "./styles.css";
import { Row, Card } from "react-bootstrap";
import { Colxx } from "../Common/CustomBootstrap";
import Select from "react-select";
import Menu from "../assets/menu.png";
import BarChart from "./BarChart";
import {
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

import VerticlBar from "../assets/chart/bar.svg";
// import HorizontalBar from "../assets/chart/horizontalbar.svg";
import Pie from "../assets/chart/pie.svg";
import Scatter from "../assets/chart/line.svg";
import Area from "../assets/chart/area.svg";
import Download from "../assets/chart/download.svg";
import Expand from "../assets/chart/expand.svg";
import ScatterChart from "./ScatterChart";
import PieChart from "./PieChart";
import PolarAreaChart from "./PolarAreaChart";

export default class ChartCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Row>
        <Card className="rounded">
          <Row
            className="w-100 bg-danger m-0 rounded-top"
            style={{ height: "20px" }}
          ></Row>
          <div className="p-4">
            <Row className="m-0 p-0">
              <h6 className="text-justify font-weight-bold">
                Proportion of population living below the national poverty line
              </h6>
            </Row>
            <h6>Percent</h6>
            <Row>
              <Colxx sm="4" className="mb-0 border-right border-info">
                <div className="">
                  <Select
                    options={[
                      {
                        label: "Nagaland",
                        value: "Nagaland",
                      },
                    ]}
                    value={{
                      label: "Nagaland",
                      value: "Nagaland",
                    }}
                    onChange={(data) => {}}
                  />
                </div>
              </Colxx>
              <Colxx sm="4" className="mb-0">
                <div className="">
                  <Select
                    options={[
                      {
                        label: "Most Recent",
                        value: "Most Recent",
                      },
                      {
                        label: "2020",
                        value: "2020",
                      },
                      {
                        label: "2019",
                        value: "2019",
                      },
                    ]}
                    value={{
                      label: "Most Recent",
                      value: "Most Recent",
                    }}
                    onChange={(data) => {}}
                  />
                </div>
              </Colxx>
              {/* <Colxx sm="4" className="mb-0"></Colxx> */}
              <Colxx sm="4" className="mb-0 d-flex justify-content-end">
                {/* <img
                  className="view"
                  style={{ width: "24px", height: "20px", cursor: "pointer" }}
                  src={Menu}
                  alt=""
                /> */}
                <UncontrolledButtonDropdown color="link" direction="bottom">
                  <DropdownToggle
                    color="link"
                    style={{ color: "rgb(50, 50, 50)" }}
                    className="p-0 font-weight-bold text-center"
                  >
                    <img
                      className="view"
                      style={{
                        width: "24px",
                        height: "20px",
                        cursor: "pointer",
                      }}
                      src={Menu}
                      alt=""
                    />
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem
                      onClick={() => {
                        this.props.setChart("Scatter");
                      }}
                    >
                      <img
                        className="view"
                        style={{
                          width: "24px",
                          height: "20px",
                          cursor: "pointer",
                        }}
                        src={Scatter}
                        alt=""
                      />
                    </DropdownItem>
                    <DropdownItem
                      onClick={() => {
                        this.props.setChart("VerticlBar");
                      }}
                    >
                      <img
                        className="view"
                        style={{
                          width: "24px",
                          height: "20px",
                          cursor: "pointer",
                        }}
                        src={VerticlBar}
                        alt=""
                      />
                    </DropdownItem>
                    <DropdownItem
                      onClick={() => {
                        this.props.setChart("Area");
                      }}
                    >
                      <img
                        className="view"
                        style={{
                          width: "24px",
                          height: "20px",
                          cursor: "pointer",
                        }}
                        src={Area}
                        alt=""
                      />
                    </DropdownItem>
                    <DropdownItem
                      onClick={() => {
                        this.props.setChart("Pie");
                      }}
                    >
                      <img
                        className="view"
                        style={{
                          width: "24px",
                          height: "20px",
                          cursor: "pointer",
                        }}
                        src={Pie}
                        alt=""
                      />
                    </DropdownItem>
                    <DropdownItem
                      onClick={() => {
                        this.props.openModal();
                      }}
                    >
                      <img
                        className="view"
                        style={{
                          width: "24px",
                          height: "20px",
                          cursor: "pointer",
                        }}
                        src={Expand}
                        alt=""
                      />
                    </DropdownItem>
                    <DropdownItem
                      onClick={() => {
                        this.props.downloadData();
                      }}
                    >
                      <img
                        className="view"
                        style={{
                          width: "24px",
                          height: "20px",
                          cursor: "pointer",
                        }}
                        src={Download}
                        alt=""
                      />
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledButtonDropdown>
              </Colxx>
            </Row>
            <Row className="mt-2">
              {this.props.selectedChart === "Scatter" ? (
                <ScatterChart height={200} data={this.props.data} />
              ) : this.props.selectedChart === "Pie" ? (
                <PieChart height={200} data={this.props.data} />
              ) : this.props.selectedChart === "Area" ? (
                <PolarAreaChart height={200} data={this.props.data} />
              ) : (
                <BarChart height={200} data={this.props.data} />
              )}
            </Row>
          </div>
        </Card>
      </Row>
    );
  }
}
