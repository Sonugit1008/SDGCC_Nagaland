import React, { Component, Fragment } from "react";
import { Row, Card, CardBody, Button, Label } from "reactstrap";
import { Colxx, Separator } from "../../components/common/CustomBootstrap";
import PageHeader from "../common/PageHeader";
import { connect } from "react-redux";
import { Formik, Field, ErrorMessage } from "formik";
import { Form } from "react-formik-ui";
import * as Yup from "yup";

class ContactUs extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.closeSidebar();
  }

  render() {
    return (
      <Fragment>
        <PageHeader
          heading={"Contact Us"}
          history={this.props.history}
          match={this.props.match}
          back_button={this.props.public ? true : false}
        ></PageHeader>
        <Row className="mt-4">
          <Colxx lg="12">
            <Card className="p-4">
              <Row>
                <Colxx lg="4">
                  <Row className="d-flex justify-content-center align-items-center h-100">
                    <Colxx lg="10">
                      <Row className="w-100 mt-4">
                        <Colxx lg="1">
                          <i
                            class="fa fa-2x fa-envelope-o"
                            aria-hidden="true"
                          ></i>
                        </Colxx>
                        <Colxx lg="11" className="font-weight-bold h5">
                          General Support
                        </Colxx>
                        <Colxx lg="1"></Colxx>
                        <Colxx lg="11">
                          <a
                            href="mailto:sdgnagaland@gmail"
                            className="no-underline cursor-pointer"
                          >
                            sdgnagaland@gmail.com
                          </a>
                        </Colxx>
                      </Row>
                      <Row className="w-100 my-4">
                        <Colxx lg="1">
                          <i
                            class="fa fa-2x fa-map-marker"
                            aria-hidden="true"
                          ></i>
                        </Colxx>
                        <Colxx lg="11" className="font-weight-bold h5">
                          Address
                        </Colxx>
                        <Colxx lg="1"></Colxx>
                        <Colxx lg="11">
                          Planning & Transformation Department Nagaland Civil
                          Secretariat, Kohima-797004
                        </Colxx>
                      </Row>
                      {/* <Row className="w-100 my-4">
                        <Colxx lg="1">
                          <i class="fa fa-2x fa-phone" aria-hidden="true"></i>
                        </Colxx>
                        <Colxx lg="11" className="font-weight-bold h5">
                          Lets Talk
                        </Colxx>
                        <Colxx lg="1"></Colxx>
                        <Colxx lg="11">+91 6824375634</Colxx>
                      </Row> */}
                      <Row className="mt-4">
                        <Colxx lg="1" className="mr-1">
                          <a
                            href="https://www.instagram.com/sdgccnagaland/"
                            target="_blank"
                          >
                            {/* <i
                              class="fa fa-2x fa-instagram"
                              aria-hidden="true"
                            ></i> */}
                            <img
                              style={{ borderRadius: "3px" }}
                              width="30px"
                              height="30px"
                              src="/dashboard/assets/img/instagram2.png"
                              alt="twitter"
                            />
                          </a>
                        </Colxx>
                        <Colxx lg="1" className="mr-1">
                          <a
                            href="https://www.facebook.com/profile.php?id=100068927390789"
                            target="_blank"
                          >
                            {/* <i
                              class="fa fa-2x fa-facebook-square"
                              aria-hidden="true"
                            ></i> */}

                            <img
                              style={{ borderRadius: "3px" }}
                              width="30px"
                              height="30px"
                              src="/dashboard/assets/img/facebook2.png"
                              alt="twitter"
                            />
                          </a>
                        </Colxx>
                        <Colxx lg="1" className="mr-1">
                          <a
                            href="https://twitter.com/sdgccnagaland/"
                            target="_blank"
                          >
                            {/* <i
                              class="fa fa-2x fa-twitter-square"
                              aria-hidden="true"
                            ></i> */}
                            <img
                              style={{ borderRadius: "3px" }}
                              width="30px"
                              height="30px"
                              src="/dashboard/assets/img/twitter2.png"
                              alt="twitter"
                            />
                          </a>
                        </Colxx>
                        <Colxx lg="1">
                          <a
                            href="https://www.youtube.com/results?search_query=sdgcc+nagaland"
                            target="_blank"
                          >
                            {/* <i
                              class="fa fa-2x fa-youtube-play"
                              aria-hidden="true"
                            ></i> */}
                            <img
                              width="30px"
                              height="30px"
                              src="/dashboard/assets/img/youtube3.png"
                              alt="twitter"
                            />
                          </a>
                        </Colxx>
                      </Row>
                    </Colxx>
                  </Row>
                </Colxx>
                <Colxx lg="8" className="border-left">
                  <Row className="d-flex justify-content-center">
                    <span className="h3 font-weight-bold">
                      Send us a message
                    </span>
                  </Row>
                  <Row className="mt-4 d-flex justify-content-center">
                    <Colxx lg="8">
                      <Formik
                        initialValues={{
                          name: "",
                          email: "",
                          mobile: "",
                          message: "",
                        }}
                        validationSchema={Yup.object({
                          name: Yup.string().trim().required("Required"),
                          mobile: Yup.string().trim().required("Required"),
                          message: Yup.string().trim().required("Required"),
                          email: Yup.string()
                            .trim()
                            .email()
                            .required("Required"),
                        })}
                        onSubmit={(values, { resetForm }) => {}}
                      >
                        <Form className="av-tooltip tooltip-label-bottom ">
                          <Row>
                            <Colxx lg="12">
                              {" "}
                              <div className="form-group">
                                <Label htmlFor="name">Tell Us Your Name*</Label>
                                <Field
                                  className="form-control"
                                  name="name"
                                  placeholder="Your full name"
                                  type="text"
                                />
                                <ErrorMessage
                                  name="name"
                                  render={(msg) => (
                                    <div className="text-danger">{msg}</div>
                                  )}
                                />
                              </div>
                            </Colxx>
                            <Colxx lg="12">
                              {" "}
                              <div className="form-group">
                                <Label htmlFor="email">Enter Your Email*</Label>
                                <Field
                                  className="form-control"
                                  name="email"
                                  placeholder="Ex.sdg@gmail.com"
                                  type="text"
                                />
                                <ErrorMessage
                                  name="email"
                                  render={(msg) => (
                                    <div className="text-danger">{msg}</div>
                                  )}
                                />
                              </div>
                            </Colxx>
                            <Colxx lg="12">
                              {" "}
                              <div className="form-group">
                                <Label htmlFor="mobile">
                                  Enter Your Phone Number
                                </Label>
                                <Field
                                  className="form-control"
                                  name="mobile"
                                  placeholder="Your Phone Number"
                                  type="text"
                                />
                                <ErrorMessage
                                  name="mobile"
                                  render={(msg) => (
                                    <div className="text-danger">{msg}</div>
                                  )}
                                />
                              </div>
                            </Colxx>
                            <Colxx lg="12">
                              <div className="form-group">
                                <Label htmlFor="message">Message</Label>
                                <Field
                                  as="textarea"
                                  className="form-control"
                                  name="message"
                                  placeholder="Write us a message"
                                  // type="text"
                                />
                                <ErrorMessage
                                  name="message"
                                  render={(msg) => (
                                    <div className="text-danger">{msg}</div>
                                  )}
                                />
                              </div>
                            </Colxx>
                          </Row>
                          <Separator className="mb-4 mt-4" />
                          <Button
                            type="submit"
                            color="primary"
                            className={`btn-shadow btn-multiple-state  ${
                              this.props.loading ? "show-spinner" : ""
                            }`}
                            size="lg"
                          >
                            <span className="spinner d-inline-block">
                              <span className="bounce1" />
                              <span className="bounce2" />
                              <span className="bounce3" />
                            </span>
                            <span className="label">SEND MESSAGE</span>
                          </Button>{" "}
                        </Form>
                      </Formik>
                    </Colxx>
                  </Row>
                </Colxx>
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

export default connect(mapStateToProps, mapActionsToProps)(ContactUs);
