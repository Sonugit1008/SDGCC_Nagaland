import React, { Fragment } from "react";
import { Bar } from "react-chartjs-2";

class BarChart extends React.Component {
  render() {
    return (
      <Fragment>
        {this.props.data ? (
          <Fragment>
            <Bar
              data={this.props.data}
              height={this.props.height || 50}
              options={{
                indexAxis: "y",
                maintainAspectRatio: true,
                responsive: true,
              }}
            />
          </Fragment>
        ) : (
          <Fragment></Fragment>
        )}
      </Fragment>
    );
  }
}

export default BarChart;
