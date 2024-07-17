import React, { Fragment } from "react";
import { Bar } from "react-chartjs-2";

class HorizontalBarChart extends React.Component {
  render() {
    return (
      <Fragment>
        {this.props.data ? (
          <Fragment>
            <Bar
              data={this.props.data}
              height={this.props.height || 50}
              options={{
                maintainAspectRatio: true,
                responsive: true,
                indexAxis: "y",
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

export default HorizontalBarChart;
