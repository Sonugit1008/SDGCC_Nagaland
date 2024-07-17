import React, { Component } from "react";
import { Row } from "react-bootstrap";
import { Button, Card } from "reactstrap";
import ChartCard from "../Common/ChartCard";
import { Colxx } from "../Common/CustomBootstrap";
import { Modal } from "react-bootstrap";
import BarChart from "../Common/BarChart";
import ScatterChart from "../Common/ScatterChart";
import PieChart from "../Common/PieChart";
import PolarAreaChart from "../Common/PolarAreaChart";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
} from "chart.js";
Chart.register(CategoryScale, LinearScale, BarElement, PointElement);

class DashView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      verticalBarData: [],
      scatterData: [],
      pieData: [],
      chartModal: false,
      loading: true,
      selectedChart1: "",
      selectedChart2: "",
      selectedChart3: "",
      selectedChart4: "",
      selectedChart5: "",
      selectedChart6: "",
      selectedChart7: "",
      selectedChart8: "",
      selectedModalChart: "",
    };
  }

  componentDidMount() {
    this.handleChartData(this.props.dataSet);
  }

  handleChartData = (data) => {
    this.setState({ loading: true });
    let veticleBarlabel = [];
    let veticleBarData = [];
    let veticleBarDataset = [];
    let Scatterlabel = "Area";
    let ScatterData = [];
    let ScatterDataset = [];
    let pieDataset = [];
    data.forEach((val) => {
      veticleBarlabel.push(val.properties.distname);
      veticleBarData.push(Number(val.properties.distarea) / 100);
      ScatterData.push({
        x: Number(val.properties.distcode),
        y: Number(val.properties.distarea) / 100,
      });
    });
    veticleBarDataset.push({
      label: "Area",
      backgroundColor: "rgba(54, 162, 235, 0.2)",
      borderColor: "rgba(54, 162, 235, 1)",
      borderWidth: 1,
      hoverBackgroundColor: "rgba(255,99,132,0.4)",
      hoverBorderColor: "rgba(255,99,132,1)",
      data: veticleBarData,
    });
    ScatterDataset.push({
      label: Scatterlabel,
      data: ScatterData,
      backgroundColor: "rgba(255, 99, 132, 1)",
    });
    pieDataset.push({
      label: "Area",
      backgroundColor: veticleBarData.map(() => {
        let r = Math.floor(Math.random() * 200);
        let g = Math.floor(Math.random() * 200);
        let b = Math.floor(Math.random() * 200);
        let color = "rgb(" + r + ", " + g + ", " + b + ")";
        return color;
      }),
      borderColor: "#fff",
      borderWidth: 1,
      // hoverBackgroundColor: "rgba(255,99,132,0.4)",
      // hoverBorderColor: "rgba(255,99,132,1)",
      data: veticleBarData,
    });
    const VerticleBarDataDb = {
      labels: veticleBarlabel,
      datasets: veticleBarDataset,
    };

    const ScatterDataDb = {
      datasets: ScatterDataset,
    };
    const pieDataDb = {
      labels: veticleBarlabel,
      datasets: pieDataset,
    };
    this.setState(
      {
        verticalBarData: VerticleBarDataDb,
        scatterData: ScatterDataDb,
        pieData: pieDataDb,
      },
      () => {
        this.setState({ loading: false });
      }
    );
  };

  downloadData = async () => {
    const fileName = "Data";
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    let apiData = await this.props.dataSet.map((report) => {
      const { properties } = report;

      let returnObj = {
        State: properties.statename,
        District: properties.distname,
        Area: properties.distarea,
        Male: properties.totpopmale,
        Female: properties.totpopfema,
      };

      return returnObj;
    });
    const ws = XLSX.utils.json_to_sheet(apiData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  render() {
    return (
      <>
        {this.state.loading ? (
          <></>
        ) : (
          <>
            <Row className="justify-content-center mt-4">
              <Colxx xs="10">
                <Card className="p-2 text-justify text-danger">
                  <h4>
                    SDG 1.2 By 2030, reduce at least by half the proportion of
                    men, women and children of all ages living in poverty in all
                    its dimensions according to national definitions{" "}
                  </h4>
                </Card>
              </Colxx>
            </Row>
            <Row className="mt-2 d-flex justify-content-around">
              <Colxx sm="3" className="d-flex justify-content-center">
                <ChartCard
                  selectedChart={this.state.selectedChart1}
                  setChart={(val) => {
                    this.setState({
                      selectedChart1: val,
                      selectedModalChart: val,
                    });
                  }}
                  data={
                    this.state.selectedChart1 === "Scatter"
                      ? this.state.scatterData
                      : this.state.selectedChart1 === "Pie"
                      ? this.state.pieData
                      : this.state.selectedChart1 === "Area"
                      ? this.state.pieData
                      : this.state.verticalBarData
                  }
                  openModal={() => {
                    this.setState({
                      chartModal: true,
                    });
                  }}
                  downloadData={() => {
                    this.downloadData();
                  }}
                />
              </Colxx>
              <Colxx sm="3" className="d-flex justify-content-center">
                <ChartCard
                  selectedChart={this.state.selectedChart2}
                  setChart={(val) => {
                    this.setState({
                      selectedChart2: val,
                    });
                  }}
                  data={
                    this.state.selectedChart2 === "Scatter"
                      ? this.state.scatterData
                      : this.state.selectedChart2 === "Pie"
                      ? this.state.pieData
                      : this.state.verticalBarData
                  }
                />
              </Colxx>
              <Colxx sm="3" className="d-flex justify-content-center">
                <ChartCard
                  selectedChart={this.state.selectedChart3}
                  setChart={(val) => {
                    this.setState({
                      selectedChart3: val,
                    });
                  }}
                  data={
                    this.state.selectedChart3 === "Scatter"
                      ? this.state.scatterData
                      : this.state.selectedChart3 === "Pie"
                      ? this.state.pieData
                      : this.state.verticalBarData
                  }
                />
              </Colxx>
            </Row>
            <Row className="mt-2 d-flex justify-content-around">
              <Colxx sm="3" className="d-flex justify-content-center">
                <ChartCard
                  selectedChart={this.state.selectedChart4}
                  setChart={(val) => {
                    this.setState({
                      selectedChart4: val,
                    });
                  }}
                  data={
                    this.state.selectedChart4 === "Scatter"
                      ? this.state.scatterData
                      : this.state.selectedChart4 === "Pie"
                      ? this.state.pieData
                      : this.state.verticalBarData
                  }
                />
              </Colxx>
              <Colxx sm="3" className="d-flex justify-content-center">
                <ChartCard
                  selectedChart={this.state.selectedChart5}
                  setChart={(val) => {
                    this.setState({
                      selectedChart5: val,
                    });
                  }}
                  data={
                    this.state.selectedChart5 === "Scatter"
                      ? this.state.scatterData
                      : this.state.selectedChart5 === "Pie"
                      ? this.state.pieData
                      : this.state.verticalBarData
                  }
                />
              </Colxx>
              <Colxx sm="3" className="d-flex justify-content-center">
                <ChartCard
                  selectedChart={this.state.selectedChart6}
                  setChart={(val) => {
                    this.setState({
                      selectedChart6: val,
                    });
                  }}
                  data={
                    this.state.selectedChart6 === "Scatter"
                      ? this.state.scatterData
                      : this.state.selectedChart6 === "Pie"
                      ? this.state.pieData
                      : this.state.verticalBarData
                  }
                />
              </Colxx>
            </Row>
            <Row className="justify-content-center mt-4">
              <Colxx xs="10">
                <Card className="p-2 text-justify text-danger">
                  <h4>
                    SDG 1.a Ensure significant mobilization of resources from a
                    variety of sources, including through enhanced development
                    cooperation, in order to provide adequate and predictable
                    means for developing countries, in particular least
                    developed countries, to implement programmes and policies to
                    end poverty in all its dimensions
                  </h4>
                </Card>
              </Colxx>
            </Row>
            <Row className="mt-2 mb-4 d-flex justify-content-around">
              <Colxx sm="3" className="d-flex justify-content-center">
                <ChartCard
                  selectedChart={this.state.selectedChart7}
                  setChart={(val) => {
                    this.setState({
                      selectedChart7: val,
                    });
                  }}
                  data={
                    this.state.selectedChart7 === "Scatter"
                      ? this.state.scatterData
                      : this.state.selectedChart7 === "Pie"
                      ? this.state.pieData
                      : this.state.verticalBarData
                  }
                />
              </Colxx>
            </Row>
            <Modal show={this.state.chartModal} size="lg" backdrop={"static"}>
              <Modal.Header>
                <span className="badge-info badge-pill">Chart</span>
                <i
                  class="fa-lg fas fa-times text-dark float-right cursor-pointer"
                  onClick={() => this.setState({ chartModal: false })}
                ></i>
              </Modal.Header>
              <Modal.Body>
                <Row>
                  <Colxx lg="12">
                    {this.state.selectedModalChart === "Scatter" ? (
                      <ScatterChart
                        height={200}
                        data={this.state.scatterData}
                      />
                    ) : this.state.selectedModalChart === "Pie" ? (
                      <PieChart height={200} data={this.state.pieData} />
                    ) : this.state.selectedModalChart === "Area" ? (
                      <PolarAreaChart height={200} data={this.state.pieData} />
                    ) : (
                      <BarChart
                        height={200}
                        data={this.state.verticalBarData}
                      />
                    )}
                  </Colxx>
                </Row>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  color="primary"
                  onClick={() =>
                    this.setState({ viewlogImage: null, chartModal: false })
                  }
                >
                  Okay
                </Button>{" "}
              </Modal.Footer>
            </Modal>
          </>
        )}
      </>
    );
  }
}

export default DashView;
