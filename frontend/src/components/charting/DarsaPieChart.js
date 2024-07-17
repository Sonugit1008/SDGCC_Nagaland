import React, { Component, Fragment } from "react";

import { Button, Card, CardBody, ButtonGroup, Row } from "reactstrap";
import { Pie } from "react-chartjs-2";
import { PeopleCountWisePie, AgeGenderEmotionWisePie } from "./ChartProcessor";
import { Colxx } from "../common/CustomBootstrap";

class DarsaPieChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMode: "sector",
      countDirection: "count_in",
    };
  }

  render() {
    return (
      <Card>
        <CardBody>
          <h2>
            <span className="ml-3 mt-3">{this.props.title}</span>

            {this.props.mode === "peoplecount" ? (
              <Fragment>
                <ButtonGroup className="ml-4 mb-4">
                  <Button
                    className="btn-header-light"
                    onClick={() => {
                      this.setState({ countDirection: "count_in" });
                    }}
                    active={this.state.countDirection === "count_in"}
                    size="sm"
                    value="Count IN"
                  >
                    In
                  </Button>
                  <Button
                    className="btn-header-light"
                    onClick={() => {
                      this.setState({ countDirection: "count_out" });
                    }}
                    active={this.state.countDirection === "count_out"}
                    size="sm"
                    value="Count Out"
                  >
                    Out
                  </Button>
                </ButtonGroup>
                <ButtonGroup className="float-right ml-4 mb-4">
                  <Button
                    className="btn-header-light"
                    onClick={() => {
                      this.setState({ currentMode: "sector" });
                    }}
                    active={this.state.currentMode === "sector"}
                    size="sm"
                    value="Sector"
                  >
                    Sector
                  </Button>
                  <Button
                    className="btn-header-light"
                    onClick={() => {
                      this.setState({ currentMode: "floor" });
                    }}
                    active={this.state.currentMode === "floor"}
                    size="sm"
                    value="Floor"
                  >
                    Floor
                  </Button>
                  <Button
                    className="btn-header-light"
                    onClick={() => {
                      this.setState({ currentMode: "facility" });
                    }}
                    active={this.state.currentMode === "facility"}
                    size="sm"
                    value="Facility"
                  >
                    Facility
                  </Button>
                </ButtonGroup>
              </Fragment>
            ) : (
              <Fragment></Fragment>
            )}
          </h2>
          <Row className="d-flex justify-content-center">
            <Colxx lg="6">
              {this.props.mode === "peoplecount" ? (
                <Pie
                  {...PeopleCountWisePie(
                    this.state.currentMode,
                    this.props.dashData,
                    this.props.sector,
                    this.state.countDirection
                  )}
                />
              ) : (
                <Fragment></Fragment>
              )}

              {this.props.mode === "agegenderemotion" ? (
                <Pie
                  {...AgeGenderEmotionWisePie(
                    this.props.selector,
                    this.props.dashData
                  )}
                />
              ) : (
                <Fragment></Fragment>
              )}
            </Colxx>
          </Row>
        </CardBody>
      </Card>
    );
  }
}

DarsaPieChart.propTypes = {};

export default DarsaPieChart;
