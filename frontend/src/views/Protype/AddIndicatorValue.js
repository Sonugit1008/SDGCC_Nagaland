import React, { Component, Fragment } from "react";
import { Row, Button, Label } from "reactstrap";
import * as Yup from "yup";
import { Modal } from "react-bootstrap";
import { Formik, Field, ErrorMessage } from "formik";
import { Form, Datepicker } from "react-formik-ui";
import { connect } from "react-redux";
import Breadcrumb from "../../containers/navs/Breadcrumb";
import { Colxx, Separator } from "../../components/common/CustomBootstrap";
import apiAuth from "../../helpers/ApiAuth";
import { NotificationManager } from "../../components/common/react-notifications";
import Select from "react-select";
import moment from "moment";

class AddIndicatorValue extends Component {
    constructor(props) {
        super(props);
        this.state = {
            goals: [],
            departments: [],
            selectedGoal: null,
            indicators: [],
            indDb: {},
            selectedDept: {
                label: "All",
                value: "All",
            },
        };
    }

    handleChangeGoal = (selectedGoal) => {
        this.setState({ selectedGoal });
    };

    componentDidMount() {
        this.getGoals();
        this.getIndicators();
        this.getDepartments();

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

    getDepartments = () => {
        apiAuth
            .get("/api/department/")
            .then((response) => {
                let departments = response.data.map((dept) => {
                    return dept.name;
                });

                departments.unshift("All");
                this.setState({ departments });
            })
            .catch(function (error) {
                console.log(error.response?.data);
                console.log(error.response?.status);
                console.log(error.response?.headers);
                NotificationManager.error(
                    error.response?.data?.detail,
                    `Get Departments Error ${error.response?.status}`,
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
                        <Breadcrumb heading="Add Indicator Value" match={this.props.match} />
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
                                        department: "",
                                        value: "",
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
                                                <Colxx lg="6">
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
                                                                //setFieldValue("department", "");
                                                            }}
                                                        />
                                                    </div>
                                                </Colxx>
                                                <Colxx lg="6">
                                                    <div className="form-group">
                                                        <Label htmlFor="type">Indicator  Type</Label>
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
                                                <Colxx lg="12">
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
                                                            }}
                                                        />
                                                    </div>
                                                </Colxx>

                                                <Colxx lg="12" className="">
                                                    <div className="form-group">
                                                        {values["indicator"]?.value?.department && (
                                                            <>
                                                                <Label htmlFor="policy">
                                                                    <strong>Department Name:</strong>{values["indicator"].value.department}
                                                                </Label>
                                                                <br></br>
                                                                <Label htmlFor="policy">
                                                                    <strong>Value type:</strong>Number/Ratio/Percentage

                                                                </Label>
                                                            </>


                                                        )}
                                                    </div>
                                                  
                                                </Colxx>
                                                {/* {values["department"]['value'] != "NITI AAYOG" ? ( */}

                                                {values["indicator"]?.value?.department != "NITI AAYOG" ? (
                                                    <>
                                                        <Colxx lg="12">
                                                            <div className="form-group">
                                                            <Label htmlFor="denominator_value">
                                                                {values["indicator"]?.value?.department ? (
                                                                    <>
                                                                    Denominator Value(
                                                                        {values["indicator"]?.value?.denominator_label})
                                                                    </>
                                                                ) : (
                                                                " Denominator Value(Description to come here)"

                                                                )}
                                                            </Label>
                                                                <Field
                                                                    className="form-control"
                                                                    name="denominator_value"
                                                                    type="text"
                                                                    placeholder="Denominator value"
                                                                />

                                                                <ErrorMessage
                                                                    name="denominator_value"
                                                                    render={(msg) => (
                                                                        <div className="text-danger">{msg}</div>
                                                                    )}
                                                                />
                                                            </div>
                                                        </Colxx>
                                                        <Colxx lg="12">
                                                            <div className="form-group">
                                                                <Label htmlFor="numerator_value">
                                                                {values["indicator"]?.value?.department ? (
                                                                    <>
                                                                    Numerator Value(
                                                                        {values["indicator"]?.value?.numerator_label})
                                                                    </>
                                                                ) : (
                                                                " Numerator Value(Description to come here)"

                                                                )}
                                                                </Label>
                                                                <Field
                                                                    className="form-control"
                                                                    name="numerator_value"
                                                                    type="text"
                                                                    placeholder="Numerator value"
                                                                />

                                                                <ErrorMessage
                                                                    name="numerator_value"
                                                                    render={(msg) => (
                                                                        <div className="text-danger">{msg}</div>
                                                                    )}
                                                                />
                                                            </div>
                                                        </Colxx></>
                                                ) : (
                                                    <></>
                                                )}



                                                {values["indicator"]?.value?.department == "NITI AAYOG" ? (
                                                    <>
                                                        <Colxx lg="6">
                                                            <div className="form-group">
                                                                <Label htmlFor="denominator_value">
                                                                    Calculated Value
                                                                </Label>
                                                                <Field
                                                                    className="form-control"
                                                                    name="denominator_value"
                                                                    type="text"
                                                                    placeholder="Denominator value"
                                                                />

                                                                <ErrorMessage
                                                                    name="denominator_value"
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

export default connect(mapStateToProps, mapActionsToProps)(AddIndicatorValue);
