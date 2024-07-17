import React, { Component, Fragment } from "react";
import { Row, Button, Label } from "reactstrap";
import * as Yup from "yup";
// import { Modal } from "react-bootstrap";
import { Formik, Field, ErrorMessage } from "formik";
import { Form, Datepicker } from "react-formik-ui";
import { connect } from "react-redux";
import Breadcrumb from "../../containers/navs/Breadcrumb";
import { Colxx, Separator } from "../../components/common/CustomBootstrap";
import apiAuth from "../../helpers/ApiAuth";
import { NotificationManager } from "../../components/common/react-notifications";
import Select from "react-select";
import moment from "moment";

class AddNewScore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      goals: [],
      selectedGoal: null,
      indicators: [],
      states: [],
      indDb: {},
      numerator_value: '',
      denominator_value: '',
      calculated_value: ''
    };
    this.handleDenominatorChange = this.handleDenominatorChange.bind(this);
    this.handleNumeratorChange = this.handleNumeratorChange.bind(this);
    this.calculateValue = this.calculateValue.bind(this);
  }

  handleChangeGoal = (selectedGoal) => {
    this.setState({ selectedGoal });
  };

  componentDidMount() {
    this.getGoals();
    this.getIndicators();
    this.getStates();
    this.getDistrict();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.numerator_value !== this.state.numerator_value ||
      prevState.denominator_value !== this.state.denominator_value
    ) {
      this.calculateValue();
    }
  }

  handleNumeratorChange = (event) => {
    this.setState({ numerator_value: event.target.value });
  };

  handleDenominatorChange = (event) => {
    this.setState({ denominator_value: event.target.value });
  };

  calculateValue = () => {
    const { numerator_value, denominator_value } = this.state;
    if (denominator_value !== '') {
      this.setState({ calculated_value: numerator_value / denominator_value });
     
    } else {
      this.setState({ calculated_value: '' });
    }
  };

  determineCategory = (score) => {
    if (score === 100) {
      return "Achiever";
    } else if (score >= 65 && score <= 99) {
      return "Front Runner";
    } else if (score >= 50 && score <= 64) {
      return "Performer";
    } else if (score > 0 && score <= 49) {
      return "Aspirant";
    } else if (score === 0) {
      return "No Target";
    }
    return " ";
  };


  getGoals = () => {
    let url = "/api/goal/";
    apiAuth
      .get(url)
      .then((response) => {
        let goals = response.data;

        this.setState({ goals: goals });
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

  getIndicators = () => {
    let url = "/api/indicator/view/";
    apiAuth
      .get(url)
      .then((response) => {
        let indicators = response.data.filter((ind) => {
          if (this.props.deprtments?.length > 0) {
            return this.props.deprtments.includes(ind.department);
          }

          return true;
        });
        let indDb = {};

        indicators.forEach((ind) => {
          indDb[ind.name] = true;
        });
        this.setState({ indicators: indicators, indDb: indDb });
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
  getStates = () => {
    let url = "/api/state/view/";
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
  getDistrict = () => {
    let url = "/api/district/view/";
    apiAuth
      .get(url)
      .then((response) => {
        let districts = response.data;

        this.setState({ districts: districts });
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


  render() {
    return (
      <Fragment>
        <Row mb="4">
          <Colxx lg="12">
            <Breadcrumb heading="Raw Data Entry" match={this.props.match} />
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
                    goal: "",
                    indicator: "",
                    year: "",
                    name:"",
                    category:"",
                    type: this.props.roles?.includes("district_data_creator")
                      ? "DIF"
                      : "SIF",
                    remarks: "",
                    vetted_by_department: false,
                    vetted_by_officer: false,
                    vetted_by: "",
                    report_date: "",
                    denominator_value: "",
                    numerator_value: "",
                    score_value: "",
                  }}
                  validationSchema={Yup.object({
                    goal: Yup.string().required("Required"),
                  })}
                  onSubmit={(values, { resetForm }) => {
                    let url = "/api/newscore/";
                    values.goal = values.goal?.value;
                    values.indicator = values.indicator?.value?.id;
                    values.report_date = values.report_date
                      ? moment(values.report_date).toISOString()
                      : moment().toISOString();
                    values.score_value = this.state.calculated_value;
                    apiAuth
                      .post(url, values)
                      .then((response) => {
                        console.log(response);
                        console.log(response.data);
                        NotificationManager.success(
                          "Data Entry",
                          `Data Added Successfully.`,
                          3000,
                          null,
                          null,
                          ""
                        ); return false;
                       // this.props.history.goBack();
                      })
                      .catch((error) => {
                        NotificationManager.error(
                          "Data Entry",
                          `Data Entry Add Error`,
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
                              onChange={(val) => {
                                setFieldValue("goal", val);
                                setFieldValue("indicator", "");
                              }}
                            />
                          </div>
                        </Colxx>
                        <Colxx lg="4">
                          <div className="form-group">
                            <Label htmlFor="year">Year</Label>
                            <Field
                              className="form-control"
                              name="year"
                              type="text"
                              placeholder={new Date().getFullYear()}
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
                          <div className="form-group">
                            <Label htmlFor="type">Data Type</Label>
                            <Field
                              as="select"
                              name="type"
                              className="form-control"
                            >
                              {this.props.roles?.includes(
                                "district_data_creator"
                              ) ? (
                                <></>
                              ) : (
                                <option value="SIF">State</option>
                              )}
                              {this.props.roles?.includes(
                                "state_data_creator"
                              ) ? (
                                <></>
                              ) : (
                                <option value="DIF">District</option>
                              )}
                            </Field>
                            <ErrorMessage
                              name="type"
                              render={(msg) => (
                                <div className="text-danger">{msg}</div>
                              )}
                            />
                          </div>
                        </Colxx>
                        {values["type"] === "SIF" ? (
                          <Colxx lg="4">
                            <div className="form-group">
                              <Label htmlFor="policy">Select State</Label>

                              <Select
                                options={this.state.states.filter((stateData)=>stateData.name.includes('Nagaland')).map((dept) => {
                                  return {
                                    value: dept.name,
                                    label: dept.name,
                                  };
                                })}
                                
                                onChange={(val) => {
                                  setFieldValue("name", val.value);
                                }}
                              />
                            </div>
                          </Colxx>
                        ) : (
                          <></>
                        )}
                         {values["type"] === "DIF" ? (
                          <Colxx lg="4">
                            <div className="form-group">
                              <Label htmlFor="policy">Select District</Label>

                              <Select
                                options={this.state.districts.map((dept) => {
                                  return {
                                    value: dept.name,
                                    label: dept.name,
                                  };
                                })}
                                onChange={(val) => {
                                  setFieldValue("name", val.value);
                                }}
                              />
                            </div>
                          </Colxx>
                        ) : (
                          <></>
                        )}
                        <Colxx lg="4">
                          <div className="form-group">
                            <Label htmlFor="policy">Select Indicator</Label>
                            <Select
                              // key={Math.random()}
                              options={this.state.indicators
                                .filter(
                                  (ind) => ind.goal === values["goal"]?.label
                                )
                                .filter((ind) => ind.type === values.type)
                                .filter((ind) => {
                                  if (this.props.deprtments?.length > 0) {
                                    return this.props.deprtments.includes(
                                      ind.department
                                    );
                                  }

                                  return true;
                                })
                                .map((dept) => {
                                  return {
                                    value: dept,
                                    label: dept.name,
                                  };
                                })}
                              value={values["indicator"]}
                              onChange={(val) => {
                             
                                setFieldValue("indicator", val);
                                this.setState({ calculated_value: '' })
                                this.setState({ denominator_value:'' });
                                this.setState({ numerator_value: '' });
                              }}
                            />
                          </div>
                        </Colxx>
                        {values["indicator"]?.value?.department !== "NITI AAYOG" && (
                          <>
                            <Colxx lg="4">
                              <div className="form-group">
                                <Label htmlFor="numerator_value">
                                  Numerator Value({values["indicator"]?.value?.numerator_label})
                                </Label>
                                <Field
                                  className="form-control"
                                  name="numerator_value"
                                  type="text"
                                  placeholder="Numerator value"
                                  value={this.state.numerator_value}
                                  onChange={(e) => {
                                    this.handleNumeratorChange(e);
                                    setFieldValue("numerator_value", e.target.value);
                                  }}
                                />
                                <ErrorMessage
                                  name="numerator_value"
                                  render={(msg) => <div className="text-danger">{msg}</div>}
                                />
                              </div>
                            </Colxx>
                            <Colxx lg="4">
                              <div className="form-group">
                                <Label htmlFor="denominator_value">
                                  Denominator Value({values["indicator"]?.value?.denominator_label})
                                </Label>
                               
                                <Field
                                  className="form-control"
                                  name="denominator_value"
                                  type="text"
                                  placeholder="Denominator value"
                                  value={this.state.denominator_value}
                                  onChange={(e) => {
                                    this.handleDenominatorChange(e);
                                    setFieldValue("denominator_value", e.target.value);
                                    setFieldValue("category",this.determineCategory(Number(this.state.numerator_value/e.target.value)))
                                  }}
                                />
                                <ErrorMessage
                                  name="denominator_value"
                                  render={(msg) => <div className="text-danger">{msg}</div>}
                                />
                              </div>
                            </Colxx>
                            
                          </>
                        )}

                        <Colxx lg="4">
                          <div className="form-group">
                            <Label htmlFor="score_value">Calculated Value</Label>
                            <Field
                              className="form-control"
                              name="score_value"
                              type="text"
                              placeholder="Calculated value"
                             {...(this.state.calculated_value ? { value: this.state.calculated_value } : {})}
                              value={Math.floor(this.state.calculated_value * 100) / 100}
                              readOnly={this.state.denominator_value > 0}
                             
                              onChange={(e) => {
                                const value = e.target.value;
                                this.setState({ calculated_value: value === '' ? '' : value });
                                setFieldValue("value", value);
                                setFieldValue("category",this.determineCategory(Number(value))
                                );
                              }}
                              
                            />
                          
                            <ErrorMessage
                              name="calculated_value"
                              render={(msg) => <div className="text-danger">{msg}</div>}
                            />
                          </div>
                        </Colxx>

                        <Colxx lg="4">
                          <div className="form-group">
                          <Label htmlFor="category">Category</Label>
                            <Field
                              className="form-control"
                              name="category"
                              type="text"
                              value={values.category}
                              disabled
                            />

                            <ErrorMessage
                              name="category"
                              render={(msg) => (
                                <div className="text-danger">{msg}</div>
                              )}
                            />
                          </div>
                        </Colxx>

                        <Colxx lg="4">
                          <div className="form-group">
                            <Label htmlFor="report_date">Report Date</Label>
                            <Datepicker
                              className="form-group"
                              name="report_date"
                            />
                          </div>
                        </Colxx>
                        <Colxx lg="12">
                          <div className="form-group">
                            <Label htmlFor="vetted_by">
                              Vetted By (Officer Name, Designation)
                            </Label>
                            <Field
                              className="form-control"
                              name="vetted_by"
                              type="text"
                              placeholder=""
                            />

                            <ErrorMessage
                              name="vetted_by"
                              render={(msg) => (
                                <div className="text-danger">{msg}</div>
                              )}
                            />
                          </div>
                        </Colxx>
                        <Colxx lg="12">
                          <div className="form-group">
                            <Label htmlFor="remarks">Remarks (If any)</Label>
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
                      </Row>
                      <Separator className="mb-4 mt-4" />
                      <Button
                        type="submit"
                        color="primary"
                        className={`btn-shadow btn-multiple-state  ${this.props.loading ? "show-spinner" : ""
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
      </Fragment>
    );
  }
}

const mapStateToProps = ({ authUser }) => {
  return {
    roles: authUser.roles,
    deprtments: authUser.department,
  };
};

const mapActionsToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapActionsToProps)(AddNewScore);
