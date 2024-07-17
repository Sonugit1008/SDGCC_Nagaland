import React, { Component } from "react";
import { Row, Card, Label, FormGroup, Button } from "reactstrap";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import ReCAPTCHA from "react-google-recaptcha";
import { NotificationManager } from "../../components/common/react-notifications";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { loginUser } from "../../redux/actions";
import { Colxx, Separator } from "../../components/common/CustomBootstrap";
import IntlMessages from "../../helpers/IntlMessages";
import API from "../../helpers/API";
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      mobile: "",
      otp: "",
      ischecked: false,
      logintype: "email",
    };
  }

  onUserLogin = (values) => {
    if (!this.props.loading) {
      if (values.email !== "" && values.password !== "") {
        this.props.loginUser(values, this.props.history);
      }
    }
  };

  validateEmail = (value) => {
    let error;
    if (!value) {
      error = "Please enter your email address";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
      error = "Invalid email address";
    }
    return error;
  };

  validatePassword = (value) => {
    let error;
    let regExp = new RegExp(
      "^(?=.*\\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$"
    );

    if (!value) {
      error = "Please enter your password";
    } else if (value.length < 6) {
      error = "Value must be longer than 5 characters";
    } else if (!regExp.test(value)) {
      error =
        "Password must have at least One Uppercase, One Number, One Lowercase, And One Special Character";
    }

    return error;
  };

  sendOTP = (data) => {
    API.post("/api/mobile/init/", data)
      .then((response) => {
        this.setState({ mobileOTPsending: false, otpSent: true });
      })
      .catch((error) => {
        console.log(error);
        NotificationManager.error(
          "Mobile OTP",
          "Send OTP error",
          3000,
          null,
          null,
          ""
        );
        this.setState({ mobileOTPsending: false });
      });
  };

  componentDidUpdate() {
    if (this.props.error) {
      NotificationManager.error(
        this.props.error,
        "Login Error",
        3000,
        null,
        null,
        ""
      );
    }
  }

  render() {
    const { password, email } = this.state;
    const initialValues = { email, password };

    return (
      <>
        {/* <Row className="mx-4">
          <Colxx
            xxs="9"
            className="mx-auto my-auto p-4"
            style={{ backgroundColor: "#F8F8F8" }}
          >
            <Row className="d-flex justify-content-start align-items-center">
              <Colxx md="1">
                <img
                  alt=""
                  src="/dashboard/assets/img/sdg_logo1.jpg"
                  className="img-thumbnail"
                />
              </Colxx>

              <span className="h3 font-weight-bold">
                Government Of Nagaland
              </span>
            </Row>
          </Colxx>
          <Colxx md="3" className="p-4" style={{ backgroundColor: "#F8F8F8" }}>
            <img
              alt=""
              src="/dashboard/assets/img/dash_logo.png"
              className="img-thumbnail"
            />
          </Colxx>
        </Row> */}
        <Row className="my-4"></Row>
        <Row className="my-4"></Row>
        <Row className="my-4"></Row>
        <Row className="h-100 mt-4">
          <Colxx xxs="10" md="8" className="mx-auto mt-4">
            <Card className="mt-4">
              <Row className="d-flex justify-content-center">
                <Colxx
                  md="5"
                  className="border-right pb-2 d-flex justify-content-center align-items-center"
                >
                  <Row className="d-flex justify-content-center">
                    <Colxx md="8">
                      <img
                        alt=""
                        src="/dashboard/assets/img/sdgc-login.png"
                        className="img-thumbnail"
                      />
                    </Colxx>
                  </Row>
                </Colxx>
                <Colxx md="6" className="p-4 mt-4">
                  <Row className="d-flex justify-content-center mb-3">
                    <p className="h4">Login</p>
                  </Row>
                  {/* <Row className="mt-2 mb-4">
                    <Colxx md="1"></Colxx>
                    <Colxx
                      md="4"
                      className={[
                        "d-flex justify-content-center h6 py-2",
                        this.state.logintype === "email" ? "bg-light" : "",
                      ].join(" ")}
                      onClick={() => {
                        this.setState({ logintype: "email" });
                      }}
                    >
                      Email
                    </Colxx>
                    <Colxx md="2"></Colxx>
                    <Colxx
                      md="4"
                      className={[
                        "d-flex justify-content-center h6 py-2",
                        this.state.logintype === "mobile" ? "bg-light" : "",
                      ].join(" ")}
                      onClick={() => {
                        this.setState({ logintype: "mobile" });
                      }}
                    >
                      Phone Number
                    </Colxx>
                    <Colxx md="1"></Colxx>
                  </Row> */}
                  {this.state.logintype === "mobile" ? (
                    <Formik
                      initialValues={{}}
                      validationSchema={Yup.object({
                        cid: Yup.string().required("Required"),
                        mobile: Yup.string()
                          .required("Required")
                          .matches(/^[0-9]*$/, "Please enter valid number"),
                        otp: Yup.string().required("Required"),
                      })}
                      onSubmit={(values, { resetForm }) => {
                        this.props.loginMobile(values, this.props.history);
                        // API.post("/api/mobile/login/", values)
                        //   .then((response) => {
                        //     console.log("rrrrrrrr", response, response.data);
                        //   })
                        //   .catch((error) => {
                        //     console.log(error);
                        //     NotificationManager.error(
                        //       "Mobile OTP",
                        //       "Send OTP error",
                        //       3000,
                        //       null,
                        //       null,
                        //       ""
                        //     );
                        //   });
                      }}
                    >
                      {({ values, setFieldValue }) => (
                        <Form className="av-tooltip tooltip-label-bottom">
                          <div className="form-group has-float-label">
                            <Label>Mobile Number</Label>
                            <Field
                              className="form-control"
                              type="text"
                              name="mobile"
                            />
                            <ErrorMessage
                              name="mobile"
                              render={(msg) => (
                                <div className="text-danger">{msg}</div>
                              )}
                            />
                          </div>
                          {/* <div className="form-group has-float-label">
                          <Label>Password</Label>
                          <Field
                            className="form-control"
                            name="password"
                            type="password"
                          />
                          <ErrorMessage
                            name="password"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div> */}

                          {this.state.otpSent ? (
                            <>
                              <Row>
                                <Colxx xxs="8">
                                  <div className="form-group has-float-label">
                                    <Label>Mobile OTP</Label>
                                    <Field
                                      className="form-control"
                                      type="text"
                                      name="otp"
                                    ></Field>
                                    <ErrorMessage
                                      name="otp"
                                      render={(msg) => (
                                        <div className="text-danger">{msg}</div>
                                      )}
                                    />
                                  </div>
                                </Colxx>
                                <Colxx xxs="2">
                                  <div>
                                    <div
                                      className="btn btn-primary"
                                      onClick={() => {
                                        this.setState({
                                          mobileOTPsending: true,
                                        });
                                        this.sendOTP({
                                          cid: values.cid,
                                          mobile: values.mobile,
                                        });
                                      }}
                                    >
                                      {this.state.mobileOTPsending
                                        ? "Sending"
                                        : this.state.otpSent
                                        ? "Resend"
                                        : "Send OTP"}
                                    </div>
                                  </div>
                                </Colxx>
                              </Row>
                              {/* <FormGroup className="form-group mt-4">
                                <ReCAPTCHA
                                  sitekey="6Leh5cQgAAAAAHpzzpmfjLfoKujP0xGYiNEfrQoR"
                                  onChange={(e) => {
                                    console.log("Captcha", e);
                                  }}
                                />
                              </FormGroup> */}
                              <Separator className="mb-4 mt-4" />
                              <div className="d-flex justify-content-between align-items-center mt-2">
                                <Button
                                  color="primary"
                                  className={`btn-shadow btn-multiple-state ${
                                    this.props.loading ? "show-spinner" : ""
                                  }`}
                                  size="lg"
                                >
                                  <span className="spinner d-inline-block">
                                    <span className="bounce1" />
                                    <span className="bounce2" />
                                    <span className="bounce3" />
                                  </span>
                                  <span className="label">
                                    <IntlMessages id="user.login-button" />
                                  </span>
                                </Button>
                              </div>
                            </>
                          ) : (
                            <>
                              <Separator className="mb-4 mt-4" />
                              <div className="d-flex justify-content-end align-items-center mt-2">
                                {/* <div className="d-flex flex-column">
                                <NavLink to={`/user/forgot-password`}>
                                  <IntlMessages id="user.forgot-password-question" />
                                </NavLink>
                              </div> */}
                                <div
                                  className="btn btn-primary"
                                  onClick={() => {
                                    this.setState({ mobileOTPsending: true });
                                    this.sendOTP({
                                      mobile: values.mobile,
                                      password: values.password,
                                    });
                                  }}
                                >
                                  {this.state.mobileOTPsending
                                    ? "Sending"
                                    : this.state.otpSent
                                    ? "Resend"
                                    : "Send OTP"}
                                </div>
                              </div>
                              <div className="d-flex justify-content-end mt-4">
                                <p>
                                  Not Registered? &nbsp;
                                  <NavLink
                                    to={`/user/register`}
                                    className="text-primary underline h6"
                                  >
                                    Register Now
                                  </NavLink>
                                </p>
                              </div>
                            </>
                          )}
                        </Form>
                      )}
                    </Formik>
                  ) : (
                    <Formik
                      initialValues={initialValues}
                      onSubmit={this.onUserLogin}
                    >
                      {({ errors, touched }) => (
                        <Form className="av-tooltip tooltip-label-bottom">
                          <FormGroup className="form-group has-float-label">
                            <Label>
                              {/* <IntlMessages id="user.email" /> */}
                              Username
                            </Label>
                            <Field
                              className="form-control"
                              name="email"
                              validate={this.validateEmail}
                            />
                            {errors.email && touched.email && (
                              <div className="invalid-feedback d-block">
                                {errors.email}
                              </div>
                            )}
                          </FormGroup>
                          <FormGroup className="form-group has-float-label mt-4">
                            <Label>
                              <IntlMessages id="user.password" />
                            </Label>
                            <Field
                              className="form-control"
                              type="password"
                              name="password"
                              validate={this.validatePassword}
                            />
                            {errors.password && touched.password && (
                              <div className="invalid-feedback d-block">
                                {errors.password}
                              </div>
                            )}
                          </FormGroup>
                          {/* <FormGroup className="form-group mt-4">
                            <ReCAPTCHA
                              sitekey="6Leh5cQgAAAAAHpzzpmfjLfoKujP0xGYiNEfrQoR"
                              onChange={(e) => {
                                console.log("Captcha", e);
                              }}
                            />
                          </FormGroup> */}
                          <Separator className="mb-4 mt-4" />
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex flex-column">
                              <NavLink to={`/user/forgot-password`}>
                                <IntlMessages id="user.forgot-password-question" />
                              </NavLink>
                            </div>
                            <Button
                              color="primary"
                              className={`btn-shadow btn-multiple-state ${
                                this.props.loading ? "show-spinner" : ""
                              }`}
                              size="lg"
                            >
                              <span className="spinner d-inline-block">
                                <span className="bounce1" />
                                <span className="bounce2" />
                                <span className="bounce3" />
                              </span>
                              <span className="label">
                                <IntlMessages id="user.login-button" />
                              </span>
                            </Button>
                          </div>
                          <div className="d-flex justify-content-end mt-4">
                            {/* <p>
                          <NavLink
                            to={`/user/register`}
                            className="text-primary underline h6"
                          >
                            Login with Mobile
                          </NavLink>
                        </p> */}
                            <p>
                              Not Registered? &nbsp;
                              <NavLink
                                to={`/user/register`}
                                className="text-primary underline h6"
                              >
                                Register Now
                              </NavLink>
                            </p>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  )}
                </Colxx>
              </Row>
            </Card>
          </Colxx>
        </Row>
      </>
    );
  }
}
const mapStateToProps = ({ authUser }) => {
  const { user, loading, error } = authUser;
  return { user, loading, error };
};

export default connect(mapStateToProps, {
  loginUser,
})(Login);
