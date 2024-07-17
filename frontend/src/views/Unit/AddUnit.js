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

class AddUnit extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Fragment>
        <Row mb="4">
          <Colxx lg="12">
            <Breadcrumb heading="Add Unit" match={this.props.match} />
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
                    type: "Standard Unit",
                    value: "",
                  }}
                  validationSchema={Yup.object({
                    name: Yup.string().trim().required("Required"),
                    value: Yup.string().trim().required("Required"),
                  })}
                  onSubmit={(values, { resetForm }) => {
                    let url = "/api/unit/";

                    apiAuth.post(url, values).then((response) => {
                      console.log(response);
                      console.log(response.data);
                      if (response.status === 201) {
                        NotificationManager.success(
                          "Unit",
                          `Unit Added Successfully`,
                          3000,
                          null,
                          null,
                          ""
                        );

                        this.props.history.goBack();
                      } else {
                        NotificationManager.error(
                          "Unit",
                          `Unit Add Error`,
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
                      <Colxx lg="4">
                        {" "}
                        <div className="form-group">
                          <Label htmlFor="name">Unit Name</Label>
                          <Field
                            className="form-control"
                            name="name"
                            placeholder="Unit Name"
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
                        <div className="form-group">
                          <Label htmlFor="type">Unit Type</Label>
                          <Field
                            as="select"
                            name="type"
                            className="form-control"
                          >
                            <option value="Standard Unit">Standard Unit</option>
                            <option value="Academic Unit">Academic Unit</option>
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
                          <Label htmlFor="value">Unit Value</Label>
                          <Field
                            className="form-control"
                            name="value"
                            placeholder="Unit Value"
                            type="text"
                          />
                          <ErrorMessage
                            name="value"
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
  let flag = {
    write: true,
    edit: true,
  };
  let rol = "superadmin";
  return {
    permission: flag,
    role: rol,
  };
};

const mapActionsToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapActionsToProps)(AddUnit);
