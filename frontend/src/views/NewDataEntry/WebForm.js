import React, { Component, Fragment } from "react";
import { Row, Button, Label } from "reactstrap";
import * as Yup from "yup";
// import { Modal } from "react-bootstrap";
import { Formik, Field, ErrorMessage } from "formik";
import { Form } from "react-formik-ui";
import { connect } from "react-redux";
import Breadcrumb from "../../containers/navs/Breadcrumb";
import { Colxx, Separator } from "../../components/common/CustomBootstrap";
import apiAuth from "../../helpers/ApiAuth";
import { NotificationManager } from "../../components/common/react-notifications";

class DataWebForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: [],
      selectedGroup: null,
    };
  }

  handleChangeGroup = (selectedGroup) => {
    this.setState({ selectedGroup });
  };

  componentDidMount() {
    this.getGroups();
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

  render() {
    return (
      <Fragment>
        <Row mb="4">
          <Colxx lg="12">
            <Breadcrumb heading="Data Web Form" match={this.props.match} />
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
          <Colxx lg="8">
            <div className="card mt-4">
              <div className="card-body">
                <Formik
                  initialValues={{
                    department: "",
                    goal: "",
                    time_period: "",
                    groups: "",
                  }}
                  validationSchema={Yup.object({})}
                  onSubmit={(values, { resetForm }) => {
                    let url =
                      this.props.role === "company_admin"
                        ? "/api/company_admin/users/"
                        : "/api/admin/users/";

                    values.company = [this.state.selectedEntity.label];
                    values.groups = [this.state.selectedGroup.label];

                    apiAuth.get(url).then((res) => {
                      let flag = false;
                      res.data.forEach((user) => {
                        if (user.email === values.email) flag = true;
                      });

                      if (flag) {
                        NotificationManager.error(
                          "",
                          `Data already exist`,
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
                              "New Data Entry",
                              `Data Added Successfully`,
                              3000,
                              null,
                              null,
                              ""
                            );

                            this.props.history.goBack();
                          } else {
                            NotificationManager.error(
                              "New Data Entry",
                              `Data Add Error`,
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
                          <Label htmlFor="department">Department</Label>
                          <Field
                            as="select"
                            name="department"
                            className="form-control"
                          >
                            <option value="IT">Information Technology</option>
                          </Field>
                          <ErrorMessage
                            name="department"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Colxx>
                      <Colxx lg="4">
                        <div className="form-group">
                          <Label htmlFor="goal">Goal</Label>
                          <Field
                            as="select"
                            name="goal"
                            className="form-control"
                          >
                            <option value="Goal 1">Goal 1</option>
                          </Field>
                          <ErrorMessage
                            name="goal"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Colxx>

                      <Colxx lg="4">
                        <div className="form-group">
                          <Label htmlFor="time_period">Time Period</Label>
                          <Field
                            as="select"
                            name="time_period"
                            className="form-control"
                          >
                            <option value="2022">2022</option>
                            <option value="2023">2023</option>
                          </Field>
                          <ErrorMessage
                            name="time_period"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Colxx>
                      <Colxx lg="4">
                        <div className="form-group">
                          <Label htmlFor="data_value">Data Value</Label>
                          <Field
                            className="form-control"
                            name="data_value"
                            type="text"
                            placeholder="Data Value"
                          />

                          <ErrorMessage
                            name="data_value"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Colxx>
                      <Colxx lg="8">
                        <div className="form-group">
                          <Label htmlFor="remarks">Remarks</Label>
                          <Field
                            className="form-control"
                            name="remarks"
                            type="text"
                            placeholder=""
                          />

                          <ErrorMessage
                            name="remarks"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Colxx>
                      <Colxx md="4">
                        <div className="form-group mt-4">
                          <input
                            className="ml-1"
                            name="captcha"
                            type="checkbox"
                            defaultChecked={this.state.isDepartmentChecked}
                            onChange={() => {
                              this.setState({
                                isDepartmentChecked: !this.state.isDepartmentChecked,
                              });
                            }}
                          />
                          <label htmlFor="captcha" className="ml-2">
                            Vetted by department
                          </label>
                        </div>
                      </Colxx>
                      <Colxx md="4">
                        <div className="form-group mt-4">
                          <input
                            className="ml-1"
                            name="captcha"
                            type="checkbox"
                            defaultChecked={this.state.isOfficerChecked}
                            onChange={() => {
                              this.setState({
                                isOfficerChecked: !this.state.isOfficerChecked,
                              });
                            }}
                          />
                          <label htmlFor="captcha" className="ml-2">
                            Vetted by officer
                          </label>
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

export default connect(mapStateToProps, mapActionsToProps)(DataWebForm);
