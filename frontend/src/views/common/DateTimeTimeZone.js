import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import moment from "moment-timezone";

class DateTimeTimeZone extends Component {
  render() {
    return (
      <Fragment>
        {moment(this.props.time_)
          .tz(this.props.timezone)
          .format("DD-MM-YY HH:mm:ss")}
      </Fragment>
    );
  }
}

const mapStateToProps = ({ authUser }) => {
  const { timezone } = authUser;

  return {
    timezone: timezone,
  };
};

export default connect(mapStateToProps, null)(DateTimeTimeZone);
