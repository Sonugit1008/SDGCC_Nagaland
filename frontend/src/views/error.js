import React, { Component, Fragment } from "react";
import { Row, Card, CardTitle, Button } from "reactstrap";
// import { NavLink } from "react-router-dom";
import { Colxx } from "../components/common/CustomBootstrap";
import IntlMessages from "../helpers/IntlMessages";

class Error extends Component {
  componentDidMount() {
    document.body.classList.add("background");
  }
  componentWillUnmount() {
    document.body.classList.remove("background");
  }
  render() {
    return (
      <Fragment>
        <div className="fixed-background" />
        <main>
          <div className="container mt-5">
            <Row className="h-100">
              <Colxx xxs="12" md="10" className="mx-auto my-auto">
                <Card className="auth-card p-4">
                  <div className="position-relative image-side ">
                    <p className="text-white h2"> </p>
                    <p className="white mb-0"></p>
                  </div>
                  <div className="form-side">
                    {/* <NavLink to={`/`} className="white">
                      <span className="logo-single" />
                    </NavLink> */}
                    <CardTitle className="mb-2 mt-4">
                      "This is not the Way"
                    </CardTitle>
                    <p className="mb-0 text-muted text-small mb-0">
                      "<IntlMessages id="pages.error-code" /> "
                    </p>
                    <p className="display-1 font-weight-bold my-4">404</p>
                    <Button
                      href="/app"
                      color="primary"
                      className="btn-shadow mb-4"
                      size="lg"
                    >
                      "This is the Way"
                    </Button>
                  </div>
                </Card>
              </Colxx>
            </Row>
          </div>
        </main>
      </Fragment>
    );
  }
}
export default Error;
