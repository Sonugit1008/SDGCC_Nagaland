import React, { Fragment } from "react";
import { Scatter } from "react-chartjs-2";

class ScatterChart extends React.Component {
  render() {
    return (
      <Fragment>
        {this.props.data ? (
          <Fragment>
            <Scatter
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

export default ScatterChart;
