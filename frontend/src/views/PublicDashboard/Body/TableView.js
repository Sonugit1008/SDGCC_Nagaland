import React, { Component } from "react";
import { Row, ProgressBar } from "react-bootstrap";
import { Card } from "reactstrap";
// import ChartCard from "../Common/ChartCard";
// import Select from "react-select";
import Table from "../Common/Table";
import { Colxx } from "../Common/CustomBootstrap";
import { ExportToExcel } from "../ExportToExcel";
class TableView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      columns: [
        {
          Header: "District",
          accessor: "district",
        },
        {
          Header: "Indicator",
          accessor: "name",
        },
        {
          Header: "Baseline",
          accessor: "baseline_value",
        },
        {
          Header: "Progress",
          accessor: "progress_value",
        },
        {
          Header: "Short-Term Target(2022-23)",
          accessor: "short_value",
        },
        {
          Header: "Mid-Term Target(2025-26)",
          accessor: "mid_value",
        },
        {
          Header: "Target(2030)",
          accessor: "value",
        },
      ],
      // [
      //   {
      //     Header: "District",
      //     accessor: "properties.distname",
      //   },
      //   {
      //     Header: "Progress",
      //     accessor: (row, rowIndex) => row,
      //     Cell: ({ cell: { value } }) => (
      //       <>
      //         {value && (
      //           <ProgressBar
      //             variant="success"
      //             now={value.properties.distarea / 100}
      //           />
      //         )}
      //       </>
      //     ),
      //   },
      //   {
      //     Header: "Male",
      //     accessor: "properties.totpopmale",
      //   },
      //   {
      //     Header: "Female",
      //     accessor: "properties.totpopfema",
      //   },
      //   {
      //     Header: "State",
      //     accessor: "properties.statename",
      //   },
      //   {
      //     Header: "Statecode",
      //     accessor: "properties.statecode",
      //   },
      //   {
      //     Header: "DistCode",
      //     accessor: "properties.distcode",
      //   },
      //   {
      //     Header: "Area",
      //     accessor: "properties.distarea",
      //   },
      //   {
      //     Header: "Population",
      //     accessor: "properties.totalpopul",
      //   },
      //   {
      //     Header: "ID",
      //     accessor: "properties.objectid",
      //   },
      // ],
    };
  }

  render() {
    return (
      <>
        <Row className="justify-content-center mt-4">
          <Colxx sm="4"></Colxx>
          <Colxx sm="4" className="d-flex justify-content-center">
            <h2 className="font-weight-bold">REPORT</h2>
          </Colxx>
          <Colxx sm="4" className="d-flex justify-content-end">
            <div className="w-25">
              {this.props.dataSet.length > 0 ? (
                <ExportToExcel
                  apiData={this.props.dataSet.map((report) => {
                    const {
                      properties,
                      district,
                      progress_value,
                      baseline_value,
                      value,
                      short_value,
                      mid_value,
                      name,
                    } = report;

                    let returnObj = {
                      District: district,

                      Indicator: name,
                      Baseline: baseline_value,
                      Progress: progress_value,
                      "Short-Term Target(2022-23)": short_value,
                      "Mid-Term Target(2025-26)": mid_value,
                      "Target(2030)": value,
                    };
                    // let returnObj = {
                    //   District: properties.distname,
                    //   Area: properties.distarea,
                    //   Male: properties.totpopmale,
                    //   Female: properties.totpopfema,
                    // };

                    return returnObj;
                  })}
                  fileName={"NagalandReport"}
                />
              ) : (
                <></>
              )}
            </div>
          </Colxx>
        </Row>
        <Row className="mt-4 mx-2">
          <Colxx xs="12">
            <Card className="px-2 text-justify text-light bg-danger pt-1">
              <h4>SDG Goal: {this.props.filter}</h4>
            </Card>
          </Colxx>
          <p className="mt-2 mx-3">
            Target SDG 1.2 By 2030, reduce at least by half the proportion of
            men, women and children of all ages living in poverty in all its
            dimensions according to national definitions{" "}
          </p>
        </Row>
        <Row>
          <Colxx lg="11" className="ml-4">
            <Row className="rounded">
              <Colxx lg="12">
                <Card>
                  {this.props.dataSet.length > 0 ? (
                    <Table
                      columns={this.state.columns}
                      data={this.props.dataSet}
                      noPagination={true}
                    />
                  ) : (
                    <></>
                  )}
                </Card>
              </Colxx>
            </Row>
          </Colxx>
        </Row>
        <p className="mt-2 mx-4">
          Target SDG 1.4 By 2030, ensure that all men and women, in particular
          the poor and the vulnerable, have equal rights to economic resources,
          as well as access to basic services, ownership and control over land
          and other forms of property, inheritance, natural resources,
          appropriate new technology and financial services, including
          microfinance
        </p>
      </>
    );
  }
}

export default TableView;
