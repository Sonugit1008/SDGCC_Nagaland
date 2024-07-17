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

class AddScheme extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Fragment>
        <Row mb="4">
          <Colxx lg="12">
            <Breadcrumb heading="Add Scheme" match={this.props.match} />
            <div className="top-right-button-container float-right">
              <Button
                color="primary"
                className="btn float-right"
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
                    name: "",
                    description: "",
                    scheme_comment: "",
                  }}
                  validationSchema={Yup.object({
                    name: Yup.string().trim(),
                  })}
                  onSubmit={(values, { resetForm }) => {
                    let url = "/api/scheme/";

                    apiAuth.get(url).then((res) => {
                      apiAuth
                        .post(url, values)
                        .then((response) => {
                          console.log(response);
                          console.log(response.data);
                          NotificationManager.success(
                            "Scheme",
                            `Scheme Added Successfully`,
                            3000,
                            null,
                            null,
                            ""
                          );

                          this.props.history.goBack();
                        })
                        .catch((error) => {
                          console.log(error.response?.data);
                          console.log(error.response?.status);
                          console.log(error.response?.headers);
                          NotificationManager.error(
                            error.response?.data?.detail,
                            `Add Scheme Error ${error.response?.status}`,
                            3000,
                            null,
                            null,
                            ""
                          );
                        });
                    });
                  }}
                >
                  <Form className="av-tooltip tooltip-label-bottom ">
                    <Row>
                      <Colxx lg="6">
                        {" "}
                        <div className="form-group">
                          <Label htmlFor="name">Scheme Name</Label>
                          <Field
                            className="form-control"
                            name="name"
                            placeholder="Scheme Name"
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
                          <Label htmlFor="description">
                            Scheme Description
                          </Label>
                          <Field
                            className="form-control"
                            name="description"
                            placeholder="Scheme Description"
                            type="text"
                          />
                          <ErrorMessage
                            name="description"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Colxx>
                      <Colxx lg="12">
                        {" "}
                        <div className="form-group">
                          <Label htmlFor="scheme_comment">Scheme Comment</Label>
                          <Field
                            className="form-control"
                            name="scheme_comment"
                            placeholder="Scheme Count"
                            as="textarea"
                          />
                          <ErrorMessage
                            name="scheme_comment"
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

export default connect(mapStateToProps, mapActionsToProps)(AddScheme);
