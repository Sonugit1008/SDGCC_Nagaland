import React, { Component, Fragment } from "react";
import { Row, Button, Label } from "reactstrap";
import { Colxx, Separator } from "../../components/common/CustomBootstrap";
import Breadcrumb from "../../containers/navs/Breadcrumb";
import { connect } from "react-redux";
import * as Yup from "yup";
import { Formik, Field, ErrorMessage, Form } from "formik";
import apiAuth from "../../helpers/ApiAuth";
import { NotificationManager } from "../../components/common/react-notifications";
import { UPDATE_PROFILE } from "../../redux/actions";
// import Select from "react-select";
import moment from "moment-timezone";
import ChangePassword from "./ChangePassword";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";

class Profile extends Component {
  constructor(props) {
    super(props);

    var timezone = moment.tz.guess();
    if (this.props.timezone === "undefined") {
    } else {
      timezone = this.props.timezone;
    }
    var filename = "";
    if (props.profile_pic === "null" || props.profile_pic === "default") {
      filename = "/dashboard/assets/img/profile-pic-blank.png";
    } else {
      filename = props.profile_pic;
    }
    this.state = {
      file: filename,
      picfile: null,
      timezone: timezone,
    };
    console.log("propfile first name");
    console.log(this.props.first_name);
    this.onDrop = this.onDrop.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  onDrop(picture, picturefile) {
    this.setState({
      pictures: picture,
      pictureFiles: picturefile,
    });
  }

  handleChange(event) {
    this.setState({
      file: URL.createObjectURL(event.target.files[0]),
      picfile: event.target.files[0],
    });
  }

  render() {
    return (
      <Fragment>
        <Row mb="4">
          <Colxx xxs="12">
            <Breadcrumb heading="User Profile" match={this.props.match} />
            <div className="top-right-button-container float-right">
              <Button
                className="btn btn-light float-right"
                onClick={this.props.history.goBack}
              >
                Back
              </Button>
            </div>

            <Separator mb="4" />
          </Colxx>
        </Row>

        <Fragment>
          {" "}
          <Row className="mt-4 card d-flex">
            <Row>
              <Colxx xxs="3" className="d-flex self-align-center">
                <div className="mt-4">
                  <div className="position-relative"></div>

                  <img
                    src={this.state.file}
                    alt="profile pic"
                    className="card-img-top"
                  ></img>
                  <div className="w-100 card-body p-0 pl-3">
                    <div className="mb-4 card-subtitle p-0">
                      <div className="mb-3 input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text">Upload</span>
                        </div>
                        <div className="custom-file">
                          <input
                            type="file"
                            id="exampleCustomFileBrowser1"
                            name="customFile"
                            className="custom-file-input"
                            onChange={this.handleChange}
                          />
                          <label className="custom-file-label">
                            Profile Picture
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Colxx>
              <Colxx xxs="9" className="border-left p-0">
                <Tabs
                  defaultActiveKey="details"
                  id="uncontrolled-tab-example"
                  className="w-100"
                >
                  <Tab eventKey="details" title="Details">
                    <div className="">
                      <div className="card-body">
                        {/* <h2 className="mb-1 mt-1 ml-1">Details</h2>
												<Separator className="mb-4" /> */}

                        <Formik
                          initialValues={{
                            first_name: this.props.first_name,
                            last_name: this.props.last_name,
                            mobile: this.props.mobile,
                            email: this.props.user,
                          }}
                          validationSchema={Yup.object({
                            // first_name: Yup.string()
                            //   .max(40, "Must be 40 characters or less")
                            //   .required("Required"),
                            // last_name: Yup.string().max(
                            //   20,
                            //   "Must be 20 characters or less"
                            // ),
                            mobile: Yup.string()
                              .required("Required")
                              .matches(
                                /^\d{10}$/,
                                "Mobile must be only 10 digits"
                              ),
                          })}
                          onSubmit={(values, { resetForm }) => {
                            const formData = new FormData();
                            if (this.state.picfile) {
                              formData.append(
                                "profile_pic",
                                this.state.picfile
                              );
                            }
                            formData.append("first_name", values.first_name);
                            formData.append("last_name", values.last_name);
                            formData.append("mobile", values.mobile);
                            formData.append("timezone", this.state.timezone);
                            formData.append("user", this.props.user_id);
                            // formData.append("username", this.props.user);
                            // formData.append("email", this.props.user);

                            const config = {
                              headers: {
                                "content-type": "multipart/form-data",
                              },
                            };
                            console.log("update profile");
                            const url = `/api/user/profile/${this.props.user_id}/`;
                            console.log(this.props.user_id);
                            apiAuth
                              .patch(url, formData, config)
                              .then((response) => {
                                console.log(response);
                                console.log(response.data);
                                if (response.status === 200) {
                                  this.props.updateProfile(response.data);
                                  NotificationManager.success(
                                    "User Profile",
                                    `User Profile Edit Success`,
                                    3000,
                                    null,
                                    null,
                                    ""
                                  );
                                } else {
                                  NotificationManager.error(
                                    "User Profile",
                                    `User Profile Edit Error`,
                                    3000,
                                    null,
                                    null,
                                    ""
                                  );
                                }
                              })
                              .catch((error) => {
                                // Error 😨
                                if (error.response) {
                                  /*
                                   * The request was made and the server responded with a
                                   * status code that falls out of the range of 2xx
                                   */
                                  NotificationManager.error(
                                    error.response.status,
                                    `User Profile Error`,
                                    3000,
                                    null,
                                    null,
                                    ""
                                  );
                                  console.log(error.response.data);
                                  console.log(error.response.status);
                                  console.log(error.response.headers);
                                } else if (error.request) {
                                  /*
                                   * The request was made but no response was received, `error.request`
                                   * is an instance of XMLHttpRequest in the browser and an instance
                                   * of http.ClientRequest in Node.js
                                   */
                                  NotificationManager.error(
                                    "No Response",
                                    `User Profile Error`,
                                    3000,
                                    null,
                                    null,
                                    ""
                                  );
                                  console.log(error.request);
                                } else {
                                  // Something happened in setting up the request and triggered an Error
                                  NotificationManager.error(
                                    error.message,
                                    `User Profile Error`,
                                    3000,
                                    null,
                                    null,
                                    ""
                                  );
                                  console.log("Error", error.message);
                                }
                                console.log(error.config);
                              });
                          }}
                        >
                          <Form className="av-tooltip tooltip-label-bottom ">
                            <Row>
                              <Colxx lg="4">
                                <div className="form-group">
                                  <Label htmlFor="email">Email</Label>
                                  <Field
                                    className="form-control"
                                    name="email"
                                    type="text"
                                    placeholder="Email"
                                    readOnly
                                  />

                                  <ErrorMessage
                                    name="email"
                                    render={(msg) => (
                                      <div className="text-danger">{msg}</div>
                                    )}
                                  />
                                </div>
                              </Colxx>
                              <Colxx lg="4">
                                {" "}
                                <div className="form-group">
                                  <Label htmlFor="first_name">First Name</Label>
                                  <Field
                                    className="form-control"
                                    name="first_name"
                                    placeholder="First Name"
                                    type="text"
                                  />
                                  <ErrorMessage
                                    name="first_name"
                                    render={(msg) => (
                                      <div className="text-danger">{msg}</div>
                                    )}
                                  />
                                </div>
                              </Colxx>
                              <Colxx lg="4">
                                {" "}
                                <div className="form-group">
                                  <Label htmlFor="last_name">Last Name</Label>
                                  <Field
                                    className="form-control"
                                    name="last_name"
                                    placeholder="Last Name"
                                    type="text"
                                  />
                                  <ErrorMessage
                                    name="last_name"
                                    render={(msg) => (
                                      <div className="text-danger">{msg}</div>
                                    )}
                                  />
                                </div>
                              </Colxx>

                              <Colxx lg="4">
                                <div className="form-group">
                                  <Label htmlFor="mobile">Mobile</Label>
                                  <Field
                                    className="form-control"
                                    name="mobile"
                                    type="text"
                                    placeholder="Mobile"
                                  />

                                  <ErrorMessage
                                    name="mobile"
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
                              <span className="label">Update</span>
                            </Button>{" "}
                          </Form>
                        </Formik>
                      </div>
                    </div>
                  </Tab>
                  <Tab eventKey="changepassword" title="Change Password">
                    <div className="">
                      <ChangePassword></ChangePassword>
                    </div>
                  </Tab>
                </Tabs>
              </Colxx>
            </Row>
          </Row>
          {/* <Row className="mt-4">
            <Colxx xxs="4"></Colxx>
            <Colxx xxs="8">
              <ChangePassword></ChangePassword>
            </Colxx>
          </Row> */}
        </Fragment>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ authUser }) => {
  const {
    loading,
    error,
    first_name,
    last_name,
    mobile,
    timezone,
    profile_pic,
    user,
    user_id,
  } = authUser;

  return {
    loading,
    error,
    first_name,
    last_name,
    mobile,
    timezone,
    profile_pic,
    user,
    user_id,
  };
};

const mapActionsToProps = (dispatch) => {
  return {
    updateProfile: (profile) =>
      dispatch({ type: UPDATE_PROFILE, payload: profile }),
  };
};
export default connect(mapStateToProps, mapActionsToProps)(Profile);
