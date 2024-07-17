import React, { Component, Fragment } from "react";
import { Row, Button, Label } from "reactstrap";
import * as Yup from "yup";
import { Formik, Field, ErrorMessage } from "formik";
import { Form } from "react-formik-ui";
import Select from "react-select";
import { connect } from "react-redux";
import { Colxx, Separator } from "../../components/common/CustomBootstrap";
import apiAuth from "../../helpers/ApiAuth";
import { NotificationManager } from "../../components/common/react-notifications";

class EditIndicator extends Component {
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
          `Get Scheme Error ${error.response?.status}`,
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
          return indicator.name?.toLowerCase();
        });

        this.setState({ indicators: indicators }, () => {
          this.handleData();
        });
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

  handleData = () => {
    let data = this.props.indicator;
    let selectedGoal = null;
    let selectedDepartment = null;
    let selectedPeriodicity = null;
    let selectedUnit = null;
    let selectedScheme = null;

    let goalOptions = this.state.goals.map((dept) => {
      if (data.goal === dept.name) {
        selectedGoal = {
          value: dept.id,
          label: dept.name,
        };
      }
      return {
        value: dept.id,
        label: dept.name,
      };
    });

    let deptOptions = this.state.departments.map((dept) => {
      if (data.department === dept.name) {
        selectedDepartment = {
          value: dept.id,
          label: dept.name,
        };
      }
      return {
        value: dept.id,
        label: dept.name,
      };
    });

    let unitOptions = this.state.units.map((dept) => {
      if (data.unit === dept.name) {
        selectedUnit = {
          value: dept.id,
          label: dept.name,
        };
      }
      return {
        value: dept.id,
        label: dept.name,
      };
    });

    let periodicityOptions = this.state.periodicity.map((dept) => {
      if (data.periodicity === dept.name) {
        selectedPeriodicity = {
          value: dept.id,
          label: dept.name,
        };
      }
      return {
        value: dept.id,
        label: dept.name,
      };
    });

    let schemeOptions = this.state.schemes.map((dept) => {
      if (data.scheme === dept.name) {
        selectedScheme = {
          value: dept.id,
          label: dept.name,
        };
      }
      return {
        value: dept.id,
        label: dept.name,
      };
    });

    this.setState(
      {
        goalOptions,
        deptOptions,
        periodicityOptions,
        unitOptions,
        schemeOptions,
        selectedGoal,
        selectedDepartment,
        selectedPeriodicity,
        selectedUnit,
        selectedScheme,
      },
      () => {
        this.setState({ loading: false });
      }
    );
  };

  render() {
    return (
      <Fragment>
        {!this.state.loading ? (
          <Row mb="4">
            <Colxx lg="12">
              <div className="card mt-4">
                <div className="card-body">
                  <Formik
                    initialValues={{
                      name: this.props.indicator?.name
                        ? this.props.indicator?.name
                        : "",
                      type: this.props.indicator?.type
                        ? this.props.indicator?.type
                        : "",
                      year: this.props.indicator?.year
                        ? this.props.indicator?.year
                        : "",
                      comment: this.props.indicator?.comment
                        ? this.props.indicator?.comment
                        : "",
                      numerator_label: this.props.indicator?.numerator_label
                        ? this.props.indicator?.numerator_label
                        : "",
                      denominator_label: this.props.indicator?.denominator_label
                        ? this.props.indicator?.denominator_label
                        : "",
                    }}
                    validationSchema={Yup.object({
                      name: Yup.string().trim().required("Required"),
                      year: Yup.string().trim().required("Required"),
                    })}
                    onSubmit={(values, { resetForm }) => {
                      let url = `/api/indicator/${this.props.indicator?.id}/`;
                      values.department = this.state.selectedDepartment?.value;
                      values.goal = this.state.selectedGoal?.value;
                      values.periodicity =
                        this.state.selectedPeriodicity?.value;
                      values.unit = this.state.selectedUnit?.value;
                      values.scheme = this.state.selectedScheme?.value;
                      apiAuth
                        .patch(url, values)
                        .then((response) => {
                          console.log(response);
                          console.log(response.data);

                          setTimeout(() => {
                            NotificationManager.success(
                              "Indicator",
                              `Indicator Updated Successfully`,
                              3000,
                              null,
                              null,
                              ""
                            );
                          }, 1000);

                          this.props.closeBack();
                        })
                        .catch((error) => {
                          NotificationManager.error(
                            "Indicator",
                            `Indicator Update Error`,
                            3000,
                            null,
                            null,
                            ""
                          );
                        });
                    }}
                  >
                    {({ values, setFieldValue }) => (
                      <Form className="av-tooltip tooltip-label-bottom ">
                        <Row>
                          <Colxx lg="6">
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
                          <Colxx lg="6">
                            {" "}
                            <div className="form-group">
                              <Label htmlFor="policy">Goal</Label>

                              <Select
                                value={this.state.selectedGoal}
                                options={this.state.goalOptions}
                                onChange={this.handleChangeGoal}
                              />
                            </div>
                          </Colxx>

                          <Colxx lg="6">
                            {" "}
                            <div className="form-group">
                              <Label htmlFor="policy">Department</Label>

                              <Select
                                value={this.state.selectedDepartment}
                                options={this.state.deptOptions}
                                onChange={this.handleChangeDepartment}
                              />
                            </div>
                          </Colxx>
                          <Colxx lg="6">
                            {" "}
                            <div className="form-group">
                              <Label htmlFor="policy">Periodicity</Label>

                              <Select
                                value={this.state.selectedPeriodicity}
                                options={this.state.periodicityOptions}
                                onChange={this.handleChangePeriodicity}
                              />
                            </div>
                          </Colxx>
                          <Colxx lg="6">
                            {" "}
                            <div className="form-group">
                              <Label htmlFor="policy">Unit</Label>

                              <Select
                                value={this.state.selectedUnit}
                                options={this.state.unitOptions}
                                onChange={this.handleChangeUnit}
                              />
                            </div>
                          </Colxx>
                          <Colxx lg="6">
                            {" "}
                            <div className="form-group">
                              <Label htmlFor="policy">Scheme</Label>

                              <Select
                                value={this.state.selectedScheme}
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
                          <Colxx lg="6">
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
                          <Colxx lg="6">
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
                          <Colxx lg="6">
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
                              <Colxx lg="6">
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
                              <Colxx lg="6">
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
                          <span className="label">Update</span>
                        </Button>{" "}
                        <Button
                          className="btn btn-light float-right"
                          type="reset"
                          onClick={() => this.props.closeBack()}
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

export default connect(mapStateToProps, mapActionsToProps)(EditIndicator);
