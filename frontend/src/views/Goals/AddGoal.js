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

class AddGoal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      states: [],
      selectedState: null,
    };
  }

  handleChangeState = (selectedState) => {
    this.setState({ selectedState });
  };

  componentDidMount() {
    this.getStates();
    this.getGoals();
  }

  getStates = () => {
    let url = "/api/state/";
    apiAuth
      .get(url)
      .then((response) => {
        let states = response.data;

        this.setState({ states: states });
      })
      .catch(function (error) {
        console.log(error.response?.data);
        console.log(error.response?.status);
        console.log(error.response?.headers);
        NotificationManager.error(
          error.response?.data?.detail,
          `Get States Error ${error.response?.status}`,
          3000,
          null,
          null,
          ""
        );
      });
  };

  getGoals = () => {
    let url = "/api/goal/";
    apiAuth
      .get(url)
      .then((response) => {
        let goals = response.data.map((dept) => {
          return dept.name?.toLowerCase();
        });

        this.setState({ goals: goals });
      })
      .catch(function (error) {
        console.log(error.response?.data);
        console.log(error.response?.status);
        console.log(error.response?.headers);
        NotificationManager.error(
          error.response.data.detail,
          `Get Goal Error ${error.response?.status}`,
          3000,
          null,
          null,
          ""
        );
      });
  };

  render() {
    return (
      <Fragment>
        <Row mb="4">
          <Colxx lg="12">
            <Breadcrumb heading="Add Goal" match={this.props.match} />
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
                  initialValues={{}}
                  validationSchema={Yup.object({
                    name: Yup.string().trim().required("Required"),
                    sno: Yup.string().trim(),
                  })}
                  onSubmit={(values, { resetForm }) => {
                    let url = "/api/goal/create/";
                    values.state = this.state.selectedState?.value;

                    if (
                      this.state.goals.includes(
                        String(values.name).toLowerCase()
                      )
                    ) {
                      NotificationManager.error(
                        "Goal",
                        `Goal already exit.`,
                        3000,
                        null,
                        null,
                        ""
                      );
                    } else if (!this.state.selectedState) {
                      NotificationManager.error(
                        "Goal",
                        `Please select a state.`,
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
                            "Goal",
                            `Goal Added Successfully`,
                            3000,
                            null,
                            null,
                            ""
                          );

                          this.props.history.goBack();
                        } else {
                          NotificationManager.error(
                            "Goal",
                            `Goal Add Error`,
                            3000,
                            null,
                            null,
                            ""
                          );
                        }
                      });
                    }
                  }}
                >
                  <Form className="av-tooltip tooltip-label-bottom ">
                    <Row>
                      <Colxx lg="4">
                        {" "}
                        <div className="form-group">
                          <Label htmlFor="name">Goal Name</Label>
                          <Field
                            className="form-control"
                            name="name"
                            placeholder="Goal Name"
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
                      <Colxx lg="4">
                        {" "}
                        <div className="form-group">
                          <Label htmlFor="sno">Goal SNO</Label>
                          <Field
                            className="form-control"
                            name="sno"
                            placeholder="Goal Serial Number"
                            type="text"
                          />
                          <ErrorMessage
                            name="sno"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Colxx>

                      <Colxx lg="4">
                        {" "}
                        <div className="form-group">
                          <Label htmlFor="policy">State</Label>

                          <Select
                            options={this.state.states.map((state) => {
                              return {
                                value: state.id,
                                label: state.name,
                              };
                            })}
                            onChange={this.handleChangeState}
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
  return {};
};

const mapActionsToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapActionsToProps)(AddGoal);
