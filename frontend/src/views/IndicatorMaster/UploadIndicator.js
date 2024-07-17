/* eslint-disable*/
import React, { Component, Fragment } from "react";
import { Button } from "reactstrap";
import { Card, ProgressBar, Row } from "react-bootstrap";
import { Colxx, Separator } from "../../components/common/CustomBootstrap";
import Breadcrumb from "../../containers/navs/Breadcrumb";
import { connect } from "react-redux";
import Table from "../common/Table";
import apiAuth from "../../helpers/ApiAuth";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { ExportToExcel } from "../common/ExportToExcel";

class IndicatorUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      picfile: null,
      modal: false,
      loading: false,
      data: null,
      dataSuccess: 0,
      dataUpdate: [],
      dataAdd: [],
      dataFailed: [],
      dataDeleted: [],
      targets: [],
      districts: [],
      progress: false,
      showData: null,
      failed: false,
      columns: [
        {
          Header: "Goal",
          accessor: "goal",
        },
        {
          Header: "Indicator",
          accessor: "name",
        },
        {
          Header: "Periodicity",
          accessor: "periodicity",
        },
        {
          Header: "Department",
          accessor: "department",
        },
        {
          Header: "Unit",
          accessor: "unit",
        },
        {
          Header: "Error",
          accessor: (row, rowIndex) => row,
          Cell: ({ cell: { value } }) => (
            <>
              <p className="text-danger">{value?.error}</p>
            </>
          ),
        },
      ],
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleFileData = this.handleFileData.bind(this);
    this.saveFileData = this.saveFileData.bind(this);
    this.addData = this.addData.bind(this);
  }

  handleChange(event) {
    this.setState({
      file: URL.createObjectURL(event.target.files[0]),
      picfile: event.target.files[0],
      dataSuccess: 0,
      dataUpdate: 0,
      dataAdd: 0,
      dataFailed: 0,
      dataDeleted: 0,
      showData: null,
      progress: false,
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

        let empData = rowObject;
        console.log("Sheet data", empData);
        empData = empData;
        this.setState({ data: empData, showData: empData });
        // });
      };
    }
  }

  async saveFileData() {
    if (this.state.data && this.state.data?.length > 0) {
      this.setState({ progress: true });

      await this.state.data.forEach(async (data) => {
        await this.addData(data);
      });

      let failed = this.state.dataFailed ? this.state.dataFailed : [];
      failed = failed.concat(fds);
      this.setState({
        dataFailed: failed,
        dataSuccess: this.state.dataSuccess + count,
      });
    }
  }

  async addData(data) {
    const url = "/api/indicator/";

    await apiAuth
      .post(url, data)
      .then((response) => {
        console.log("response", response);
        if (response.status === 200) {
          let ads = this.state.dataAdd ? this.state.dataAdd : [];
          ads.push(data);
          this.setState({
            dataAdd: ads,
            dataSuccess: this.state.dataSuccess + 1,
          });
        } else {
          let fds = this.state.dataFailed ? this.state.dataFailed : [];
          fds.push(data);
          this.setState({
            dataFailed: fds,
            dataSuccess: this.state.dataSuccess + 1,
          });
        }
      })
      .catch((error) => {
        console.log(error);
        console.log(error.response?.data);
        console.log(error.response?.status);
        console.log(error.response?.headers);
        let err = "";

        data["error"] = err;
        let fds = this.state.dataFailed ? this.state.dataFailed : [];
        fds.push(data);
        this.setState({
          dataFailed: fds,
          dataSuccess: this.state.dataSuccess + 1,
        });
      });
  }

  downloadFileData() {
    let apiData = [
      {
        state: "Nagaland",
        district: "Kohima",
        goal: "No Hunger",
        indicator: "Percentage of beneficiaries covered under NFSA",
        periodicity: "Quarterly",
        department: "Food & Civil Supplies",
        unit_type: "Standard",
        unit: "%",
        baseline: "10",
        progress: "15",
        target: "20",
        start_year: "2022",
        end_year: "2023",
      },
    ];

    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    const fileName = "DataUploadTemplate";
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
            <Breadcrumb heading="Upload Data" match={this.props.match} />
            <div className="top-right-button-container float-right">
              <Button
                color="primary"
                className="btn float-right"
                onClick={this.props.history.goBack}
              >
                Back
              </Button>
            </div>

            <Separator mb="4" />
          </Colxx>
        </Row>

        {this.state.loading ? (
          <div className="loading"></div>
        ) : (
          <>
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
                            state,
                            district,
                            goal,
                            indicator,
                            periodicity,
                            department,
                            unit_type,
                            unit,
                            baseline,
                            progress,
                            target,
                            start_year,
                            end_year,
                            error,
                          } = report;

                          let returnObj = {
                            state: state,
                            district: district,
                            goal: goal,
                            indicator: indicator,
                            periodicity: periodicity,
                            department: department,
                            unit_type: unit_type,
                            unit: unit,
                            baseline: baseline,
                            progress: progress,
                            target: target,
                            start_year: start_year,
                            end_year: end_year,
                          };

                          if (this.state.failed) {
                            returnObj["Error"] = error;
                          }
                          return returnObj;
                        })}
                        fileName={"DataUploadData"}
                      />
                    </Row>
                    <Row>
                      <Card className="mt-4 ml-2">
                        <Table
                          columns={
                            this.state.failed
                              ? this.state.columns
                              : this.state.columns.slice(0, -1)
                          }
                          data={this.state.showData}
                          noPagination={
                            this.state.showData?.length > 10 ? false : true
                          }
                        />
                      </Card>
                    </Row>
                  </>
                ) : (
                  <></>
                )}
              </Colxx>
            </Row>
          </>
        )}
      </Fragment>
    );
  }
}

const mapStateToProps = ({ authUser }) => {
  const { timezone } = authUser;

  return {
    timezone: timezone,
  };
};

const mapActionsToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapActionsToProps)(IndicatorUpload);
