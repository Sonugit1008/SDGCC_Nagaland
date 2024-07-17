import React from "react";
import { Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Colxx, Separator } from "../Common/CustomBootstrap";

export default class DashFooter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <>
      {/* <Row className="mt-4 d-flex justify-content-center shadow-lg p-4">
        <Colxx lg="10">
          <Row>
            <Colxx lg="12" className="d-flex justify-content-around">
              <Link to="/faqs" className="mt-4">
                <p className="h5 font-weight-bold">FAQs</p>
              </Link>
              <Link to="/contactus">
                <p className="h5 font-weight-bold my-4">Contact Us</p>
              </Link>
              <Link to="/downloads" className="mt-4">
                <p className="h5 font-weight-bold">Downloads</p>
              </Link> */}
              {/* </Colxx>
            <Colxx lg="4"> */}
              {/* <Link to="/practices" className="mt-4">
                <p className="h5 font-weight-bold">Good Practices</p>
              </Link> */}
              {/* <Link to="/youtubelinks">
                <p className="h5 font-weight-bold mt-4">Youtube Links</p>
              </Link> */}
              {/* </Colxx>

            <Colxx lg="4"> */}
              {/* <Link to="/activities/past" className="mt-4">
                <p className="h5 font-weight-bold">Past Activities</p>
              </Link>
              <Link to="/activities/upcoming">
                <p className="h5 font-weight-bold my-4">Upcoming Activities</p>
              </Link>
              <Link to="/navigation" className="mt-4">
                <p className="h5 font-weight-bold">Navigation Map</p>
              </Link>
              <Link to="/disclaimer" className="mt-4">
                <p className="h5 font-weight-bold">Disclaimer</p>
              </Link>
            </Colxx>
          </Row>
        </Colxx>
      </Row> */}
      </>
    );
  }
}
