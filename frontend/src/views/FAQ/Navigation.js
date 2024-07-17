import React, { Component, Fragment } from "react";
import { Row, Card, CardBody, Button, Label } from "reactstrap";
import { Colxx, Separator } from "../../components/common/CustomBootstrap";
import PageHeader from "../common/PageHeader";
import { connect } from "react-redux";
import API from "../../helpers/API";
import { Link } from "react-router-dom";

class NavigationMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      publishedReports: [],
    };
  }

  componentDidMount() {
    this.props.closeSidebar();
  }

  render() {
    return (
      <Fragment>
        <PageHeader
          heading={"Navigation Map"}
          history={this.props.history}
          match={this.props.match}
          back_button={this.props.public ? true : false}
        ></PageHeader>
        <Row className="mt-4">
          <Colxx lg="12">
            <Card className="p-4">
              <Row className="mt-4">
                <Colxx lg="5"></Colxx>
                <Colxx lg="2">
                  <Link to="/dashboard" className="mt-3">
                    <Button className="rounded-0 bg-primary">
                      <p className="h4 font-weight-bold">Public Dashboard</p>
                    </Button>
                  </Link>
                </Colxx>
                <Colxx lg="5"></Colxx>
              </Row>
              <Row>
                <Colxx lg="5"></Colxx>
                <Colxx lg="2" className="d-flex justify-content-center">
                  <i class="fa fa-long-arrow-down fa-3x" aria-hidden="true"></i>
                </Colxx>
                <Colxx lg="5"></Colxx>
              </Row>
              <Separator />
              <Row className="mb-4 d-flex justify-content-between">
                <Link
                  to="/user/login"
                  className="d-flex flex-column align-items-center"
                >
                  <i
                    class="fa fa-long-arrow-down fa-3x d-none d-md-block"
                    aria-hidden="true"
                  ></i>
                  <Button className="m-1 rounded-0 bg-primary">
                    <p className="h4 font-weight-bold">Login</p>
                  </Button>
                </Link>

                <Link
                  to="/user/register"
                  className="d-flex flex-column align-items-center"
                >
                  <i
                    class="fa fa-long-arrow-down fa-3x d-none d-md-block"
                    aria-hidden="true"
                  ></i>
                  <Button className="m-1 rounded-0 bg-primary">
                    <p className="h4 font-weight-bold">Register</p>
                  </Button>
                </Link>

                <Link
                  to="/faqs"
                  className="d-flex flex-column align-items-center"
                >
                  <i
                    class="fa fa-long-arrow-down fa-3x d-none d-md-block"
                    aria-hidden="true"
                  ></i>
                  <Button className="m-1 rounded-0 bg-primary">
                    <p className="h4 font-weight-bold">FAQs</p>
                  </Button>
                </Link>

                <Link
                  to="/contactus"
                  className="d-flex flex-column align-items-center"
                >
                  <i
                    class="fa fa-long-arrow-down fa-3x d-none d-md-block"
                    aria-hidden="true"
                  ></i>
                  <Button className="m-1 rounded-0 bg-primary">
                    <p className="h4 font-weight-bold">Contact Us</p>
                  </Button>
                </Link>

                <Link
                  to="/downloads"
                  className="d-flex flex-column align-items-center"
                >
                  <i
                    class="fa fa-long-arrow-down fa-3x d-none d-md-block"
                    aria-hidden="true"
                  ></i>
                  <Button className="m-1 rounded-0 bg-primary">
                    <p className="h4 font-weight-bold">Downloads</p>
                  </Button>
                </Link>

                <Link
                  to="/practices"
                  className="d-flex flex-column align-items-center"
                >
                  <i
                    class="fa fa-long-arrow-down fa-3x d-none d-md-block"
                    aria-hidden="true"
                  ></i>
                  <Button className="m-1 rounded-0 bg-primary">
                    <p className="h4 font-weight-bold">Best Practices</p>
                  </Button>
                </Link>

                {/* <Link
                  to="/youtubelinks"
                  className="d-flex flex-column align-items-center"
                >
                  <i class="fa fa-long-arrow-down fa-3x d-none d-md-block" aria-hidden="true"></i>
                  <Button className="m-1 rounded-0 bg-primary">
                    <p className="h4 font-weight-bold">Youtube Links</p>
                  </Button>
                </Link> */}

                <Link
                  to="/activities/past"
                  className="d-flex flex-column align-items-center"
                >
                  <i
                    class="fa fa-long-arrow-down fa-3x d-none d-md-block"
                    aria-hidden="true"
                  ></i>
                  <Button className="m-1 rounded-0 bg-primary">
                    <p className="h4 font-weight-bold">Past Activities</p>
                  </Button>
                </Link>

                <Link
                  to="/activities/upcoming"
                  className="d-flex flex-column align-items-center"
                >
                  <i
                    class="fa fa-long-arrow-down fa-3x d-none d-md-block"
                    aria-hidden="true"
                  ></i>
                  <Button className="m-1 rounded-0 bg-primary">
                    <p className="h4 font-weight-bold">Upcoming Activities</p>
                  </Button>
                </Link>
              </Row>
            </Card>
          </Colxx>
        </Row>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ authUser }) => {
  const { timezone } = authUser;

  return {
    timezone,
  };
};

const mapActionsToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapActionsToProps)(NavigationMap);
