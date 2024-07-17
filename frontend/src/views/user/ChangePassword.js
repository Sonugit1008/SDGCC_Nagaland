import React, { Fragment } from "react";
import { Separator } from "../../components/common/CustomBootstrap";
import { Label, Button } from "reactstrap";
import { CHANGE_PASSWORD } from "../../redux/actions";
import { NotificationManager } from "../../components/common/react-notifications";
import { Formik, Field, ErrorMessage, Form } from "formik";
import { connect } from "react-redux";
import * as Yup from "yup";

class ChangePassword extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      errorDisplayed: false,
      formPosted: false,
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.formPosted === true) {
      if (
        this.props.loading !== true &&
        this.props.loading !== prevProps.loading
      ) {
        if (this.props.error) {
          NotificationManager.error(
            "Change Password",
            `Change Password Error`,
            3000,
            null,
            null,
            ""
          );
          this.setState({ formPosted: false });
        } else {
          console.log(this.props.error);
          NotificationManager.success(
            "",
            `Change Password Success`,
            3000,
            null,
            null,
            ""
          );
          this.setState({ formPosted: false });
        }
      }
    }
  }

  render() {
    return (
      <Fragment>
        {/* <Row>
          <Colxx xxs="12" className="mb-4">
            <div className="card mb-4"> */}
              <div className="card-body">
                {/* <h2 className="mb-1 mt-1 ml-1">Change Password</h2>
                <Separator className="mb-4" /> */}
                <Formik
                  initialValues={{
                    oldpassword: "",
                    new_password1: "",
                    new_password2: "",
                  }}
                  validationSchema={Yup.object({
                    new_password1: Yup.string()
                      .required("Please Enter your password")
                      .matches(
                        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
                      ),
                    new_password2: Yup.string().oneOf(
                      [Yup.ref("new_password1"), null],
                      "Passwords must match"
                    ),
                  })}
                  onSubmit={(values) => {
                    if (!this.props.loading) {
                      this.setState({ formPosted: true });
                      this.setState({ errorDisplayed: false });
                      this.props.changePassword(values);
                    }
                  }}
                >
                  <Form className="av-tooltip tooltip-label-bottom ">
                    <div className="form-group">
                      <Label htmlFor="oldpassword">Old Password</Label>
                      <Field
                        className="form-control"
                        name="oldpassword"
                        placeholder="Old Password"
                        type="password"
                      />
                      <ErrorMessage
                        name="New"
                        render={(msg) => (
                          <div className="text-danger">{msg}</div>
                        )}
                      />
                    </div>
                    <div className="form-group">
                      <Label htmlFor="new_password1">New Password</Label>
                      <Field
                        className="form-control"
                        name="new_password1"
                        placeholder="New Password"
                        type="password"
                      />
                      <ErrorMessage
                        name="new_password1"
                        render={(msg) => (
                          <div className="text-danger">{msg}</div>
                        )}
                      />
                    </div>
                    <div className="form-group">
                      <Label htmlFor="new_password2">Confirm Password</Label>
                      <Field
                        className="form-control"
                        name="new_password2"
                        placeholder="New Password"
                        type="password"
                      />
                      <ErrorMessage
                        name="new_password2"
                        render={(msg) => (
                          <div className="text-danger">{msg}</div>
                        )}
                      />
                    </div>
                    <Separator className="mb-4 mt-3" />
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
                    <Button className="btn btn-light float-right" type="reset">
                      {" "}
                      Cancel{" "}
                    </Button>
                  </Form>
                </Formik>
              </div>
            {/* </div>
          </Colxx>
        </Row> */}
      </Fragment>
    );
  }
}

const mapStateToProps = ({ authUser }) => {
  const { loading, error } = authUser;

  return { error, loading };
};

const mapActionsToProps = (dispatch) => {
  return {
    changePassword: (changePassword) =>
      dispatch({ type: CHANGE_PASSWORD, payload: changePassword }),
  };
};
export default connect(mapStateToProps, mapActionsToProps)(ChangePassword);
