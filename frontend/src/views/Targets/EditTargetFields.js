import React, { Component, Fragment } from "react";
import { Row, Label, Button } from "reactstrap";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { connect } from "react-redux";
import { Colxx, Separator } from "../../components/common/CustomBootstrap";
import { resetPassword } from "../../redux/actions";
import apiAuth from "../../helpers/ApiAuth";
import Select from "react-select";
class EditTargetFields extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // selectedDistrict: this.props.selectedData?.district
      //   ? {
      //       label: this.props.selectedData?.district_name,
      //       value: this.props.selectedData?.district,
      //     }
      //   : this.props.districtOptions[0],
    };
  }

  handleChangeDistrict = (selectedDistrict) => {
    this.setState({ selectedDistrict });
  };

  render() {
    return (
      <Fragment>
        <Row mb="4">
          <Colxx lg="12">
            <div className="card">
              <div className="card-body">
                <Formik
                  initialValues={{
                    baseline_value: this.props.selectedData?.baseline_value,
                    progress_value: this.props.selectedData?.progress_value,
                    short_value: this.props.selectedData?.short_value,
                    mid_value: this.props.selectedData?.mid_value,
                    value: this.props.selectedData?.value,
                    // start_year: this.props.selectedData?.start_year,
                    // end_year: this.props.selectedData?.end_year,
                  }}
                  validationSchema={Yup.object({
                    // start_year: Yup.string().trim().required("Required"),
                    // end_year: Yup.string().trim().required("Required"),
                  })}
                  onSubmit={async (values) => {
                    let url = "/api/indicatorvalue/";
                    values.indicator = this.props.selectedData?.id;
                    // values.district = this.state.selectedDistrict?.value;
                    if (this.props.selectedData?.indicator_id) {
                      await apiAuth
                        .patch(
                          url + this.props.selectedData?.indicator_id + "/",
                          values
                        )
                        .then((response) => {
                          console.log("Updated!");
                        })
                        .catch((error) => {
                          console.log(error);
                        });
                    } else {
                      await apiAuth
                        .post(url, values)
                        .then((response) => {
                          console.log("Updated!");
                        })
                        .catch((error) => {
                          console.log(error);
                        });
                    }

                    this.props.closePopup();
                  }}
                >
                  <Form className="av-tooltip tooltip-label-bottom">
                    {/* <Row>
                      <Colxx lg="12">
                        {" "}
                        <div className="form-group">
                          <Label htmlFor="policy">District</Label>

                          <Select
                            options={this.props.districtOptions}
                            onChange={this.handleChangeDistrict}
                            defaultValue={this.state.selectedDistrict}
                          />
                        </div>
                      </Colxx>
                    </Row> */}
                    <Row>
                      <Colxx lg="12">
                        <div className="form-group">
                          <Label>Baseline</Label>
                          <div className="pass-wrapper">
                            <Field
                              className="form-control"
                              name="baseline_value"
                              type="text"
                              placeholder="Baseline"
                            />
                          </div>
                          <ErrorMessage
                            name="baseline_value"
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
                          <Label>Progress</Label>
                          <div className="pass-wrapper">
                            <Field
                              className="form-control"
                              name="progress_value"
                              type="text"
                              placeholder="Progress"
                            />
                          </div>
                          <ErrorMessage
                            name="progress_value"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Colxx>
                    </Row>
                    {/* <Row>
                      <Colxx lg="12">
                        <div className="form-group">
                          <Label>Short-Term Target(2022-23)</Label>
                          <div className="pass-wrapper">
                            <Field
                              className="form-control"
                              name="short_value"
                              type="text"
                              placeholder="Target"
                            />
                          </div>
                          <ErrorMessage
                            name="short_value"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Colxx>
                    </Row> */}
                    <Row>
                      <Colxx lg="12">
                        <div className="form-group">
                          <Label>Mid-Term Target(2025-26)</Label>
                          <div className="pass-wrapper">
                            <Field
                              className="form-control"
                              name="mid_value"
                              type="text"
                              placeholder="Target"
                            />
                          </div>
                          <ErrorMessage
                            name="mid_value"
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
                          <Label>Target(2030)</Label>
                          <div className="pass-wrapper">
                            <Field
                              className="form-control"
                              name="value"
                              type="text"
                              placeholder="Target"
                            />
                          </div>
                          <ErrorMessage
                            name="value"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Colxx>
                    </Row>
                    {/* <Row>
                      <Colxx lg="6">
                        <div className="form-group">
                          <Label>Start Year</Label>
                          <div className="pass-wrapper">
                            <Field
                              className="form-control"
                              name="start_year"
                              type="text"
                              placeholder="Start Year"
                            />
                          </div>
                          <ErrorMessage
                            name="start_year"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Colxx>
                      <Colxx lg="6">
                        <div className="form-group">
                          <Label>End Year</Label>
                          <div className="pass-wrapper">
                            <Field
                              className="form-control"
                              name="end_year"
                              type="text"
                              placeholder="End Year"
                            />
                          </div>
                          <ErrorMessage
                            name="end_year"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Colxx>
                    </Row> */}
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

const mapStateToProps = () => {
  return {};
};

export default connect(mapStateToProps, {
  resetPassword,
})(EditTargetFields);
