import React, { Component, Fragment } from "react";
import { Row, Button, Label } from "reactstrap";
import * as Yup from "yup";
// import { Modal } from "react-bootstrap";
import { Formik, Field, ErrorMessage } from "formik";
import { Form } from "react-formik-ui";
import { connect } from "react-redux";
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import apiAuth from "../../../helpers/ApiAuth";
import { NotificationManager } from "../../../components/common/react-notifications";
import Select from "react-select";

class EditDistrictRank extends Component {
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
                district: this.props.district?.district,
                year: this.props.district?.year,
                rank: this.props.district?.rank,
              }}
              validationSchema={Yup.object({
                year: Yup.number().required("Required"),
                rank: Yup.number().required("Required"),
              })}
              onSubmit={(values, { resetForm }) => {
                let url = "/api/rank/" + this.props.district?.id + "/";
                apiAuth
                  .patch(url, {
                    rank: values.rank,
                    year: values.year,
                  })
                  .then((response) => {
                    console.log(response);
                    console.log(response.data);
                    NotificationManager.success(
                      "",
                      `Rank Updated Successfully`,
                      3000,
                      null,
                      null,
                      ""
                    );

                    this.props.closeBack();
                  })
                  .catch((error) => {
                    NotificationManager.error(
                      "",
                      `Rank Updated Error`,
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
                  <Colxx lg="4">
                    <div className="form-group">
                      <Label htmlFor="district">District Name</Label>
                      <Field
                        className="form-control"
                        name="district"
                        type="text"
                        readOnly
                      />
                      <ErrorMessage
                        name="district"
                        render={(msg) => (
                          <div className="text-danger">{msg}</div>
                        )}
                      />
                    </div>
                  </Colxx>
                  <Colxx lg="4">
                    {" "}
                    <div className="form-group">
                      <Label htmlFor="year">Year</Label>
                      <Field
                        className="form-control"
                        name="year"
                        type="number"
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
                    {" "}
                    <div className="form-group">
                      <Label htmlFor="rank">Rank</Label>
                      <Field
                        className="form-control"
                        name="rank"
                        type="number"
                      />
                      <ErrorMessage
                        name="rank"
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
                  <span className="label">Save</span>
                </Button>{" "}
                <Button
                  className="btn btn-light float-right"
                  type="reset"
                  onClick={() => this.props.closeBack()}
                >
                  {" "}
                  Cancel{" "}
                </Button>
              </Form>
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

export default connect(mapStateToProps, mapActionsToProps)(EditDistrictRank);
