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

class EditDistrict extends Component {
  constructor(props) {
    super(props);
    this.state = {
      states: [],
      selectedState: null,
    };
  }

  componentDidMount() {
    this.getStates();
  }

  handleChangeState = (selectedState) => {
    this.setState({ selectedState });
  };

  getStates = () => {
    let url = "/api/state/";
    apiAuth
      .get(url)
      .then((response) => {
        let states = response.data;
        let state_ = states.filter(
          (st) => st.id === this.props.district?.state
        )[0];
        let selectedState = {
          label: state_.name,
          value: state_.id,
        };
        this.setState({
          states: states,
          selectedState: selectedState,
        });
      })
      .catch(function (error) {
        console.log(error.response?.data);
        console.log(error.response?.status);
        console.log(error.response?.headers);
        NotificationManager.error(
          error.response?.data?.detail,
          `Get States Error ${error.response?.status}`,
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
            <Formik
              initialValues={{
                name: this.props.district?.name,
              }}
              validationSchema={Yup.object({
                name: Yup.string().trim().required("Required"),
              })}
              onSubmit={(values, { resetForm }) => {
                let url = "/api/district/"+ this.props.district?.id+"/";
                values["state"] = this.state.selectedState?.value;
                apiAuth
                  .patch(url, values)
                  .then((response) => {
                    console.log(response);
                    console.log(response.data);
                    NotificationManager.success(
                      "",
                      `District Updated Successfully`,
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
                      `District Updated Error`,
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
                  <Colxx lg="6">
                    {" "}
                    <div className="form-group">
                      <Label htmlFor="name">District Name</Label>
                      <Field
                        className="form-control"
                        name="name"
                        placeholder="District Name"
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
                      <Label htmlFor="policy">State</Label>

                      <Select
                        options={this.state.states.map((dept) => {
                          return {
                            value: dept.id,
                            label: dept.name,
                          };
                        })}
                        value={this.state.selectedState}
                        onChange={this.handleChangeState}
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

export default connect(mapStateToProps, mapActionsToProps)(EditDistrict);
