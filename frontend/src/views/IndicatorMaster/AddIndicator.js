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

class AddIndicator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      departments: [],
      goals: [],
      periodicity: [],
      units: [],
      indicators: [],
      schemes: [],
      selectedDepartment: null,
      selectedGoal: null,
      selectedPeriodicity: null,
      selectedUnit: null,
    };
  }

  handleChangeDepartment = (selectedDepartment) => {
    this.setState({ selectedDepartment });
  };

  handleChangeGoal = (selectedGoal) => {
    this.setState({ selectedGoal });
  };

  handleChangePeriodicity = (selectedPeriodicity) => {
    this.setState({ selectedPeriodicity });
  };

  handleChangeUnit = (selectedUnit) => {
    this.setState({ selectedUnit });
  };

  handleChangeScheme = (selectedScheme) => {
    this.setState({ selectedScheme });
  };

  componentDidMount() {
    this.getDepartments();
  }

  getDepartments = () => {
    this.setState({ loading: true });
    let url = "/api/department/";
    apiAuth
      .get(url)
      .then((response) => {
        let departments = response.data;

        this.setState({ departments: departments }, () => {
          this.getGoals();
        });
      })
      .catch(function (error) {
        console.log(error.response?.data);
        console.log(error.response?.status);
        console.log(error.response?.headers);
        NotificationManager.error(
          error.response?.data?.detail,
          `Get Department Error ${error.response?.status}`,
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
        let goals = response.data;

        this.setState({ goals: goals }, () => {
          this.getPeriodicity();
        });
      })
      .catch(function (error) {
        console.log(error.response?.data);
        console.log(error.response?.status);
        console.log(error.response?.headers);
        NotificationManager.error(
          error.response?.data?.detail,
          `Get Goal Error ${error.response?.status}`,
          3000,
          null,
          null,
          ""
        );
      });
  };

  getPeriodicity = () => {
    let url = "/api/periodicity/";
    apiAuth
      .get(url)
      .then((response) => {
        let periodicity = response.data;

        this.setState({ periodicity: periodicity }, () => {
          this.getUnits();
        });
      })
      .catch(function (error) {
        console.log(error.response?.data);
        console.log(error.response?.status);
        console.log(error.response?.headers);
        NotificationManager.error(
          error.response?.data?.detail,
          `Get Periodicity Error ${error.response?.status}`,
          3000,
          null,
          null,
          ""
        );
      });
  };

  getUnits = () => {
    let url = "/api/unit/";
    apiAuth
      .get(url)
      .then((response) => {
        let units = response.data;

        this.setState({ units: units }, () => {
          this.getSchemes();
        });
      })
      .catch(function (error) {
        console.log(error.response?.data);
        console.log(error.response?.status);
        console.log(error.response?.headers);
        NotificationManager.error(
          error.response?.data?.detail,
          `Get Unit Error ${error.response?.status}`,
          3000,
          null,
          null,
          ""
        );
      });
  };

  getSchemes = () => {
    let url = "/api/scheme/";
    apiAuth
      .get(url)
      .then((response) => {
        let schemes = response.data;

        this.setState({ schemes: schemes }, () => {
          this.getIndicators();
        });
      })
      .catch(function (error) {
        console.log(error.response?.data);
        console.log(error.response?.status);
        console.log(error.response?.headers);
        NotificationManager.error(
          error.response?.data?.detail,
          `Get Unit Error ${error.response?.status}`,
          3000,
          null,
          null,
          ""
        );
      });
  };

  getIndicators = () => {
    let url = "/api/indicator/";
    apiAuth
      .get(url)
      .then((response) => {
        let indicators = response.data.map((indicator) => {
          return String(
            `${indicator.name?.toLowerCase()}-${indicator.year}`
          ).toLowerCase();
        });

        this.setState({ indicators: indicators, loading: false });
      })
      .catch(function (error) {
        console.log(error.response?.data);
        console.log(error.response?.status);
        console.log(error.response?.headers);
        NotificationManager.error(
          error.response?.data?.detail,
          `Get Indicator Error ${error.response?.status}`,
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
            <Breadcrumb heading="Add Indicator" match={this.props.match} />
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
        {!this.state.loading ? (
          <Row mb="4">
            <Colxx lg="8">
              <div className="card mt-4">
                <div className="card-body">
                  <Formik
                    initialValues={{
                      name: "",
                      type: "DIF",
                      year: "",
                      comment: "",
                      numerator_label: "",
                      denominator_label: "",
                      // target: "",
                    }}
                    validationSchema={Yup.object({
                      name: Yup.string().trim().required("Required"),
                      year: Yup.string().trim().required("Required"),
                    })}
                    onSubmit={(values, { resetForm }) => {
                      let url = "/api/indicator/";
                      values.department = this.state.selectedDepartment?.value;
                      values.goal = this.state.selectedGoal?.value;
                      values.periodicity =
                        this.state.selectedPeriodicity?.value;
                      values.unit = this.state.selectedUnit?.value;
                      values.scheme = this.state.selectedScheme?.value;

                      if (
                        this.state.indicators?.includes(
                          String(
                            `${values.name?.toLowerCase()}-${values.year}`
                          ).toLowerCase()
                        )
                      ) {
                        NotificationManager.error(
                          "Indicator",
                          `Indicator already exist.`,
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
                              "Indicator",
                              `Indicator Added Successfully`,
                              3000,
                              null,
                              null,
                              ""
                            );

                            this.props.history.goBack();
                          } else {
                            NotificationManager.error(
                              "Indicator",
                              `Indicator Add Error`,
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
                    {({ values, setFieldValue }) => (
                      <Form className="av-tooltip tooltip-label-bottom ">
                        <Row>
                          <Colxx lg="4">
                            {" "}
                            <div className="form-group">
                              <Label htmlFor="name">Indicator Name</Label>
                              <Field
                                className="form-control"
                                name="name"
                                placeholder="Indicator Name"
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
                              <Label htmlFor="policy">Goal</Label>

                              <Select
                                options={this.state.goals.map((dept) => {
                                  return {
                                    value: dept.id,
                                    label: dept.name,
                                  };
                                })}
                                onChange={this.handleChangeGoal}
                              />
                            </div>
                          </Colxx>

                          <Colxx lg="4">
                            {" "}
                            <div className="form-group">
                              <Label htmlFor="policy">Department</Label>

                              <Select
                                options={this.state.departments.map((dept) => {
                                  return {
                                    value: dept.id,
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
                              <Label htmlFor="policy">Periodicity</Label>

                              <Select
                                options={this.state.periodicity.map((dept) => {
                                  return {
                                    value: dept.id,
                                    label: dept.name,
                                  };
                                })}
                                onChange={this.handleChangePeriodicity}
                              />
                            </div>
                          </Colxx>
                          <Colxx lg="4">
                            {" "}
                            <div className="form-group">
                              <Label htmlFor="policy">Unit</Label>

                              <Select
                                options={this.state.units.map((dept) => {
                                  return {
                                    value: dept.id,
                                    label: dept.name,
                                  };
                                })}
                                onChange={this.handleChangeUnit}
                              />
                            </div>
                          </Colxx>
                          <Colxx lg="4">
                            {" "}
                            <div className="form-group">
                              <Label htmlFor="policy">Scheme</Label>

                              <Select
                                options={this.state.schemes.map((dept) => {
                                  return {
                                    value: dept.id,
                                    label: dept.name,
                                  };
                                })}
                                onChange={this.handleChangeScheme}
                              />
                            </div>
                          </Colxx>
                          <Colxx lg="4">
                            {" "}
                            <div className="form-group">
                              <Label htmlFor="type">Indicator Type</Label>
                              <Field
                                as="select"
                                name="type"
                                className="form-control"
                              >
                                <option value="DIF">District</option>
                                <option value="SIF">State</option>
                              </Field>
                              <ErrorMessage
                                name="type"
                                render={(msg) => (
                                  <div className="text-danger">{msg}</div>
                                )}
                              />
                            </div>
                          </Colxx>
                          <Colxx lg="4">
                            {" "}
                            <div className="form-group">
                              <Label htmlFor="year">Indicator Year</Label>
                              <Field
                                className="form-control"
                                name="year"
                                placeholder="2022"
                                type="text"
                              />
                              <ErrorMessage
                                name="year"
                                render={(msg) => (
                                  <div className="text-danger">{msg}</div>
                                )}
                              />
                            </div>
                          </Colxx>
                          <Colxx lg="4">
                            {" "}
                            <div className="form-group">
                              <Label htmlFor="comment">Comment</Label>
                              <Field
                                className="form-control"
                                name="comment"
                                placeholder=""
                                type="text"
                              />
                              <ErrorMessage
                                name="comment"
                                render={(msg) => (
                                  <div className="text-danger">{msg}</div>
                                )}
                              />
                            </div>
                          </Colxx>
                          {values.type === "DIF" ||
                          values.type === "SIF" ? (
                            <>
                              <Colxx lg="4">
                                {" "}
                                <div className="form-group">
                                  <Label htmlFor="numerator_label">
                                    Numerator Label
                                  </Label>
                                  <Field
                                    className="form-control"
                                    name="numerator_label"
                                    placeholder=""
                                    type="text"
                                  />
                                  <ErrorMessage
                                    name="numerator_label"
                                    render={(msg) => (
                                      <div className="text-danger">{msg}</div>
                                    )}
                                  />
                                </div>
                              </Colxx>
                              <Colxx lg="4">
                                {" "}
                                <div className="form-group">
                                  <Label htmlFor="denominator_label">
                                    Denominator Label
                                  </Label>
                                  <Field
                                    className="form-control"
                                    name="denominator_label"
                                    placeholder=""
                                    type="text"
                                  />
                                  <ErrorMessage
                                    name="denominator_label"
                                    render={(msg) => (
                                      <div className="text-danger">{msg}</div>
                                    )}
                                  />
                                </div>
                              </Colxx>
                              {/* <Colxx lg="4">
                                {" "}
                                <div className="form-group">
                                  <Label htmlFor="target">Target</Label>
                                  <Field
                                    className="form-control"
                                    name="target"
                                    placeholder=""
                                    type="text"
                                  />
                                  <ErrorMessage
                                    name="target"
                                    render={(msg) => (
                                      <div className="text-danger">{msg}</div>
                                    )}
                                  />
                                </div>
                              </Colxx> */}
                            </>
                          ) : (
                            <></>
                          )}
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
                    )}
                  </Formik>
                </div>
              </div>
            </Colxx>
          </Row>
        ) : (
          <>
            <div className="loading"></div>
          </>
        )}
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

export default connect(mapStateToProps, mapActionsToProps)(AddIndicator);
