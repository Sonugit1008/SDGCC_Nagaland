import React, { Component, Fragment } from "react";
import { Row, Button, Label } from "reactstrap";
import * as Yup from "yup";
// import { Modal } from "react-bootstrap";
import { Formik, Field, ErrorMessage } from "formik";
import { Form } from "react-formik-ui";
// import Select from "react-select";
import { connect } from "react-redux";
// import Breadcrumb from "../../containers/navs/Breadcrumb";
import { Colxx, Separator } from "../../components/common/CustomBootstrap";
import apiAuth from "../../helpers/ApiAuth";
import { NotificationManager } from "../../components/common/react-notifications";

class EditGoal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: "",
      picfile: null,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      file: URL.createObjectURL(event.target.files[0]),
      picfile: event.target.files[0],
    });
  }

  render() {
    return (
      <Fragment>
        <Row mb="4">
          <Colxx lg="12">
            <div className="card mt-4">
              <div className="card-body">
                <Formik
                  initialValues={{
                    name: this.props.goal?.name ? this.props.goal?.name : "",
                    sno: this.props.goal?.sno ? this.props.goal?.sno : "",
                  }}
                  validationSchema={Yup.object({
                    name: Yup.string().trim().required("Required"),
                    sno: Yup.string().trim(),
                  })}
                  onSubmit={(values, { resetForm }) => {
                    let url = `/api/goal/update/${this.props.goal?.id}/`;
                    const formData = new FormData();
                    if (this.state.picfile) {
                      formData.append("image", this.state.picfile);
                    }

                    formData.append("name", values.name);
                    formData.append("sno", values.sno);
                    const config = {
                      headers: {
                        "content-type": "multipart/form-data",
                      },
                    };
                    apiAuth
                      .patch(url, formData, config)
                      .then((response) => {
                        console.log(response);
                        console.log(response.data);
                        setTimeout(() => {
                          NotificationManager.success(
                            "Goal",
                            `Goal Updated Successfully.`,
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
                          "Goal",
                          `Goal Update Error`,
                          3000,
                          null,
                          null,
                          ""
                        );
                      });
                  }}
                >
                  <Form className="av-tooltip tooltip-label-bottom ">
                    <Row>
                      <Colxx lg="12">
                        {" "}
                        <div className="form-group">
                          <Label htmlFor="name">Goal Name</Label>
                          <Field
                            className="form-control"
                            name="name"
                            placeholder="Goal Name"
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
                          <Label htmlFor="sno">Goal SNO</Label>
                          <Field
                            className="form-control"
                            name="sno"
                            placeholder="Goal Serial Number"
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
                        <div className="mt-4">
                          <div className="position-relative"></div>

                          {this.props.goal?.image && !this.state.file ? (
                            <img
                              src={this.props.goal?.image}
                              className="card-img-top"
                              alt="Icon"
                              width={"200px"}
                              height={"200px"}
                            ></img>
                          ) : (
                            <img
                              src={this.state.file}
                              className="card-img-top"
                              alt="Icon"
                              width={"200px"}
                              height={"200px"}
                            ></img>
                          )}
                          <div className="card-body">
                            <div className="mb-4 card-subtitle">
                              <div className="mb-3 input-group">
                                <div className="input-group-prepend">
                                  <span className="input-group-text">
                                    Upload
                                  </span>
                                </div>
                                <div className="custom-file">
                                  <input
                                    type="file"
                                    accept="image/*"
                                    id="exampleCustomFileBrowser1"
                                    name="customFile"
                                    className="custom-file-input"
                                    onChange={this.handleChange}
                                  />
                                  <label className="custom-file-label">
                                    Goal Icon
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
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

export default connect(mapStateToProps, mapActionsToProps)(EditGoal);
