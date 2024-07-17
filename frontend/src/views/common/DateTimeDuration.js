import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Date } from "sugar-date";

class DateTimeDuration extends Component {
  render() {
    return (
      <Fragment>
        {this.props.end_time ? (
          Date.hoursAgo(
            Date.create(this.props.start_time),
            Date.create(this.props.end_time)
          )
        ) : (
          <Fragment> </Fragment>
        )}
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

export default connect(mapStateToProps, null)(DateTimeDuration);
