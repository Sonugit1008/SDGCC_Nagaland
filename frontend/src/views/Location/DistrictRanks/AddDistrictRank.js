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
import { NavLink } from "react-router-dom";

class AddDistrictRank extends Component {
  constructor(props) {
    super(props);
    this.state = {
      districts: [],
      selectedDistrict: null,
    };
  }

  componentDidMount() {
    this.getDistricts();
  }

  handleChangeDistrict = (selectedDistrict) => {
    this.setState({ selectedDistrict });
  };

  getDistricts = () => {
    let url = "/api/district/";
    apiAuth
      .get(url)
      .then((response) => {
        let districts = response.data;

        this.setState({ districts: districts });
      })
      .catch(function (error) {
        console.log(error.response?.data);
        console.log(error.response?.status);
        console.log(error.response?.headers);
        NotificationManager.error(
          error.response?.data?.detail,
          `Get District Error ${error.response?.status}`,
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
            <Breadcrumb heading="Add Rank" match={this.props.match} />
            <Separator mb="4" />
          </Colxx>
        </Row>
        <Row mb="4">
          <Colxx lg="8">
            <div className="card mt-4">
              <div className="card-body">
                <Formik
                  initialValues={{
                    year: 2022,
                    rank: 1,
                    district: "",
                  }}
                  validationSchema={Yup.object({
                    year: Yup.number().required("Required"),
                    rank: Yup.number().required("Required"),
                  })}
                  onSubmit={(values, { resetForm }) => {
                    let url = "/api/rank/";
                    values["district"] = this.state.selectedDistrict?.value;
                    apiAuth
                      .post(url, values)
                      .then((response) => {
                        console.log(response);
                        console.log(response.data);

                        NotificationManager.success(
                          "Rank",
                          `Rank Added Successfully`,
                          3000,
                          null,
                          null,
                          ""
                        );

                        this.props.history.goBack();
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                  }}
                >
                  <Form className="av-tooltip tooltip-label-bottom ">
                    <Row>
                      <Colxx lg="4">
                        {" "}
                        <div className="form-group">
                          <Label htmlFor="policy">District</Label>

                          <Select
                            options={this.state.districts.map((dept) => {
                              return {
                                value: dept.id,
                                label: dept.name,
                              };
                            })}
                            onChange={this.handleChangeDistrict}
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

export default connect(mapStateToProps, mapActionsToProps)(AddDistrictRank);
