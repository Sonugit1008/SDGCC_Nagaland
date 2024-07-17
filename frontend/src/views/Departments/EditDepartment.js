import React, { Component, Fragment } from "react";
import { Row, Button, Label } from "reactstrap";
import * as Yup from "yup";
// import { Modal } from "react-bootstrap";
import { Formik, Field, ErrorMessage } from "formik";
import { Form } from "react-formik-ui";
import Select from "react-select";
import { connect } from "react-redux";
import { Colxx, Separator } from "../../components/common/CustomBootstrap";
import apiAuth from "../../helpers/ApiAuth";
import { NotificationManager } from "../../components/common/react-notifications";

class EditDepartment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      states: [],
      selectedState: null,
    };
  }

  handleChangeState = (selectedState) => {
    this.setState({ selectedState });
  };

  componentDidMount() {
    this.getStates();
    this.getDepartments();
  }

  getStates = () => {
    let url = "/api/state/";
    apiAuth
      .get(url)
      .then((response) => {
        let states = response.data;

        let state_ = states.filter(
          (st) => st.name === this.props.department?.state
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

  getDepartments = () => {
    let url = "/api/department/";
    apiAuth
      .get(url)
      .then((response) => {
        let departments = response.data.map((dept) => {
          return dept.name?.toLowerCase();
        });

        this.setState({ departments: departments });
      })
      .catch(function (error) {
        console.log(error.response?.data);
        console.log(error.response?.status);
        console.log(error.response?.headers);
        NotificationManager.error(
          error.response.data.detail,
          `Get Department Error ${error.response?.status}`,
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
                name: this.props.department?.name
                  ? this.props.department?.name
                  : "",
              }}
              validationSchema={Yup.object({
                name: Yup.string().trim().required("Required"),
              })}
              onSubmit={(values, { resetForm }) => {
                let url = "/api/department/" + this.props.department?.id + "/";
                values.state = this.state.selectedState?.value;

                if (
                  this.state.departments.includes(
                    String(values.name).toLowerCase()
                  )
                ) {
                  NotificationManager.error(
                    "Department",
                    `Department already exit.`,
                    3000,
                    null,
                    null,
                    ""
                  );
                } else {
                  apiAuth.patch(url, values).then((response) => {
                    console.log(response);
                    console.log(response.data);
                    NotificationManager.success(
                      "Department",
                      `Department Updated Successfully`,
                      3000,
                      null,
                      null,
                      ""
                    );

                    this.props.closeBack();
                  });
                }
              }}
            >
              <Form className="av-tooltip tooltip-label-bottom ">
                <Row>
                  <Colxx lg="6">
                    {" "}
                    <div className="form-group">
                      <Label htmlFor="name">Department Name</Label>
                      <Field
                        className="form-control"
                        name="name"
                        placeholder="Department Name"
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
                        options={this.state.states.map((state) => {
                          return {
                            value: state.id,
                            label: state.name,
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
                  <span className="label">Update</span>
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

export default connect(mapStateToProps, mapActionsToProps)(EditDepartment);
