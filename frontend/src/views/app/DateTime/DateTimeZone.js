import moment from "moment-timezone";
import nontz_moment from "moment";
import Datetime from "react-datetime";
import React, { Component } from "react";
import { connect } from "react-redux";

class DateTimeZone extends Component {
  constructor(props) {
    super(props);

    this.state = {
      startdate: props.defaultDate,
    };

    this.handleChange = this.handleChange.bind(this);
    if (this.state.startdate) {
      this.handleChange(props.defaultDate);
    }
  }

  handleChange(date) {
    this.setState({
      startdate: date,
    });

    var start_str = nontz_moment(this.state.startdate).format(
      "YYYY-MM-DD HH:mm:SS"
    );
    console.log(start_str);
    var start_date = moment
      .tz(start_str, this.props.timezone)
      .utc()
      .toISOString();
    console.log(start_date);

    this.props.handleChange(start_date);
  }

  render() {
    return (
      <Datetime
        defaultValue={this.state.startdate}
        onChange={this.handleChange}
        className={this.props.className}
      />
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
export default connect(mapStateToProps, mapActionsToProps)(DateTimeZone);
