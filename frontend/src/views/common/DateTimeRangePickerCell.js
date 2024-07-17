import React, { Component } from 'react';
import { Row, Button } from "reactstrap";
import DateTimeRangePicker from "@wojtekmaj/react-datetimerange-picker";

import { Colxx } from "../../components/common/CustomBootstrap";

class DateTimeRangePickerCell extends Component {
  render() {
    return (
      <Row mb="4">
        <Colxx lg="12">
          <Row className="">
            <Colxx lg={this.props.custom_dp_length || "7"}>
              <DateTimeRangePicker
                className="form-control"
                disableClock={true}
                onChange={this.props.handleStartChange}
                value={this.props.startdate}
              />
            </Colxx>
            <Colxx>
              <Button
                className="btn mt-2"
                onClick={() => this.props.getData()}
              >
                View
                </Button>
                { this.props.children }
            </Colxx>
          </Row>
        </Colxx>
      </Row>
    )
  }
}

export default DateTimeRangePickerCell;