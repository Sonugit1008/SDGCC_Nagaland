import React, { Component, Fragment } from "react";
import { Row, Button, Label } from "reactstrap";
import * as Yup from "yup";
import { Formik, Field, ErrorMessage } from "formik";
import { Form } from "react-formik-ui";
import { connect } from "react-redux";
import { Colxx, Separator } from "../../components/common/CustomBootstrap";
import apiAuth from "../../helpers/ApiAuth";
import { NotificationManager } from "../../components/common/react-notifications";

class EditState extends Component {
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
                name: this.props.state?.name,
              }}
              validationSchema={Yup.object({
                name: Yup.string().trim().required("Required"),
              })}
              onSubmit={(values, { resetForm }) => {
                let url = "/api/state/" + this.props.state?.id + "/";

                apiAuth.patch(url, values).then((response) => {
                  console.log(response);
                  console.log(response.data);
                  NotificationManager.success(
                    "",
                    `State Updated Successfully`,
                    3000,
                    null,
                    null,
                    ""
                  );

                  this.props.closeBack();
                });
              }}
            >
              <Form className="av-tooltip tooltip-label-bottom ">
                <Row>
                  <Colxx lg="12">
                    {" "}
                    <div className="form-group">
                      <Label htmlFor="name">State Name</Label>
                      <Field
                        className="form-control"
                        name="name"
                        placeholder="State Name"
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

export default connect(mapStateToProps, mapActionsToProps)(EditState);
