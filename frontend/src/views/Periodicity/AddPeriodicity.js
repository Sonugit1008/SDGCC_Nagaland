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

class PeriodicityAdd extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <Fragment>
        <Row mb="4">
          <Colxx lg="12">
            <Breadcrumb heading="Add Periodicity" match={this.props.match} />
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
          <Colxx lg="4">
            <div className="card mt-4">
              <div className="card-body">
                <Formik
                  initialValues={{
                    name: "",
                    no_of_days: "30",
                  }}
                  validationSchema={Yup.object({
                    name: Yup.string()
                      .max(20, "Must be 20 characters or less")
                      .trim()
                      .required("Required"),
                    no_of_days: Yup.string().trim().required("Required"),
                  })}
                  onSubmit={(values, { resetForm }) => {
                    let url = "/api/periodicity/";
                    apiAuth.post(url, values).then((response) => {
                      console.log(response);
                      console.log(response.data);
                      if (response.status === 201) {
                        NotificationManager.success(
                          "Periodicity",
                          `Periodicity Added Successfully`,
                          3000,
                          null,
                          null,
                          ""
                        );

                        this.props.history.goBack();
                      } else {
                        NotificationManager.error(
                          "Periodicity",
                          `Periodicity Add Error`,
                          3000,
                          null,
                          null,
                          ""
                        );
                      }
                    });
                  }}
                >
                  <Form className="av-tooltip tooltip-label-bottom ">
                    <Row>
                      <Colxx lg="12">
                        {" "}
                        <div className="form-group">
                          <Label htmlFor="name">Periodicity Name</Label>
                          <Field
                            className="form-control"
                            name="name"
                            placeholder="Periodicity Name"
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
                      <Colxx lg="12">
                        {" "}
                        <div className="form-group">
                          <Label htmlFor="no_of_days">Number Of Days</Label>
                          <Field
                            className="form-control"
                            name="no_of_days"
                            placeholder="Periodicity Days"
                            type="text"
                          />
                          <ErrorMessage
                            name="no_of_days"
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

export default connect(mapStateToProps, mapActionsToProps)(PeriodicityAdd);
