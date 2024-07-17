import moment from "moment-timezone";

import React, { Component } from "react";
import { connect } from "react-redux";

class TZFormat extends Component {
  render() {
    return (
      <div>
        {moment(this.props.time)
          .tz(this.props.timezone)
          .format(this.props.format)}
      </div>
    );
  }
}

const mapStateToProps = ({ authUser }) => {
  const { timezone } = authUser;
  return {
    timezone: timezone,
  };
};

const mapActionsToProps = (dispatch) => {
  return {};
};
export default connect(mapStateToProps, mapActionsToProps)(TZFormat);
