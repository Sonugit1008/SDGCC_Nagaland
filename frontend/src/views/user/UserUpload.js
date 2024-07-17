/* eslint-disable no-undef */
import React, { Component, Fragment } from "react";
import { Button } from "reactstrap";
import { Card, ProgressBar, Row } from "react-bootstrap";
import { Colxx, Separator } from "../../components/common/CustomBootstrap";
import Breadcrumb from "../../containers/navs/Breadcrumb";
import { connect } from "react-redux";
import Table from "../common/Table";
import columns from "./UserUploadTableColumns";
import apiAuth from "../../helpers/ApiAuth";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { ExportToExcel } from "../common/ExportToExcel";

class UserUpload extends Component {
  constructor(props) {
    super(props);
    var filename = "/dashboard/assets/img/profile-pic-blank.png";
    this.state = {
      file: filename,
      picfile: null,
      loading: false,
      data: null,
      dataSuccess: 0,
      dataUpdate: [],
      dataAdd: [],
      dataFailed: [],
      progress: false,
      failed: false,
      showData: null,
      users: null,
    };

    this.onDrop = this.onDrop.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleFileData = this.handleFileData.bind(this);
    this.saveFileData = this.saveFileData.bind(this);
    this.addUser = this.addUser.bind(this);
    this.getUsers = this.getUsers.bind(this);
  }

  onDrop(picture, picturefile) {
    this.setState({
      pictures: picture,
      pictureFiles: picturefile,
    });
  }

  handleChange(event) {
    this.setState({
      file: URL.createObjectURL(event.target.files[0]),
      picfile: event.target.files[0],
      dataSuccess: 0,
      dataUpdate: 0,
      dataAdd: 0,
      dataFailed: 0,
      failed: false,
      progress: false,
    });
  }
  componentDidMount() {
    // const script = document.createElement("script");

    // script.src =
    // 	"https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.16.2/xlsx.full.min.js";
    // script.async = true;

    // document.body.appendChild(script);

    this.getUsers();
  }

