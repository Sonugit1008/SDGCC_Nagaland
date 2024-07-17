import React, { Component, Fragment } from "react";

import { Button, Card, CardBody, ButtonGroup } from "reactstrap";
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import { connect } from "react-redux";
import { ANPRTimeWiseBarLine } from "./ChartProcessor";

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip
);

// const labels = ["January", "February", "March", "April", "May", "June", "July"];

// export const data = {
//   labels,
//   datasets: [
//     {
//       type: "line",
//       label: "Dataset 1",
//       borderColor: "rgb(255, 99, 132)",
//       borderWidth: 2,
//       fill: false,
//       data: [10, 8, 12, 15, 19, 25, 24],
//     },
//     {
//       type: "bar",
//       label: "Dataset 2",
//       backgroundColor: "rgb(75, 192, 192)",
//       data: [5, 4, 12, 8, 9, 12, 13],
//       borderColor: "white",
//       borderWidth: 2,
//     },
//   ],
// };

class ComboLineBarChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMode: "facility",
      countDirection: "count_in",
    };
  }

  render() {
    return (
      <Card>
        <CardBody>
          <h2>
            <span className="ml-3 mt-3">{this.props.title}</span>
          </h2>
          <Chart
            type="bar"
            height={this.props.height || 100}
            {...ANPRTimeWiseBarLine(
              this.props.currentMode,
              this.props.dashData,
              this.props.sector,
              this.state.countDirection,
              this.props.label
            )}
          />
        </CardBody>
      </Card>
    );
  }
}

ComboLineBarChart.propTypes = {};

const mapStateToProps = ({ authUser }) => {
  const { timezone } = authUser;

  return {
    timezone: timezone,
  };
};

export default connect(mapStateToProps, null)(ComboLineBarChart);
