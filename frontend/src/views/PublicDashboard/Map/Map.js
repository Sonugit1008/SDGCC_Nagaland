import React, { Component } from "react";
import { MapContainer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Row } from "react-bootstrap";
import { Colxx } from "../Common/CustomBootstrap";
import "./Map.css";
class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDistrict: null,
      showProgress: true,
      filter: "Gender Equality",
      data: [],
    };
  }

  componentDidMount() {
    this.setState({
      data: this.props.data,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.data.length !== this.props.data.length) {
      this.setState(
        {
          data: [],
        },
        () => {
          this.setState({
            data: this.props.data,
          });
        }
      );
    }
  }

  onEachDistrict = (district, layer) => {
    const name = district.properties.distname;
    layer.options.weight = 1;
    layer.options.fillOpacity = 0.5;
    layer.options.color = "#fff";

    layer.options.fillColor = district.properties.color;

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
        this.props.setDistrict({
          label: district.properties.distname,
          value: district.properties.distname,
        });
        setTimeout(() => {}, 3000);
      },
      mouseover: () => {
        layer.setStyle({
          fillColor: "red",
          weight: 3,
        });
        this.setState({
          selectedDistrict: district.properties,
        });
      },
      mouseout: () => {
        layer.setStyle({
          fillColor: district.properties.color,
          weight: 1,
        });
        this.setState({
          selectedDistrict: null,
        });
      },
    });
  };
  render() {
    return (
      <>
        {this.state.data.length > 0 ? (
          <Row className="" style={{ height: "80%" }}>
            <Colxx className="h-100">
              <MapContainer
                style={{
                  height: "60vh",
                  backgroundColor: "white",
                }}
                className="h-100"
                zoom={8}
                scrollWheelZoom={false}
                center={[
                  Math.round(
                    this.props.data[Math.round(this.props.data.length / 2)]
                      ?.geometry.coordinates[0][0][1]
                  ) - 0.7,
                  Math.round(
                    this.props.data[Math.round(this.props.data.length / 2)]
                      ?.geometry.coordinates[0][0][0]
                  ) - 0.4,
                ]}
              >
                <Row className="pl-4 mr-4">
                  <Colxx>
                    <div className="w-50 text-left d-flex flex-column justify-content-start align-items-start mt-4 ml-4 pl-4">
                      <h6 className="font-weight-bold">
                        {/* Goal:&nbsp;{this.props.filter} */}
                        {this.state.selectedDistrict
                          ? this.state.selectedDistrict.distname
                          : "Composite Score"}
                      </h6>
                      {this.state.selectedDistrict ? (
                        <>
                          <div className="d-flex">
                            <div>
                              <h6>Composite Score</h6>
                              <h1 className="font-weight-bold">
                                {this.props.difNERScores[
                                  this.state.selectedDistrict.distname
                                ]
                                  ? this.props.difNERScores[
                                      this.state.selectedDistrict.distname
                                    ]["SDG Index"]
                                  : 0}
                              </h1>
                            </div>
                            <div className="ml-4">
                              <h6>Rank</h6>
                              <h1 className="font-weight-bold">
                                {this.props.districtRanks[
                                  this.props.selectedYear
                                ]
                                  ? this.props.districtRanks[
                                      this.props.selectedYear
                                    ][this.state.selectedDistrict?.distname]
                                    ? this.props.districtRanks[
                                        this.props.selectedYear
                                      ][this.state.selectedDistrict?.distname]
                                    : 0
                                  : 0}
                              </h1>
                            </div>
                          </div>
                          {/* <h6>%</h6> */}
                        </>
                      ) : (
                        ""
                      )}
                    </div>
                  </Colxx>
                </Row>

                <GeoJSON
                  data={this.state.data}
                  onEachFeature={this.onEachDistrict}
                />

                <Row className="w-100 position-absolute fixed-bottom">
                  {/* <Colxx className="d-flex ml-2 justify-content-center align-items-center">
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
                  </Colxx> */}
                </Row>
              </MapContainer>
            </Colxx>
          </Row>
        ) : (
          <></>
        )}
      </>
    );
  }
}

export default Map;
