import React, { Component, Fragment } from "react";
import { Row, Label, Button } from "reactstrap";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { connect } from "react-redux";

import apiAuth from "../../helpers/ApiAuth";
import { Colxx, Separator } from "../../components/common/CustomBootstrap";
import { resetPassword } from "../../redux/actions";
import { NotificationManager } from "../../components/common/react-notifications";

class ResetUserPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      is_password_hidden: true
    }
  }


  validateNewPassword = (values) => {
    const { newPassword, newPasswordAgain } = values;
    let errors = {};
    if (newPasswordAgain && newPassword !== newPasswordAgain) {
      errors.newPasswordAgain = "Please check your new password";
    }
    return errors;
  }

  render() {
    console.log("selectedRow ==>>", this.props.selectedRow.original.id)
    return (
      <Fragment>
        <Row mb="4">
          <Colxx lg="12">
            <div className="card">
              <div className="card-body">
                <Formik
                  initialValues={{
                    newPassword: ''
                  }}
                  validate={this.validateNewPassword}
                  validationSchema={
                    Yup.object({
                      newPassword: Yup.string()
                      .required("Please Enter your password")
                      .matches(
                        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/,
                        "Must Contain 6 Characters, One Uppercase, One Lowercase, One Number And One Special Case Character"
                      ),
                    })
                  }
                  onSubmit={(values) => {

                    apiAuth
                      .patch(`/api/admin/users/${this.props.selectedRow.original.id}`, { "password": values['newPassword'] })
                      .then((response) => {
                        NotificationManager.success(
                          '',
                          'Password Updated Successfully',
                          3000,
                          null,
                          null,
                          ""
                        );
                      })
                      .catch(function (error) {
                        console.log(error.response.data);
                        console.log(error.response.status);
                        console.log(error.response.headers);
                        NotificationManager.error(
                          error.response.data.detail,
                          `User Management Error ${error.response.status}`,
                          3000,
                          null,
                          null,
                          ""
                        );
                      });

                      this.props.closeResetPopup();
                  }}>
                  <Form className="av-tooltip tooltip-label-bottom">
                    <Label>
                      New Password
                    </Label>
                    <div className="pass-wrapper">
                      <Field
                        className="form-control"
                        name="newPassword"
                        type={this.state.is_password_hidden ? "password" : 'text'}
                        placeholder="Password"
                      />
                      {
                        this.state.is_password_hidden ?
                          <i className="fa fa-eye" onClick={() => this.setState({ is_password_hidden: false })}></i> :
                          <i className="fa fa-eye-slash" onClick={() => this.setState({ is_password_hidden: true })}></i>
                      }
                    </div>
                    <ErrorMessage
                      name="newPassword"
                      render={(msg) => (
                        <div className="text-danger">{msg}</div>
                      )}
                    />

                    <Separator className="mb-4 mt-4" />
                    <Button
                      type="submit"
                      color="primary"
                      className={`btn-shadow btn-multiple-state  ${this.props.loading ? "show-spinner" : ""
                        }`}
                      size="lg"
                    >
                      <span className="spinner d-inline-block">
                        <span className="bounce1" />
                        <span className="bounce2" />
                        <span className="bounce3" />
                      </span>
                      <span className="label">Reset</span>
                    </Button>{" "}
                    <Button className="btn btn-light float-right" type="reset" onClick={() => this.props.closeResetPopup()}>
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
  const { newPassword, resetPasswordCode, loading, error } = authUser;
  return { newPassword, resetPasswordCode, loading, error };
};

export default connect(
  mapStateToProps,
  {
    resetPassword
  }
)(ResetUserPassword);

