import React, { Component } from "react";
import { Row, ProgressBar } from "react-bootstrap";
import { Colxx } from "../../../components/common/CustomBootstrap";
import Table from "../Common/Table";
import "./custom.css";
class DashTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      columns: [
        {
          Header: "District",
          accessor: "properties.distname",
        },
        {
          Header: "Progress",
          accessor: (row, rowIndex) => row,
          Cell: ({ cell: { value } }) => (
            <>
              {value && (
                <ProgressBar
                  variant="success"
                  now={value.properties.distarea / 100}
                />
              )}
            </>
          ),
        },
        {
          Header: "Male",
          accessor: "properties.totpopmale",
        },
        {
          Header: "Female",
          accessor: "properties.totpopfema",
        },
      ],
    };
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   return (
  //     nextProps.filter !== this.props.filter ||
  //     nextProps.selectedMapDistrict !== this.props.selectedMapDistrict ||
  //     this.props.goals?.length !== nextProps.goals?.length
  //     // this.props.dataSet?.length !== nextProps.dataSet?.length
  //   );
  // }

  render() {
    return (
      <>
        {this.props.goals?.length > 0 && this.props.difNERScores ? (
          //   <Table
          //     columns={this.state.columns}
          //     data={this.props.dataSet}
          //     noPagination={true}
          //   />
          <>
            <Row className="border-bottom pb-2 d-flex align-items-center h6 font-weight-bold">
              <Colxx lg="6">Goal</Colxx>
              <Colxx lg="4">Score</Colxx>
            </Row>
            {this.props.goals.map((data, index) => {
              return (
                <>
                  {index === 0 ? (
                    <Row className="border-bottom py-2 d-flex align-items-center bg-theme-3 mr-0">
                      <Colxx lg="6" className="font-weight-bold">
                        District Composite Score
                      </Colxx>
                      <Colxx lg="4">
                        <Row>
                          <Colxx lg="8">
                            <ProgressBar
                              variant={`progress-custom-${
                                this.props.difNERScores[
                                  this.props.selectedMapDistrict
                                ]
                                  ? Number(
                                      this.props.difNERScores[
                                        this.props.selectedMapDistrict
                                      ][data]
                                    ).toFixed(0) < 49
                                    ? "first"
                                    : Number(
                                        this.props.difNERScores[
                                          this.props.selectedMapDistrict
                                        ][data]
                                      ).toFixed(0) < 64
                                    ? "second"
                                    : Number(
                                        this.props.difNERScores[
                                          this.props.selectedMapDistrict
                                        ][data]
                                      ).toFixed(0) < 99
                                    ? "third"
                                    : "fourth"
                                  : "first"
                              }`}
                              style={{ height: "16px",
                                border: "1px solid black",
                               }}
                              now={
                                // (data.properties.distarea * Math.random() * 4) / 100
                                this.props.difNERScores[
                                  this.props.selectedMapDistrict
                                ]
                                  ? Number(
                                      this.props.difNERScores[
                                        this.props.selectedMapDistrict
                                      ][data]
                                    ).toFixed(0)
                                  : 0
                              }
                            />
                          </Colxx>
                          <Colxx lg="4">
                            {" "}
                            {this.props.difNERScores[
                              this.props.selectedMapDistrict
                            ]
                              ? Number(
                                  this.props.difNERScores[
                                    this.props.selectedMapDistrict
                                  ][data]
                                ).toFixed(0)
                              : 0}
                          </Colxx>
                        </Row>
                      </Colxx>
                    </Row>
                  ) : (
                    <Row className="border-bottom py-2 d-flex align-items-center">
                      <Colxx lg="6" className="font-weight-bold">
                        {/* {data.properties.distname} */}
                        {data}
                      </Colxx>
                      <Colxx lg="4">
                        <Row>
                          <Colxx lg="8">
                            <ProgressBar
                              variant={`progress-custom-${
                                this.props.difNERScores[
                                  this.props.selectedMapDistrict
                                ]
                                  ? Number(
                                      this.props.difNERScores[
                                        this.props.selectedMapDistrict
                                      ][data]
                                    ).toFixed(0) < 49
                                    ? "first"
                                    : Number(
                                        this.props.difNERScores[
                                          this.props.selectedMapDistrict
                                        ][data]
                                      ).toFixed(0) < 64
                                    ? "second"
                                    : Number(
                                        this.props.difNERScores[
                                          this.props.selectedMapDistrict
                                        ][data]
                                      ).toFixed(0) < 99
                                    ? "third"
                                    : "fourth"
                                  : "first"
                              }`}
                              style={{
                                height: "16px",
                                border: "1px solid black",
                              }}
                              now={
                                // (data.properties.distarea * Math.random() * 4) / 100
                                this.props.difNERScores[
                                  this.props.selectedMapDistrict
                                ]
                                  ? Number(
                                      this.props.difNERScores[
                                        this.props.selectedMapDistrict
                                      ][data]
                                    ).toFixed(0)
                                  : 0
                              }
                            />
                          </Colxx>
                          <Colxx lg="4">
                            {" "}
                            {this.props.difNERScores[
                              this.props.selectedMapDistrict
                            ]
                              ? Number(
                                  this.props.difNERScores[
                                    this.props.selectedMapDistrict
                                  ][data]
                                ).toFixed(0)
                              : 0}
                          </Colxx>
                        </Row>
                      </Colxx>
                    </Row>
                  )}
                </>
              );
            })}
          </>
        ) : (
          <></>
        )}
      </>
    );
  }
}

export default DashTable;