  getUsers() {
    let url =
      this.props.role === "company_admin" ||
      this.props.role === "trip_odo_admin"
        ? "/api/company_admin/users/"
        : "/api/admin/users/";
    apiAuth
      .get(url)
      .then((res) => {
        this.setState({ users: res.data });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  handleFileData() {
    if (this.state.picfile) {
      let fileReader = new FileReader();
      fileReader.readAsBinaryString(this.state.picfile);

      fileReader.onload = (event) => {
        let data = event.target.result;
        let workbook = XLSX?.read(data, { type: "binary" });
        // console.log(workbook);
        // workbook.SheetNames.forEach((sheet) => {
        let rowObject = XLSX?.utils.sheet_to_row_object_array(
          workbook.Sheets[workbook.SheetNames[0]]
        );

        let userData = rowObject.map((usr) => {
          usr["facility_name"] =
            this.props.facility[Number(usr.facility)]?.facility_name;

          return usr;
        });
        console.log("data", userData);
        this.setState({ data: userData, showData: userData });
        // });
      };
    }
  }

  saveFileData() {
    if (this.state.data && this.state.data?.length > 0) {
      this.setState({ progress: true });

      this.state.data.forEach(async (usr) => {
        let users = this.state.users;

        let flag = true;
        for (var i = 0; i < users.length; i++) {
          if (users[i].email === usr.email) {
            usr["id"] = users[i].id;
            flag = false;
            break;
          }
        }
        if (flag) {
          await this.addUser(usr);
        } else {
          await this.editUser(usr);
        }
      });
    }
  }

  async addUser(user) {
    let url =
      this.props.role === "company_admin" ||
      this.props.role === "trip_odo_admin"
        ? "/api/company_admin/users/"
        : "/api/admin/users/";
    const formData = new FormData();
    formData.append("email", user.email);

    let charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";
    for (var i = 0, n = charset.length; i < 6; ++i) {
      password = password + charset.charAt(Math.floor(Math.random() * n));
    }

    formData.append("password", password);
    if (user.first_name) formData.append("first_name", user.first_name);

    if (user.last_name) formData.append("last_name", user.last_name);

    let groups = [user.groups];

    if (user.groups) formData.append("groups", groups);

    let facility = [user.facility];

    if (user.facility) formData.append("facility", facility);
    let company = [user.company];

    if (user.company) formData.append("company", company);
    await apiAuth
      .post(url, formData)
      .then((response) => {
        console.log(response);
        console.log(response.data);
        if (response.status === 201) {
          // NotificationManager.success(
          // 	"User",
          // 	`User Added Successfully`,
          // 	3000,
          // 	null,
          // 	null,
          // 	""
          // );
          let ads = this.state.dataAdd ? this.state.dataAdd : [];
          ads.push(user);
          this.setState({
            dataAdd: ads,
            dataSuccess: this.state.dataSuccess + 1,
          });
        } else {
          let fds = this.state.dataFailed ? this.state.dataFailed : [];
          fds.push(user);
          this.setState({
            dataFailed: fds,
            dataSuccess: this.state.dataSuccess + 1,
          });
          // NotificationManager.error(
          // 	"User",
          // 	`User Add Error`,
          // 	3000,
          // 	null,
          // 	null,
          // 	""
          // );
        }
      })
      .catch((error) => {
        console.log(error);
        console.log(error.response?.data);
        console.log(error.response?.status);
        console.log(error.response?.headers);
        let err = "";
        if (error.response?.data) {
          Object.keys(error.response?.data).forEach((key) => {
            err =
              err +
              " \n" +
              key.toUpperCase().replace("_", " ") +
              ": " +
              error.response?.data[key];
          });
        }
        user["error"] = err;
        let fds = this.state.dataFailed ? this.state.dataFailed : [];
        fds.push(user);
        this.setState({
          dataFailed: fds,
          dataSuccess: this.state.dataSuccess + 1,
        });
      });
  }

  async editUser(user) {
    let urll =
      this.props.role === "company_admin" ||
      this.props.role === "trip_odo_admin"
        ? "/api/company_admin/users/"
        : "/api/admin/users/";
    const url = `${urll}${user.id}`;
    console.log("url", url);
    const formData = new FormData();
    formData.append("email", user.email);

    // let charset =
    // 	"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    // let password = "";
    // for (var i = 0, n = charset.length; i < 6; ++i) {
    // 	password = password + charset.charAt(Math.floor(Math.random() * n));
    // }

    // formData.append("password", password);
    if (user.first_name) formData.append("first_name", user.first_name);

    if (user.last_name) formData.append("last_name", user.last_name);

    let groups = [user.groups];

    if (user.groups) formData.append("groups", groups);

    let facility = [user.facility];

    if (user.facility) formData.append("facility", facility);
    let company = [user.company];

    if (user.company) formData.append("company", company);

    await apiAuth
      .patch(url, formData)
      .then((response) => {
        console.log(response);
        console.log(response.data);
        if (response.status === 200) {
          let uds = this.state.dataUpdate ? this.state.dataUpdate : [];
          uds.push(user);
          this.setState({
            dataUpdate: uds,
            dataSuccess: this.state.dataSuccess + 1,
          });
          // NotificationManager.success(
          // 	"User",
          // 	`User Edited Successfully`,
          // 	3000,
          // 	null,
          // 	null,
          // 	""
          // );
        } else {
          let fds = this.state.dataFailed ? this.state.dataFailed : [];
          fds.push(user);
          this.setState({
            dataFailed: fds,
            dataSuccess: this.state.dataSuccess + 1,
          });
          // NotificationManager.error(
          // 	"User",
          // 	`User Edit Error`,
          // 	3000,
          // 	null,
          // 	null,
          // 	""
          // );
        }
      })
      .catch((error) => {
        console.log(error);
        console.log(error.response?.data);
        console.log(error.response?.status);
        console.log(error.response?.headers);
        let err = "";
        if (error.response?.data) {
          Object.keys(error.response?.data).forEach((key) => {
            err =
              err +
              " \n" +
              key.toUpperCase().replace("_", " ") +
              ": " +
              error.response?.data[key];
          });
        }
        user["error"] = err;
        let fds = this.state.dataFailed ? this.state.dataFailed : [];
        fds.push(user);
        this.setState({
          dataFailed: fds,
          dataSuccess: this.state.dataSuccess + 1,
        });
      });
  }

  downloadFileData() {
    const apiData = [
      {
        first_name: "Manish",
        last_name: "Kumawat",
        email: "k55@gmail.com",
        mobile: "9874563215",
        groups: "company_user",
        facility: 42,
        company: "AkashDigital",
      },
      {
        first_name: "Manish",
        last_name: "Kumawat",
        email: "mk55@gmail.com",
        mobile: "9874563215",
        groups: "company_user",
        facility: 42,
        company: "AkashDigital",
      },
    ];
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    const fileName = "UserUploadTemplate";
    const ws = XLSX.utils.json_to_sheet(apiData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  render() {
    return (
      <Fragment>
        <Row mb="4">
          <Colxx lg="12">
            <Breadcrumb heading="User Upload" match={this.props.match} />
            <div className="top-right-button-container float-right">
              <Button
                className="btn btn-light float-right"
                onClick={this.props.history.goBack}
              >
                Back
              </Button>
            </div>

            <Separator mb="4" />
          </Colxx>
        </Row>
        {this.props.initial_load ? (
          <Row className="m-1">
            <Colxx sm="12">
              <Row mb="4">
                <Colxx lg="9">
                  <div className="card mt-4">
                    <div className="card-body">
                      <div className="mb-4 card-subtitle">
                        <div className="mb-3 input-group">
                          <div className="custom-file">
                            <input
                              type="file"
                              id="exampleCustomFileBrowser1"
                              name="customFile"
                              className="custom-file-input"
                              onChange={this.handleChange}
                            />
                            <label className="custom-file-label">
                              {this.state.picfile
                                ? this.state.picfile?.name.slice(0, 15)
                                : "Upload File"}
                            </label>
                          </div>

                          <div className="input-group-prepend ml-1">
                            <span
                              className="btn btn-primary"
                              onClick={() => {
                                this.handleFileData();
                              }}
                            >
                              Show
                            </span>
                          </div>
                          <div className="input-group-prepend ml-1">
                            <span
                              className="btn btn-primary"
                              onClick={() => {
                                this.saveFileData();
                              }}
                            >
                              Save
                            </span>
                          </div>
                          <div className="input-group-prepend ml-1">
                            <span
                              className="btn btn-primary"
                              onClick={() => {
                                this.downloadFileData();
                              }}
                            >
                              Download Template File
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Colxx>
              </Row>
              {this.state.progress ? (
                <Row className="mt-4">
                  <Colxx lg="12">
                    <div className="w-100">
                      <ProgressBar
                        variant="primary"
                        animated
                        now={Math.round(
                          (this.state.dataSuccess / this.state.data.length) *
                            100
                        )}
                        label={`${Math.round(
                          (this.state.dataSuccess / this.state.data.length) *
                            100
                        )}%`}
                        style={{ height: "16px" }}
                      />
                    </div>
                  </Colxx>
                </Row>
              ) : (
                <></>
              )}
              {this.state.dataSuccess === this.state.data?.length ? (
                <Row className="mt-4">
                  <Colxx md="3">
                    <Card className="d-flex flex-column text-center rounded-lg pb-0">
                      <p
                        className="mt-1 font-weight-bold text-danger cursor-pointer"
                        onClick={() =>
                          this.setState(
                            {
                              failed: true,
                              showData: null,
                            },
                            () => {
                              this.setState({
                                showData: this.state.dataFailed,
                              });
                            }
                          )
                        }
                      >
                        Failed
                      </p>
                      <p className="font-weight-bold h4 text-danger">
                        {this.state.dataFailed?.length || 0}
                      </p>
                    </Card>
                  </Colxx>
                  <Colxx md="3">
                    <Card className="d-flex flex-column text-center rounded-lg pb-0">
                      <p
                        className="mt-1 font-weight-bold text-success cursor-pointer"
                        onClick={() =>
                          this.setState(
                            {
                              failed: false,
                              showData: null,
                            },
                            () => {
                              this.setState({
                                showData: this.state.dataUpdate,
                              });
                            }
                          )
                        }
                      >
                        Updated
                      </p>
                      <p className="font-weight-bold h4 text-success">
                        {this.state.dataUpdate?.length || 0}
                      </p>
                    </Card>
                  </Colxx>
                  <Colxx md="3">
                    <Card className="d-flex flex-column text-center rounded-lg pb-0">
                      <p
                        className="mt-1 font-weight-bold text-success cursor-pointer"
                        onClick={() =>
                          this.setState(
                            {
                              failed: false,
                              showData: null,
                            },
                            () => {
                              this.setState({
                                showData: this.state.dataAdd,
                              });
                            }
                          )
                        }
                      >
                        Added
                      </p>
                      <p className="font-weight-bold h4 text-success">
                        {this.state.dataAdd?.length || 0}
                      </p>
                    </Card>
                  </Colxx>
                  <Colxx md="3">
                    <Card className="d-flex flex-column text-center rounded-lg pb-0">
                      <p
                        className="mt-1 font-weight-bold cursor-pointer"
                        onClick={() =>
                          this.setState(
                            {
                              failed: false,
                              showData: null,
                            },
                            () => {
                              this.setState({
                                showData: this.state.data,
                              });
                            }
                          )
                        }
                      >
                        Total
                      </p>
                      <p className="font-weight-bold h4">
                        {this.state.data?.length || 0}
                      </p>
                    </Card>
                  </Colxx>
                </Row>
              ) : (
                <></>
              )}

              {this.state.showData && this.state.showData?.length > 0 ? (
                <>
                  <Row className="d-flex justify-content-end mt-4 mr-2">
                    <ExportToExcel
                      apiData={this.state.showData.map((report) => {
                        const {
                          first_name,
                          last_name,
                          email,
                          mobile,
                          groups,
                          facility,
                          company,
                          error,
                        } = report;

                        let returnObj = {
                          first_name: first_name,
                          last_name: last_name,
                          email: email,
                          mobile: mobile,
                          groups: groups,
                          facility: facility,
                          company: company,
                        };

                        if (this.state.failed) {
                          returnObj["Error"] = error;
                        }
                        return returnObj;
                      })}
                      fileName={"UserUploadData"}
                    />
                  </Row>
                  <Card className="mt-4">
                    <Table
                      columns={
                        this.state.failed ? columns : columns.slice(0, -1)
                      }
                      data={this.state.showData}
                      noPagination={
                        this.state.showData?.length > 10 ? false : true
                      }
                      columnFilter={[
                        {
                          name: "First Name",
                          dropDown: false,
                        },
                        {
                          name: "Last Name",
                          dropDown: false,
                        },
                        {
                          name: "Email",
                          dropDown: false,
                        },
                        {
                          name: "Mobile",
                          dropDown: false,
                        },
                        {
                          name: "Groups",
                          dropDown: false,
                        },
                        {
                          name: "Facility",
                          dropDown: false,
                        },
                      ]}
                    />
                  </Card>
                </>
              ) : (
                <></>
              )}
            </Colxx>
          </Row>
        ) : (
          <Fragment></Fragment>
        )}
      </Fragment>
    );
  }
}

const mapStateToProps = ({ authUser }) => {
  const { timezone } = authUser;

  let rol = null;

  if (authUser.roles.includes("trip_odo_admin")) {
    rol = "trip_odo_admin";
  }

  if (authUser.roles.includes("company_admin")) {
    rol = "company_admin";
  }

  if (authUser.roles.includes("superadmin")) {
    rol = "superadmin";
  }

  return {
    timezone: timezone,
    role: rol,
  };
};

const mapActionsToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapActionsToProps)(UserUpload);
