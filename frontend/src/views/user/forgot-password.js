import React, { Component } from "react";
import { Row, Card, CardTitle, Label, FormGroup, Button } from "reactstrap";
import { NavLink } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import { Colxx } from "../../components/common/CustomBootstrap";
import IntlMessages from "../../helpers/IntlMessages";
import { forgotPassword } from "../../redux/actions";
import { NotificationManager } from "../../components/common/react-notifications";
import { connect } from "react-redux";
import API from "../../helpers/API";
import * as Yup from "yup";

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "demo@gogo.com",
      otpsent: false,
    };
  }

  onForgotPassword = (values) => {
    if (!this.props.loading) {
      if (values.email !== "") {
        // this.props.forgotPassword(values, this.props.history);

        // API.post("/api/otp/send/")
        this.setState({ sendingOtp: true });
        API.post("/api/password/request_reset/", {
          email: values.email,
        })
          .then((res) => {
            let data = res.data;
            NotificationManager.success(
              "",
              "OTP Sent Successfully.",
              3000,
              null,
              null,
              ""
            );

            this.setState({
              otpsent: true,
              useremail: values.email,
              sendingOtp: false,
            });
          })
          .catch((error) => {
            console.log(error);
            console.log(error.response);
            NotificationManager.error(
              `${error?.response?.data?.info || error?.response?.data?.error}`,
              "Unable to Send OTP",
              3000,
              null,
              null,
              ""
            );
          });
      }
    }
  };

  onResetPassword = (values) => {
    if (!this.props.loading) {
      if (values.email !== "") {
        // this.props.forgotPassword(values, this.props.history);

        // API.post("/api/otp/match/", {
        API.post("/api/password/reset/", {
          email: this.state.useremail,
          new_password: values.password,
          otp: values.secretKey,
        })
          .then((res) => {
            let data = res.data;
            NotificationManager.success(
              "",
              "Password Reset Success. Login Now.",
              3000,
              null,
              null,
              ""
            );

            this.props.history.push("/user/login/");
          })
          .catch((error) => {
            console.log(error);
            console.log(error.response);
            NotificationManager.error(
              "",
              "Password Reset Error.",
              3000,
              null,
              null,
              ""
            );
          });
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
    if (!value) {
      error = "Please enter your new password";
    }
    return error;
  };

  componentDidUpdate() {
    if (this.props.error) {
      NotificationManager.warning(
        this.props.error,
        "Forgot Password Error",
        3000,
        null,
        null,
        ""
      );
    } else {
      if (!this.props.loading && this.props.forgotUserMail === "success")
        NotificationManager.success(
          "Please check your email.",
          "Forgot Password Success",
          3000,
          null,
          null,
          ""
        );
    }
  }

  render() {
    const { email } = this.state;
    const intialEmail = { email };

    return (
      <>
        <Row className="my-4"></Row>
        <Row className="my-4"></Row>
        <Row className="my-4"></Row>

        <Row className="h-100 mt-5">
          <Colxx xxs="12" md="10" className="mx-auto my-auto mt-4">
            <Card className="auth-card my-4 p-4">
              <div className="position-relative">
                <Row className="d-flex justify-content-center">
                  <Colxx lg="9">
                    <img
                      src="/dashboard/assets/img/login-sdg.png"
                      alt="Logo"
                      className="img-fluid"
                    ></img>
                  </Colxx>
                </Row>
              </div>
              <div className="form-side d-flex flex-column justify-content-center">
                {/* <NavLink to={`/`} className="white"><span className="logo-single" /></NavLink> */}
                <p className="mb-4">
                  Please use your e-mail to reset your password. <br /> If you
                  are not a member, please{" "}
                  <NavLink to={`/user/register`} className="text-primary">
                    Register
                  </NavLink>
                </p>
                <CardTitle className="mb-4">
                  <IntlMessages id="user.forgot-password" />
                </CardTitle>

                {this.state.otpsent ? (
                  <>
                    {" "}
                    <Formik
                      initialValues={{
                        password: "",
                        secretKey: "",
                      }}
                      enableReinitialize
                      validationSchema={Yup.object({
                        password: Yup.string()
                          .trim()
                          .required("Please Enter your password")
                          .matches(
                            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/,
                            "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number And One Special Case Character"
                          ),
                      })}
                      onSubmit={this.onResetPassword}
                    >
                      {({ errors, touched }) => (
                        <Form className="av-tooltip tooltip-label-bottom">
                          <FormGroup className="form-group has-float-label">
                            <Label>New Password</Label>
                            <Field
                              className="form-control"
                              name="password"
                              // validate={this.validatePassword}
                            />
                            {errors.password && touched.password && (
                              <div className="invalid-feedback d-block">
                                {errors.password}
                              </div>
                            )}
                          </FormGroup>
                          <FormGroup className="form-group has-float-label">
                            <Label>OTP</Label>
                            <Field className="form-control" name="secretKey" />
                            {errors.secretKey && touched.secretKey && (
                              <div className="invalid-feedback d-block">
                                {errors.secretKey}
                              </div>
                            )}
                          </FormGroup>
                          <div className="d-flex justify-content-between align-items-center">
                            {/* <NavLink to={`/user/forgot-password`}><IntlMessages id="user.forgot-password-question" /></NavLink> */}
                            <Button
                              color="primary"
                              className={`mt-4 btn-shadow btn-multiple-state ${
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
                                <IntlMessages id="user.reset-password-button" />
                              </span>
                            </Button>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  </>
                ) : (
                  <>
                    {" "}
                    <Formik
                      initialValues={intialEmail}
                      onSubmit={this.onForgotPassword}
                    >
                      {({ errors, touched }) => (
                        <Form className="av-tooltip tooltip-label-bottom">
                          <FormGroup className="form-group has-float-label">
                            <Label>
                              <IntlMessages id="user.email" />
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
                          <div className="d-flex justify-content-between align-items-center">
                            {/* <NavLink to={`/user/forgot-password`}><IntlMessages id="user.forgot-password-question" /></NavLink> */}
                            <Button
                              color="primary"
                              className={`mt-4 btn-shadow btn-multiple-state ${
                                this.state.sendingOtp ? "show-spinner" : ""
                              }`}
                              size="lg"
                            >
                              <span className="spinner d-inline-block">
                                <span className="bounce1" />
                                <span className="bounce2" />
                                <span className="bounce3" />
                              </span>
                              <span className="label">Send OTP</span>
                            </Button>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  </>
                )}
              </div>
            </Card>
          </Colxx>
        </Row>
      </>
    );
  }
}

const mapStateToProps = ({ authUser }) => {
  const { forgotUserMail, loading, error } = authUser;
  return { forgotUserMail, loading, error };
};

export default connect(mapStateToProps, {
  forgotPassword,
})(ForgotPassword);
