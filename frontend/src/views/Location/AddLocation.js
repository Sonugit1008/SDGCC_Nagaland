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

class AddLocation extends Component {
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
            <Breadcrumb heading="Add Location" match={this.props.match} />
            <div className="top-right-button-container float-right ml-1">
              <NavLink
                to={"/app/location/district/"}
                className="btn btn-sm btn-primary"
              >
                Add District
              </NavLink>
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
                    latitude: "",
                    longitude: "",
                    pincode: "",
                    description: "",
                  }}
                  validationSchema={Yup.object({
                    name: Yup.string().trim().required("Required"),
                    pincode: Yup.string().trim().required("Required"),
                  })}
                  onSubmit={(values, { resetForm }) => {
                    let url = "/api/location/";
                    values["district"] = this.state.selectedDistrict?.value;
                    apiAuth.post(url, values).then((response) => {
                      console.log(response);
                      console.log(response.data);
                      if (response.status === 201) {
                        NotificationManager.success(
                          "Location",
                          `Location Added Successfully`,
                          3000,
                          null,
                          null,
                          ""
                        );

                        this.props.history.goBack();
                      } else {
                        NotificationManager.error(
                          "Location",
                          `Location Add Error`,
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
                          <Label htmlFor="name">Location Name</Label>
                          <Field
                            className="form-control"
                            name="name"
                            placeholder="Location Name"
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
                        {" "}
                        <div className="form-group">
                          <Label htmlFor="latitude">Location Latitude</Label>
                          <Field
                            className="form-control"
                            name="latitude"
                            placeholder="Location Latitude"
                            type="text"
                          />
                          <ErrorMessage
                            name="latitude"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Colxx>
                      <Colxx lg="4">
                        {" "}
                        <div className="form-group">
                          <Label htmlFor="longitude">Location Longitude</Label>
                          <Field
                            className="form-control"
                            name="longitude"
                            placeholder="Location Longitude"
                            type="text"
                          />
                          <ErrorMessage
                            name="longitude"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Colxx>
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
                          <Label htmlFor="pincode">Pincode</Label>
                          <Field
                            className="form-control"
                            name="pincode"
                            placeholder="Pincode"
                            type="text"
                          />
                          <ErrorMessage
                            name="pincode"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Colxx>
                      <Colxx lg="4">
                        {" "}
                        <div className="form-group">
                          <Label htmlFor="description">
                            Location Description
                          </Label>
                          <Field
                            className="form-control"
                            name="description"
                            placeholder="Location Description"
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

export default connect(mapStateToProps, mapActionsToProps)(AddLocation);
