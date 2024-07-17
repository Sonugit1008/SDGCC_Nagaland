import React, { Component, Fragment } from "react";
import { Row, Button, Label } from "reactstrap";
import * as Yup from "yup";
// import { Modal } from "react-bootstrap";
import { Formik, Field, ErrorMessage } from "formik";
import { Form, Datepicker } from "react-formik-ui";
import { connect } from "react-redux";
import { Colxx, Separator } from "../../components/common/CustomBootstrap";
import apiAuth from "../../helpers/ApiAuth";
import { NotificationManager } from "../../components/common/react-notifications";
import moment from "moment";

class EditScore extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Fragment>
        <Row mb="4">
          <Colxx lg="12">
            <Formik
              initialValues={{
                value: this.props.report?.value ? this.props.report?.value : "",
                year: this.props.report?.year ? this.props.report?.year : "",
                remarks: this.props.report?.remarks
                  ? this.props.report?.remarks
                  : "",
                vetted_by: this.props.report?.vetted_by
                  ? this.props.report?.vetted_by
                  : "",
                category: this.props.report?.category
                  ? this.props.report?.category
                  : "Aspirant",
                report_date: this.props.report?.reportdate
                  ? new Date(this.props.report?.reportdate)
                  : "",
              }}
              validationSchema={Yup.object({
                value: Yup.number()
                  .typeError("Data value must be a number")
                  .required("Required"),
                year: Yup.string().required("Required"),
              })}
              onSubmit={(values, { resetForm }) => {
                let url = `/api/score/${this.props.report?.id}/`;
                values.report_date = values.report_date
                  ? moment(values.report_date).toISOString()
                  : moment().toISOString();
                apiAuth
                  .patch(url, values)
                  .then((response) => {
                    console.log(response);
                    console.log(response.data);
                    NotificationManager.success(
                      "Data Entry",
                      `Data Updated Successfully.`,
                      3000,
                      null,
                      null,
                      ""
                    );
                    this.props.closeBack();
                  })
                  .catch((error) => {
                    NotificationManager.error(
                      "Data Entry",
                      `Data Update Error`,
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
                    <Colxx lg="6">
                      <div className="form-group">
                        <Label htmlFor="value">Data Value</Label>
                        <Field
                          className="form-control"
                          name="value"
                          type="text"
                          placeholder="Data Value"
                        />

                        <ErrorMessage
                          name="value"
                          render={(msg) => (
                            <div className="text-danger">{msg}</div>
                          )}
                        />
                      </div>
                    </Colxx>
                    <Colxx lg="6">
                      <div className="form-group">
                        <Label htmlFor="category">Category</Label>
                        <Field
                          as="select"
                          name="category"
                          className="form-control"
                        >
                          <option value="Aspirant">Aspirant</option>
                          <option value="Performer">Performer</option>
                          <option value="Front Runner">Front Runner</option>
                          <option value="Achiever">Achiever</option>
                          <option value="No Target">No Target</option>
                        </Field>
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
                        <Label htmlFor="report_date">Report Date</Label>
                        <Datepicker className="form-group" name="report_date" />
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
                    Cancel
                  </Button>
                </Form>
              )}
            </Formik>
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

export default connect(mapStateToProps, mapActionsToProps)(EditScore);
