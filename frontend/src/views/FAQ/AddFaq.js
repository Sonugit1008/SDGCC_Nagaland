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
import Select from "react-select";
import { NavLink } from "react-router-dom";

class AddFaq extends Component {
  constructor(props) {
    super(props);
    this.state = {
      states: [],
      selectedState: null,
    };
  }

  render() {
    return (
      <Fragment>
        <Row mb="4">
          <Colxx lg="12">
            <Breadcrumb heading="Add FAQ" match={this.props.match} />
            <Separator mb="4" />
          </Colxx>
        </Row>
        <Row mb="4">
          <Colxx lg="8">
            <div className="card mt-4">
              <div className="card-body">
                <Formik
                  initialValues={{
                    sno: "",
                    question: "",
                    answer: "",
                  }}
                  validationSchema={Yup.object({
                    sno: Yup.string().trim().required("Required"),
                    question: Yup.string().trim().required("Required"),
                    answer: Yup.string().trim().required("Required"),
                  })}
                  onSubmit={(values, { resetForm }) => {}}
                >
                  <Form className="av-tooltip tooltip-label-bottom ">
                    <Row>
                      <Colxx lg="12">
                        {" "}
                        <div className="form-group">
                          <Label htmlFor="sno">Serial Number</Label>
                          <Field
                            className="form-control"
                            name="sno"
                            placeholder="Serial Number"
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
                      <Colxx lg="12">
                        {" "}
                        <div className="form-group">
                          <Label htmlFor="question">Question</Label>
                          <Field
                            className="form-control"
                            name="question"
                            placeholder="Question"
                            type="text"
                          />
                          <ErrorMessage
                            name="question"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Colxx>
                      <Colxx lg="12">
                        {" "}
                        <div className="form-group">
                          <Label htmlFor="answer">Answer</Label>
                          <Field
                            className="form-control"
                            name="answer"
                            placeholder="Answer"
                            type="text"
                          />
                          <ErrorMessage
                            name="answer"
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

export default connect(mapStateToProps, mapActionsToProps)(AddFaq);
