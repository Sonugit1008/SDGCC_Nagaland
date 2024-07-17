import React, { Component } from "react";

import { Button, Card, CardBody, ButtonGroup } from "reactstrap";
import { Bar } from "react-chartjs-2";
import {
  peopleCountWiseBar,
  peopleOccupancyWiseBar,
  AgeGenderEmotionWiseBar,
  ParkingyWiseBar,
} from "./ChartProcessor";
import { Fragment } from "react";

class DashBarChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMode: "sector",
      selector: "age",
    };
  }

  render() {
    return (
      <Card>
        <CardBody>
          <h2>
            <span className="ml-3 mt-3">{this.props.title}</span>
            {this.props.mode === "agegenderemotion" ? (
              <ButtonGroup className="float-right ml-4 mb-4">
                <Button
                  className="btn-header-light"
                  onClick={() => {
                    this.setState({ selector: "age" });
                  }}
                  active={this.state.selector === "age"}
                  size="sm"
                  value="Emotion"
                >
                  Age
                </Button>
                <Button
                  className="btn-header-light"
                  onClick={() => {
                    this.setState({ selector: "gender" });
                  }}
                  active={this.state.selector === "gender"}
                  size="sm"
                  value="Emotion"
                >
                  Gender
                </Button>
                <Button
                  className="btn-header-light"
                  onClick={() => {
                    this.setState({ selector: "emotion" });
                  }}
                  active={this.state.selector === "emotion"}
                  size="sm"
                  value="Emotion"
                >
                  Emotion
                </Button>
              </ButtonGroup>
            ) : (
              <Fragment></Fragment>
            )}

            <ButtonGroup className="float-right ml-4 mb-4">
              {this.props.mode === "peopleoccupancy" ? (
                <Button
                  className="btn-header-light"
                  onClick={() => {
                    this.setState({ currentMode: "zone_id" });
                  }}
                  active={this.state.currentMode === "zone_id"}
                  size="sm"
                  value="Zone"
                >
                  Zone
                </Button>
              ) : (
                <Fragment></Fragment>
              )}

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
          </h2>
          {this.props.mode === "peoplecount" ? (
            <Bar
              {...peopleCountWiseBar(
                this.state.currentMode,
                this.props.dashData,
                this.props.sector,
                this.props.floor,
                this.props.facility
              )}
            />
          ) : (
            <Fragment></Fragment>
          )}

          {this.props.mode === "peopleoccupancy" ? (
            <Bar
              height={75}
              {...peopleOccupancyWiseBar(
                this.state.currentMode,
                this.props.dashData,
                this.props.sector,
                this.props.floor,
                this.props.facility
              )}
            />
          ) : (
            <Fragment></Fragment>
          )}

          {this.props.mode === "agegenderemotion" ? (
            <Bar
              height={60}
              {...AgeGenderEmotionWiseBar(
                this.state.currentMode,
                this.state.selector,
                this.props.dashData,
                this.props.sector
              )}
            />
          ) : (
            <Fragment></Fragment>
          )}

          {this.props.mode === "parking" ? (
            <Bar
              height={75}
              {...ParkingyWiseBar(
                this.state.currentMode,
                this.props.dashData,
                this.props.sector,
                this.props.floor,
                this.props.facility
              )}
            />
          ) : (
            <Fragment></Fragment>
          )}
        </CardBody>
      </Card>
    );
  }
}

DashBarChart.propTypes = {
  // gets the log list
  // get display attribute/s
};

export default DashBarChart;
