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

class AddScore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      goals: [],
      selectedGoal: null,
      states: [],
      indicators: [],
      
    };
  }

  handleChangeGoal = (selectedGoal) => {
    this.setState({ selectedGoal });
  };

  componentDidMount() {
    this.getGoals();
    this.getStates();
    this.getIndicators();
    this.getDistrict();
  }

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

  getIndicators = () => {
    let url = "/api/indicator/";
    apiAuth
      .get(url)
      .then((response) => {
        let indicators = response.data;
        this.setState({ indicators: indicators });
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

  render() {
    return (
      <Fragment>
        <Row mb="4">
          <Colxx lg="12">
            <Breadcrumb heading="Data Entry" match={this.props.match} />
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
                    value: "",
                    year: "",
                    name: "India",
                    type: "SIF",
                    remarks: "",
                    vetted_by_department: false,
                    vetted_by_officer: false,
                    vetted_by: "",
                    report_date: "",
                    value_type: {
                      label: "Indicator Score",
                      value: "Indicator",
                    },
                    category: "Aspirant",
                  }}
                  validationSchema={Yup.object({
                    name: Yup.string().trim().required("Required"),
                    goal: Yup.string().required("Required"),
                    value: Yup.number()
                      .typeError("Data value must be a number")
                      .required("Required"),
                    year: Yup.string().required("Required"),
                    type: Yup.string().required("Required"),
                  })}
                  onSubmit={(values, { resetForm }) => {
                    let url = "/api/score/create/";
                    values.goal = values.goal?.value;
                    values.indicator = values.indicator?.value;
                    values.report_date = values.report_date
                      ? moment(values.report_date).toISOString()
                      : moment().toISOString();
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
                        ); 
                        this.props.history.goBack();
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
                              <option value="SIF">State Score</option>
                              <option value="DIF">District Score</option>
                              <option value="National">National Score</option>
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
                             <Label htmlFor="policy">Value Type</Label>

                             <Select
                               options={[
                                 {
                                   label: "Indicator Score",
                                   value: "Indicator",
                                 },
                                 {
                                   label: "Goal Score",
                                   value: "Goal",
                                 },
                               ]}
                               value={values["value_type"]}
                               onChange={(val) => {
                                 setFieldValue("value_type", val);
                               }}
                             />
                           </div>
                         </Colxx>
                        ) : (
                          <></>
                        )}
                        {values["type"] === "SIF" && values["value_type"]?.value === "Indicator" ? (
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
                         {values["type"] === "SIF" && values["value_type"]?.value === "Goal" ? (
                          <Colxx lg="4">
                            <div className="form-group">
                              <Label htmlFor="policy">Select State</Label>

                              <Select
                                options={this.state.states.map((dept) => {
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
                         {values["value_type"]?.value === "Indicator" && values["type"] === "SIF" ? (
                              <Colxx lg="4">
                                <div className="form-group">
                                  <Label htmlFor="policy">
                                    Select Indicator
                                  </Label>

                                  <Select
                                    options={this.state.indicators
                                      .filter(
                                        (ind) =>
                                          ind.goal === values["goal"]?.value &&
                                          String(ind.year) ===
                                            String(values["year"])
                                      )
                                      .filter(
                                        (ind) =>
                                          ind.type ===
                                          (values["type"] === "DIF"
                                            ? "DIF"
                                            : "SIF")
                                      )
                                      .map((dept) => {
                                        return {
                                          value: dept.id,
                                          label: dept.name,
                                        };
                                      })}
                                    value={values["indicator"]}
                                    onChange={(val) => {
                                      setFieldValue("indicator", val);
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
                        {

                        values["type"] === "DIF" ? (
                          <>
                            <Colxx lg="4">
                           <div className="form-group">
                             <Label htmlFor="policy">Value Type</Label>

                             <Select
                               options={[
                                 {
                                   label: "Indicator Score",
                                   value: "Indicator",
                                 },
                                 {
                                   label: "Goal Score",
                                   value: "Goal",
                                 },
                               ]}
                               value={values["value_type"]}
                               onChange={(val) => {
                                 setFieldValue("value_type", val);
                               }}
                             />
                           </div>
                         </Colxx>
                            {values["value_type"]?.value === "Indicator" ? (
                              <Colxx lg="4">
                                <div className="form-group">
                                  <Label htmlFor="policy">
                                    Select Indicator
                                  </Label>

                                  <Select
                                    options={this.state.indicators
                                      .filter(
                                        (ind) =>
                                          ind.goal === values["goal"]?.value &&
                                          String(ind.year) ===
                                            String(values["year"])
                                      )
                                      .filter(
                                        (ind) =>
                                          ind.type ===
                                          (values["type"] === "DIF"
                                            ? "DIF"
                                            : "SIF")
                                      )
                                      .map((dept) => {
                                        return {
                                          value: dept.id,
                                          label: dept.name,
                                        };
                                      })}
                                    value={values["indicator"]}
                                    onChange={(val) => {
                                      setFieldValue("indicator", val);
                                    }}
                                  />
                                </div>
                              </Colxx>
                            ) : (
                              <></>
                            )}
                          </>
                        ) : (
                          <></>
                        )}

                        <Colxx lg="4">
                          <div className="form-group">
                            <Label htmlFor="value">Score Value</Label>
                            <Field
                              className="form-control"
                              name="value"
                              type="text"
                              onChange={(e) => {
                                const value = e.target.value;
                                setFieldValue("value", value);
                                setFieldValue(
                                  "category",
                                  this.determineCategory(Number(value))
                                );
                              }}
                            />
                            <ErrorMessage
                              name="value"
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
                        {/* <Colxx md="4">
                          <div className="form-group mt-4">
                            <input
                              className="ml-1"
                              name="captcha"
                              type="checkbox"
                              defaultChecked={values["vetted_by_department"]}
                              onChange={() => {
                                setFieldValue(
                                  "vetted_by_department",
                                  !values["vetted_by_department"]
                                );
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
                              defaultChecked={values["vetted_by_officer"]}
                              onChange={() => {
                                setFieldValue(
                                  "vetted_by_officer",
                                  !values["vetted_by_officer"]
                                );
                              }}
                            />
                            <label htmlFor="captcha" className="ml-2">
                              Vetted by officer
                            </label>
                          </div>
                        </Colxx> */}
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

export default connect(mapStateToProps, mapActionsToProps)(AddScore);
