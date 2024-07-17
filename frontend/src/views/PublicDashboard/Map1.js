import React, { Component } from "react";
import { MapContainer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { features } from "../components/Data/data1.json";
import { dataColors } from "./dataColor";
import Header from "./Navbar";
import { ProgressBar, Row } from "react-bootstrap";
import { Colxx } from "./Common/CustomBootstrap";
import Table from "./Common/Table";
import Switch from "react-switch";
import { ExportToExcel } from "./ExportToExcel";
import { Card } from "reactstrap";
import BarChart from "./BarChart";
class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedName: "",
      showProgress: true,
      filter: "Gender Equality",
      data: [],
      chartData: null,
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
        {
          Header: "State",
          accessor: "properties.statename",
        },
        {
          Header: "Statecode",
          accessor: "properties.statecode",
        },
        {
          Header: "DistCode",
          accessor: "properties.distcode",
        },
        {
          Header: "Area",
          accessor: "properties.distarea",
        },
        {
          Header: "Population",
          accessor: "properties.totalpopul",
        },
        {
          Header: "ID",
          accessor: "properties.objectid",
        },
      ],
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState(
      {
        data: [],
      },
      () => {
        this.setState({
          data: features,
          showProgress: event,
        });
      }
    );
  }

  componentDidMount() {
    this.setState({
      data: features,
    });
    this.handleChartData(features);
  }

  handleChartData = (data) => {
    let label = ["Area"];
    let dataset = [];
    data.forEach((val) => {
      let dd = [val.properties.distarea];
      dataset.push({
        label: val.properties.distname,
        backgroundColor: "rgba(255,99,132,0.2)",
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(255,99,132,0.4)",
        hoverBorderColor: "rgba(255,99,132,1)",
        data: dd,
      });
    });

    const dataDb = {
      labels: label,
      datasets: dataset,
    };

    this.setState({ chartData: dataDb });
  };

  onEachDistrict = (district, layer) => {
    const name = district.properties.distname;
    layer.options.weight = 1;
    layer.options.fillOpacity = 0.5;
    layer.options.color = "#fff";

    layer.options.fillColor = dataColors[name];

    // layer.bindTooltip(`${name}`);

    layer
      .bindTooltip(`${name}`, {
        permanent: true,
        className: "bg-transparent border-0 shadow-none",
        direction: "center",
      })
      .openTooltip();
    layer.on({
      click: () => {
        setTimeout(() => {}, 3000);
      },
      mouseover: () => {
        layer.setStyle({
          fillColor: "red",
          weight: 3,
        });
        this.setState({
          selectedName: district.properties.distname,
        });
      },
      mouseout: () => {
        layer.setStyle({
          fillColor: dataColors[name],
          weight: 1,
        });
        this.setState({
          selectedName: "",
        });
      },
    });
  };
  render() {
    return (
      <div className="">
        <Header
          filter={this.state.filter}
          setFilter={(value) => {
            this.setState({
              filter: value,
            });
          }}
        />
        <Row className="d-flex justify-content-center mt-2">
          <Colxx
            xs="2"
            className="d-flex justify-content-center justify-content-sm-end"
          >
            {this.state.filter}
          </Colxx>
          <Colxx
            xs="1"
            className="d-flex justify-content-center font-weight-bold border-right border-left border-danger"
          >
            NAGALAND
          </Colxx>
          <Colxx
            xs="2"
            className="d-flex justify-content-center justify-content-sm-start"
          >
            2021
          </Colxx>
        </Row>
        {/* <h2 className="mt-2 text-center font-weight-bold">NAGALAND</h2> */}
        <hr className="mt-0 bg-light" />
        <div className="d-flex flex-column flex-sm-row">
          <Colxx sm="6">
            <MapContainer
              style={{
                height: "60vh",
              }}
              className="mx-0 mx-sm-4 mt-4"
              zoom={8}
              center={[26.2, 94.5]}
            >
              <div className="w-50 text-left d-flex flex-column justify-content-start align-items-center mt-2">
                <p className="font-weight-bold">District Details</p>
                {this.state.selectedName ? (
                  <strong>{this.state.selectedName}</strong>
                ) : (
                  ""
                )}
              </div>
              <GeoJSON data={features} onEachFeature={this.onEachDistrict} />
            </MapContainer>
            <Row className="mt-2">
              <Row className="w-100 justify-content-center">
                <Colxx className="d-flex ml-2 justify-content-center align-items-center">
                  <div
                    className="bg-info"
                    style={{ width: "20px", height: "15px" }}
                  ></div>
                  <p className="pt-3 pl-1">Category1</p>
                </Colxx>
                <Colxx className="d-flex ml-2 justify-content-center align-items-center">
                  <div
                    className="bg-warning"
                    style={{ width: "20px", height: "15px" }}
                  ></div>
                  <p className="pt-3 pl-1">Category2</p>
                </Colxx>
              </Row>
              <Row className="w-100 justify-content-center">
                <Colxx className="d-flex ml-2 justify-content-center align-items-center">
                  <div
                    className="bg-danger"
                    style={{ width: "20px", height: "15px" }}
                  ></div>
                  <p className="pt-3 pl-1">Category3</p>
                </Colxx>
                <Colxx className="d-flex ml-2 justify-content-center align-items-center">
                  <div
                    className="bg-success"
                    style={{ width: "20px", height: "15px" }}
                  ></div>
                  <p className="pt-3 pl-1">Category4</p>
                </Colxx>
              </Row>
            </Row>
          </Colxx>
          <Colxx sm="6" className="py-0">
            <div className="d-flex">
              <div className="d-flex ml-2 mt-2">
                <p>Show Progress</p>
                <Switch
                  height={20}
                  width={48}
                  onChange={this.handleChange}
                  className="mt-1 ml-2"
                  checked={this.state.showProgress}
                />
              </div>
              {this.state.data.length > 0 ? (
                <div className="w-75 d-flex justify-content-end">
                  <ExportToExcel
                    apiData={this.state.data.map((report) => {
                      const { properties } = report;

                      let returnObj = {
                        District: properties.distname,
                        Area: properties.distarea,
                        Male: properties.totpopmale,
                        Female: properties.totpopfema,
                      };

                      return returnObj;
                    })}
                    fileName={"NagalandReport"}
                  />
                </div>
              ) : (
                <></>
              )}
            </div>
            <Row className="rounded">
              <Colxx lg="12" className="py-0">
                {this.state.data.length > 0 ? (
                  <Table
                    columns={
                      this.state.showProgress
                        ? this.state.columns.slice(0, 4)
                        : this.state.columns
                            .slice(0, 1)
                            .concat(this.state.columns.slice(2, 4))
                    }
                    data={this.state.data}
                    noPagination={true}
                  />
                ) : (
                  <></>
                )}
              </Colxx>
            </Row>
          </Colxx>
        </div>
        <hr className="mt-0 bg-light" />
        {this.state.chartData ? (
          <BarChart data={this.state.chartData} />
        ) : (
          <></>
        )}
        <div className="d-flex">
          <div className="d-flex ml-2 mt-2">
            <h4>{this.state.filter}: Indicator List</h4>
          </div>
          {this.state.data.length > 0 ? (
            <div className="w-75 d-flex justify-content-end">
              <ExportToExcel
                apiData={this.state.data.map((report) => {
                  const { properties } = report;

                  let returnObj = {
                    District: properties.distname,
                    Area: properties.distarea,
                    Male: properties.totpopmale,
                    Female: properties.totpopfema,
                  };

                  return returnObj;
                })}
                fileName={"NagalandReport"}
              />
            </div>
          ) : (
            <></>
          )}
        </div>
        <Row className="rounded">
          <Colxx lg="12" className="py-0">
            <Card className="m-2">
              {this.state.data.length > 0 ? (
                <Table
                  columns={this.state.columns}
                  data={this.state.data}
                  noPagination={true}
                />
              ) : (
                <></>
              )}
            </Card>
          </Colxx>
        </Row>
      </div>
    );
  }
}

export default Map;
