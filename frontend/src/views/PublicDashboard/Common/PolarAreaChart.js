import React, { Fragment } from "react";
import { PolarArea } from "react-chartjs-2";

class PolarAreaChart extends React.Component {
  render() {
    return (
      <Fragment>
        {this.props.data ? (
          <Fragment>
            <PolarArea
              data={this.props.data}
              height={this.props.height || 50}
              options={{
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

export default PolarAreaChart;
