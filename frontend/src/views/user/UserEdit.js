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

    this.state = {
      groups: [],
      selectedDepartment: [],
      departments: [],
      is_new: true,
      file: null,
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
    this.getDepartments();
    this.getGroups();
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
        this.getUser();
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

  getUser() {
    let url =
      this.props.role === "company_admin"
        ? "/api/company_admin/users/"
        : "/api/admin/users/";
    apiAuth
      .get(url)
      .then((response) => {
        response.data.forEach((usr) => {
          if (usr.id === Number(this.props.match.params.userID)) {
            let departments = usr.department?.map((dept) => {
              return {
                value: dept,
                label: dept,
              };
            });
            this.setState({
              user: usr,
              selectedDepartment: departments,
              selectedGroup: { value: usr.groups[0], label: usr.groups[0] },
              file: usr.image,
            });
          }
        });
      })
      .catch(function (error) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      });
  }

  render() {
    return (
      <Fragment>
        <Row mb="4">
          <Colxx lg="12">
            <Breadcrumb heading="Edit User" match={this.props.match} />
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
        {this.state.user ? (
          <>
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
                        email: this.state.user?.email
                          ? this.state.user.email
                          : "",
                        first_name: this.state.user?.first_name
                          ? this.state.user.first_name
                          : "",
                        last_name: this.state.user?.last_name
                          ? this.state.user.last_name
                          : "",
                        mobile: this.state.user?.mobile
                          ? this.state.user.mobile
                          : "",
                        groups: this.state.user?.groups[0]
                          ? this.state.user.groups[0]
                          : "",
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
                        mobile: Yup.string()
                          .required("Required")
                          .matches(/^[0-9]*$/, "Please enter valid number"),
                      })}
                      onSubmit={(values, { resetForm }) => {
                        let urll = "/api/admin/users/";
                        const url = `${urll}${this.props.match.params.userID}/`;

                        let departments = this.state.selectedDepartment.map(
                          (dept) => {
                            return dept.value;
                          }
                        );

                        values.department = departments;
                        values.groups = [this.state.selectedGroup.label];

                        apiAuth.get(urll).then((res) => {
                          let flag = false;
                          res.data.forEach((usr) => {
                            console.log(
                              "ffffffff",
                              usr.email,
                              values["email"],
                              usr.id,
                              this.state.user.id
                            );
                            if (
                              usr.email === values["email"] &&
                              usr.id !== this.state.user.id
                            )
                              flag = true;
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
                            apiAuth.put(url, values).then((response) => {
                              console.log(response);
                              console.log(response.data);
                              if (response.status === 200) {
                                NotificationManager.success(
                                  "User",
                                  `User Edited Successfully`,
                                  3000,
                                  null,
                                  null,
                                  ""
                                );

                                this.props.history.goBack();
                              } else {
                                NotificationManager.error(
                                  "User",
                                  `User Edit Error`,
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
                          <Colxx lg="4">
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
                                defaultValue={this.state.selectedDepartment}
                                onChange={this.handleChangeDepartment}
                              />
                            </div>
                          </Colxx>

                          <Colxx lg="4">
                            {" "}
                            <div className="form-group">
                              <Label htmlFor="policy">Roles</Label>

                              <Select
                                defaultValue={this.state.selectedGroup}
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
                          <span className="label">Save</span>
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
          </>
        ) : (
          <></>
        )}
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
