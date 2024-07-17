import React, { Component, Fragment } from "react";
import { Row, Button, Label } from "reactstrap";
import * as Yup from "yup";
// import { Modal } from "react-bootstrap";
import { Formik, Field, ErrorMessage } from "formik";
import { Form } from "react-formik-ui";
import Select from "react-select";
import { connect } from "react-redux";
import Breadcrumb from "../../containers/navs/Breadcrumb";
import { Colxx, Separator } from "../../components/common/CustomBootstrap";
import apiAuth from "../../helpers/ApiAuth";
import { NotificationManager } from "../../components/common/react-notifications";

class UserAdd extends Component {
  constructor(props) {
    super(props);
    var filename = "";
    this.state = {
      groups: [],
      departments: [],
      selectedDepartment: [],
      is_new: true,
      file: filename,
      picfile: null,
      selectedGroup: null,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      file: URL.createObjectURL(event.target.files[0]),
      picfile: event.target.files[0],
    });
  }

  handleChangeGroup = (selectedGroup) => {
    this.setState({ selectedGroup });
  };

  handleChangeDepartment = (selectedDepartment) => {
    this.setState({ selectedDepartment });
  };

  componentDidMount() {
    this.getGroups();
    this.getDepartments();
  }

  getGroups() {
    let url =
      this.props.role === "company_admin"
        ? "/api/company_admin/groups/"
        : "/api/admin/groups/";
    apiAuth
      .get(url)
      .then((response) => {
        let groups = response.data;

        this.setState({ groups: groups });
      })
      .catch(function (error) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
        NotificationManager.error(
          error.response.data.detail,
          `Group Error ${error.response.status}`,
          3000,
          null,
          null,
          ""
        );
      });
  }

  getDepartments() {
    let url = "/api/department/";
    apiAuth
      .get(url)
      .then((response) => {
        let departments = response.data;

        this.setState({ departments: departments });
      })
      .catch(function (error) {
        console.log(error.response?.data);
        console.log(error.response?.status);
        console.log(error.response?.headers);
        NotificationManager.error(
          error.response.data.detail,
          `Get Department Error ${error.response?.status}`,
          3000,
          null,
          null,
          ""
        );
      });
  }

  render() {
    return (
      <Fragment>
        <Row mb="4">
          <Colxx lg="12">
            <Breadcrumb heading="Add User" match={this.props.match} />
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
        <Row mb="4">
          <Colxx lg="4">
            <div className="card mt-4">
              <div className="position-relative"></div>

              <img
                alt="profile"
                src={this.state.file}
                className="card-img-top"
              ></img>
              <div className="card-body">
                <div className="mb-4 card-subtitle">
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
          <Colxx lg="8">
            <div className="card mt-4">
              <div className="card-body">
                <Formik
                  initialValues={{
                    profile_picture: "",
                    email: "",
                    password: "",
                    first_name: "",
                    last_name: "",
                    mobile: "",
                    gender: "M",
                    groups: "",
                  }}
                  validationSchema={Yup.object({
                    email: Yup.string().email().required("Required"),
                    first_name: Yup.string()
                      .max(20, "Must be 20 characters or less")
                      .trim()
                      .required("Required"),
                    last_name: Yup.string()
                      .max(20, "Must be 20 characters or less")
                      .trim()
                      .required("Required"),
                    password: Yup.string()
                      .trim()
                      .required("Please Enter your password")
                      .matches(
                        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/,
                        "Must Contain 6 Characters, One Uppercase, One Lowercase, One Number And One Special Case Character"
                      ),
                    mobile: Yup.string()
                      .required("Required")
                      .matches(/^[0-9]*$/, "Please enter valid number"),
                  })}
                  onSubmit={(values, { resetForm }) => {
                    let url = "/api/admin/users/";
                    let departments = this.state.selectedDepartment.map(
                      (dept) => {
                        return dept.value;
                      }
                    );

                    values.department = departments;
                    values.groups = [this.state.selectedGroup.label];

                    apiAuth.get(url).then((res) => {
                      let flag = false;
                      res.data.forEach((user) => {
                        if (user.email === values.email) flag = true;
                      });

                      if (flag) {
                        NotificationManager.error(
                          "",
                          `User already exist`,
                          3000,
                          null,
                          null,
                          ""
                        );
                      } else {
                        apiAuth.post(url, values).then((response) => {
                          console.log(response);
                          console.log(response.data);
                          if (response.status === 201) {
                            NotificationManager.success(
                              "User",
                              `User Added Successfully`,
                              3000,
                              null,
                              null,
                              ""
                            );

                            this.props.history.goBack();
                          } else {
                            NotificationManager.error(
                              "User",
                              `User Add Error`,
                              3000,
                              null,
                              null,
                              ""
                            );
                          }
                        });
                      }
                    });
                  }}
                >
                  <Form className="av-tooltip tooltip-label-bottom ">
                    <Row>
                      <Colxx lg="6">
                        <div className="form-group">
                          <Label htmlFor="email">Email</Label>
                          <Field
                            className="form-control"
                            name="email"
                            type="text"
                            placeholder="Email"
                          />

                          <ErrorMessage
                            name="email"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Colxx>
                      <Colxx lg="6">
                        <div className="form-group">
                          <Label htmlFor="password">Password</Label>
                          <div className="pass-wrapper">
                            <Field
                              className="form-control"
                              name="password"
                              type={
                                this.state.is_password_hidden
                                  ? "password"
                                  : "text"
                              }
                              placeholder="Password"
                            />
                            {this.state.is_password_hidden ? (
                              <i
                                className="fa fa-eye"
                                onClick={() =>
                                  this.setState({ is_password_hidden: false })
                                }
                              ></i>
                            ) : (
                              <i
                                className="fa fa-eye-slash"
                                onClick={() =>
                                  this.setState({ is_password_hidden: true })
                                }
                              ></i>
                            )}
                          </div>
                          <ErrorMessage
                            name="password"
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
                          <Label htmlFor="policy">Departments</Label>
                          <Select
                            isMulti
                            options={this.state.departments.map((dept) => {
                              return {
                                value: dept.name,
                                label: dept.name,
                              };
                            })}
                            onChange={this.handleChangeDepartment}
                          />
                        </div>
                      </Colxx>

                      <Colxx lg="4">
                        {" "}
                        <div className="form-group">
                          <Label htmlFor="policy">Roles</Label>

                          <Select
                            options={this.state.groups.map((group) => {
                              return {
                                value: group.name,
                                label: group.name,
                              };
                            })}
                            onChange={this.handleChangeGroup}
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
                      <span className="label">Add</span>
                    </Button>{" "}
                    <Button
                      className="btn btn-light float-right"
                      type="reset"
                      onClick={() => this.props.history.goBack()}
                    >
                      {" "}
                      Cancel{" "}
                    </Button>
                  </Form>
                </Formik>
              </div>
            </div>
          </Colxx>
        </Row>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ authUser }) => {
  let flag = {
    write: true,
    edit: true,
  };
  let rol = "superadmin";

  return {
    permission: flag,
    role: rol,
  };
};

const mapActionsToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapActionsToProps)(UserAdd);
