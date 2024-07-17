import React, { Component, Fragment } from "react";
import { Row, Label, Button } from "reactstrap";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Datepicker } from "react-formik-ui";
import { connect } from "react-redux";
import { Colxx, Separator } from "../../components/common/CustomBootstrap";
import { resetPassword } from "../../redux/actions";

class EditGoalFields extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Fragment>
        <Row mb="4">
          <Colxx lg="12">
            <div className="card">
              <div className="card-body">
                <Formik
                  initialValues={{
                    newPassword: "",
                    date_of_data: Date.now(),
                  }}
                  validationSchema={Yup.object({})}
                  onSubmit={(values) => {
                    this.props.closePopup();
                  }}
                >
                  <Form className="av-tooltip tooltip-label-bottom">
                    <Row>
                      <Colxx lg="12">
                        <div className="form-group">
                          <Label>Progress</Label>
                          <div className="pass-wrapper">
                            <Field
                              className="form-control"
                              name="progress"
                              type="text"
                              placeholder="Progress"
                            />
                          </div>
                          <ErrorMessage
                            name="progress"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Colxx>
                    </Row>
                    <Row>
                      <Colxx lg="12">
                        <div className="form-group">
                          <Label htmlFor="date_of_data">
                            Date of Data
                          </Label>
                          <Datepicker
                            className="form-group"
                            name="date_of_data"
                          />
                        </div>
                      </Colxx>
                    </Row>
                    <Row>
                      <Colxx lg="12">
                        <div className="form-group">
                          <Label>Verified By</Label>
                          <div className="pass-wrapper">
                            <Field
                              className="form-control"
                              name="verified"
                              type="text"
                              placeholder="Verified By"
                            />
                          </div>
                          <ErrorMessage
                            name="verified"
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
                      onClick={() => this.props.closePopup()}
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
  const {} = authUser;
  return {};
};

export default connect(mapStateToProps, {
  resetPassword,
})(EditGoalFields);
