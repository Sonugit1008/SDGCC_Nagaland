import React, { Component } from "react";
import { Row, Card, CardTitle, Label, Button } from "reactstrap";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { NotificationManager } from "../../components/common/react-notifications";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { loginMobile } from "../../redux/actions";
import { Colxx } from "../../components/common/CustomBootstrap";
import IntlMessages from "../../helpers/IntlMessages";
import API from "../../helpers/API";

class MobileLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
    };
  }

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
    return (
      <Row className="h-100">
        <Colxx xxs="12" md="10" className="mx-auto my-auto">
          <Card className="auth-card">
            <div className="position-relative image-side "></div>
            <div className="form-side">
              <NavLink to={`/`} className="white">
                <span className="logo-single" />
              </NavLink>
              <CardTitle className="mb-4">Employee Login</CardTitle>

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
                      <Label>CID</Label>
                      <Field className="form-control" name="cid" />
                      <ErrorMessage
                        name="cid"
                        render={(msg) => (
                          <div className="text-danger">{msg}</div>
                        )}
                      />
                    </div>
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
                                  this.setState({ mobileOTPsending: true });
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
                        <div className="d-flex justify-content-between align-items-center mt-2">
                          <div
                            className="btn btn-primary"
                            onClick={() => {
                              this.setState({ mobileOTPsending: true });
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
                      </>
                    )}
                  </Form>
                )}
              </Formik>
            </div>
          </Card>
        </Colxx>
      </Row>
    );
  }
}
const mapStateToProps = ({ authUser }) => {
  const { user, loading, error } = authUser;
  return { user, loading, error };
};

export default connect(mapStateToProps, {
  loginMobile,
})(MobileLogin);
