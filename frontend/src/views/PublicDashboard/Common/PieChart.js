import React, { Fragment } from "react";
import { Pie } from "react-chartjs-2";

class PieChart extends React.Component {
  render() {
    return (
      <Fragment>
        {this.props.data ? (
          <Fragment>
            <Pie
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

export default PieChart;
