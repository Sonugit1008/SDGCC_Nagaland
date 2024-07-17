import React, { Component } from "react";
import { registerUser } from "../../redux/actions";
import { Row, Card, Label, FormGroup, Button } from "reactstrap";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import ReCAPTCHA from "react-google-recaptcha";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Colxx, Separator } from "../../components/common/CustomBootstrap";
import IntlMessages from "../../helpers/IntlMessages";
import { NotificationManager } from "../../components/common/react-notifications";
import * as Yup from "yup";
import zxcvbn from "zxcvbn";
import "./reg.css";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "demo@gogo.com",
      password: "gogo123",
      mobile: "",
      otp: "",
      ischecked: false,
      logintype: "email",
      strength: 0,
      checked: false,
    };
  }
  onUserRegister = (values) => {
    if (!this.props.loading) {
      if (this.state.email !== "" && this.state.password !== "") {
        // this.props.history.push("/");
        this.setState({ formPosted: true });
        this.props.registerUser(values, this.props.history);
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

    this.setState({
      strength: zxcvbn(value).score,
      passwordLength: value.length,
    });
    return error;
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.formPosted === true) {
      if (
        this.props.loading !== true &&
        this.props.loading !== prevProps.loading
      ) {
        if (this.props.error || this.props.error === undefined) {
          NotificationManager.error(
            "Registration",
            "Registration Error",
            3000,
            null,
            null,
            ""
          );
        } else {
          NotificationManager.success(
            "Registration",
            `Registered Successfully.`,
            3000,
            null,
            null,
            ""
          );
          this.props.history.push("/user/login/");
        }
      }
    }
  }

  render() {
    const { password, email, mobile, otp } = this.state;
    const initialValues = { email, password, mobile, otp };

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
            <Card className="">
              <Row className="d-flex justify-content-center">
                <Colxx
                  md="5"
                  className="border-right pb-2 d-flex justify-content-center align-items-center"
                >
                  <Row className="d-flex justify-content-center">
                    <Colxx md="8">
                      <img
                        alt=""
                        src="/dashboard/assets/img/sdgc.jpg"
                        className="img-thumbnail"
                      />
                    </Colxx>
                  </Row>
                </Colxx>
                <Colxx md="6" className="p-4 mt-4">
                  <Row className="d-flex justify-content-center mb-3">
                    <p className="h4">Register</p>
                  </Row>
                  <Formik
                    initialValues={initialValues}
                    validationSchema={Yup.object({
                      mobile: Yup.string()
                        .required("Required")
                        .matches(/^\d{10}$/, "Mobile must be only 10 digits"),
                    })}
                    onSubmit={this.onUserRegister}
                  >
                    {({ values, errors, touched }) => (
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
                          {/* <div>
                          To conform with our Strong Password policy, you are
                          required to use a sufficiently strong password.
                          Password must be more than 6 characters.
                        </div> */}
                          <div
                            // className="strength-meter mt-2 visible"
                            className={[
                              "strength-meter mt-2",
                              this.state.passwordLength > 0
                                ? "visible"
                                : "invisible",
                            ].join(" ")}
                          >
                            <div
                              className="strength-meter-fill"
                              data-strength={this.state.strength}
                            ></div>
                          </div>
                        </FormGroup>
                        <Row>
                          <Colxx xxs="12">
                            <div className="form-group has-float-label">
                              <Label>Mobile Number</Label>
                              <Field
                                className="form-control"
                                type="text"
                                name="mobile"
                              ></Field>
                              <ErrorMessage
                                name="mobile"
                                render={(msg) => (
                                  <div className="text-danger">{msg}</div>
                                )}
                              />
                            </div>
                          </Colxx>
                          {/* <Colxx xxs="2">
                            <div>
                              <div
                                className="btn btn-primary"
                                onClick={() => {
                                  this.setState({
                                    mobileOTPsending: true,
                                  });
                                  // this.sendOTP({
                                  //   mobile: values.mobile,
                                  // });
                                }}
                              >
                                {this.state.mobileOTPsending
                                  ? "Sending"
                                  : this.state.otpSent
                                  ? "Resend"
                                  : "Send OTP"}
                              </div>
                            </div>
                          </Colxx> */}
                        </Row>
                        <Row>
                          <Colxx md="12" className="d-flex align-items-center">
                            <div className="form-group mt-2">
                              <input
                                className="ml-1"
                                name="video_url"
                                type="checkbox"
                                checked={this.state.checked}
                                onChange={() => {
                                  this.setState({
                                    checked: !this.state.checked,
                                  });
                                }}
                              />
                              <label htmlFor="video_url" className="ml-2">
                                Agree to terms and conditions
                              </label>
                            </div>
                          </Colxx>
                        </Row>
                        {/* <FormGroup className="form-group mt-2">
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
                            {/* <NavLink to={`/user/forgot-password`}>
                          <IntlMessages id="user.forgot-password-question" />
                        </NavLink> */}
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
                              <IntlMessages id="user.register-button" />
                            </span>
                          </Button>
                        </div>
                        <div className="d-flex justify-content-end mt-4">
                          <p>
                            Already Registered? &nbsp;
                            <NavLink
                              to={`/user/login`}
                              className="text-primary underline h6"
                            >
                              Login Now
                            </NavLink>
                          </p>
                        </div>
                      </Form>
                    )}
                  </Formik>
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
  registerUser,
})(Register);
