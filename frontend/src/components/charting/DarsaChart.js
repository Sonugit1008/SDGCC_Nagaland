import React, { useState, useEffect } from "react";
import { Line, Bar, Pie } from "react-chartjs-2";
import { Row, Col, Container, Table, Button } from "reactstrap";
import moment from "moment";
import propTypes from "prop-types";

//COnstants or Like Enums
const DarsaBarChartBy = {
  BySectorWise: "BySectorWise",
  ByFloorWise: "ByFloorWise",
  ByFacilityWise: "ByFacilityWise",
};

const ChartDashboard = (props) => {
  const [facilityData, setFacilityData] = useState([]);

  //Demo purpose
  function getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  const randomData = () => {
    const data = [];
    let count_time = new Date();
    for (let i = 1; i <= 5; i++) {
      let in_ = Math.floor(Math.random() * 100 + 1);
      let out_ = Math.floor(Math.random() * 50 + 1);
      count_time = new Date(
        count_time.setMinutes(count_time.getMinutes() + 55)
      );
      data.push({
        facility: `facility${i > 2 ? 2 : 1}`,
        floor: `Floor${i}`,
        sector_name: `s${i}`,
        count_time: count_time.toString(),
        count_direction: i > 2 ? "out" : "in",
        count_in: in_,
        count_out: out_,
        setting_id: i,
        facility_color: i > 2 ? "#5b9bd5" : "#eb7d35",
        floor_color: getRandomColor(),
        sector_color: getRandomColor(),
      });
    }

    setFacilityData(data);
  };

  //API call
  useEffect(() => {
    randomData();
  }, []);

  return (
    <React.Fragment>
      <Container>
        <Row>
          <Col lg={12}>
            <Button
              color="primary"
              onClick={() => randomData()}
              className="m-5"
              style={{ float: "right" }}
            >
              Refresh
            </Button>
            <Table>
              <thead>
                <tr>
                  <th>Sno</th>
                  <th>Facility</th>
                  <th>Floor</th>
                  <th>Sector</th>
                  <th>Count Direction</th>
                  <th>Count In</th>
                  <th>Count Out</th>
                </tr>
              </thead>
              <tbody>
                {facilityData.map((facility, idx) => {
                  return (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{facility.facility}</td>
                      <td>{facility.floor}</td>
                      <td>{facility.sector_name}</td>
                      <td>{facility.count_direction}</td>
                      <td>{facility.count_in}</td>
                      <td>{facility.count_out}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
      <Container>
        <Row>
          <Col lg={6}>
            <DarsaBarChart
              DarsaBarChartBy={DarsaBarChartBy.BySectorWise}
              title="Sector wise"
              jsonData={facilityData}
              countInBackgroundColor="#5b9bd5"
              countOutBackgroundColor="#eb7d35"
              legend={{ position: "bottom" }}
            ></DarsaBarChart>
          </Col>
          <Col lg={6}>
            <DarsaLineChart
              title="Time wise"
              jsonData={facilityData}
              countInBackgroundColor="#5b9bd5"
              countOutBackgroundColor="#eb7d35"
              legend={{ position: "bottom" }}
            ></DarsaLineChart>
          </Col>
        </Row>
      </Container>

      <Container>
        <Row>
          <Col lg={6}>
            <DarsaPieChart
              jsonData={facilityData}
              byKey="count_in"
              title="Today's sector split (In)"
              legend={{ position: "bottom" }}
            />
          </Col>
          <Col lg={6}>
            <DarsaPieChart
              jsonData={facilityData}
              byKey="count_out"
              title="Today's sector split (Out)"
              legend={{ position: "bottom" }}
            />
          </Col>
        </Row>
      </Container>
      <Container>
        <Row>
          <Col lg={6}>
            <DarsaBarChart
              DarsaBarChartBy={DarsaBarChartBy.ByFloorWise}
              title="Floor wise"
              jsonData={facilityData}
              countInBackgroundColor="#5b9bd5"
              countOutBackgroundColor="#eb7d35"
              legend={{ position: "bottom" }}
            ></DarsaBarChart>
          </Col>
          <Col lg={6}>
            <DarsaBarChart
              DarsaBarChartBy={DarsaBarChartBy.ByFacilityWise}
              title="Facility wise"
              jsonData={facilityData}
              countInBackgroundColor="#5b9bd5"
              countOutBackgroundColor="#eb7d35"
              legend={{ position: "bottom" }}
            ></DarsaBarChart>
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  );
};

// DarsaBarChart Compoent START------------------>
const DarsaBarChart = (props) => {
  const [data, setData] = useState({});

  const sectorWiseChart = (json) => {
    const formattedData = {
      labels: [],
      datasets: [
        {
          label: "Count In",
          data: [],
          backgroundColor: props.countInBackgroundColor ?? "#5b9bd5",
        },
        {
          label: "Count Out",
          data: [],
          backgroundColor: props.countOutBackgroundColor ?? "#eb7d35",
        },
      ],
    };
    json.forEach((facility) => {
      if (formattedData.labels.indexOf(facility.sector_name) == -1) {
        formattedData.labels.push(facility.sector_name);
        formattedData.datasets[0].data.push(facility.count_in);
        formattedData.datasets[1].data.push(facility.count_out);
      }
    });
    setData(formattedData);
  };

  const options = {
    scales: {
      xAxes: [
        {
          ticks: {
            display: true,
          },
        },
      ],
    },
    tooltips: {
      callbacks: {
        title: function (tooltipItem, data) {
          return tooltipItem[0].index === 0 ? "Count In" : "Count Out";
        },
      },
    },
  };

  const chartByKeyWise = (byKey, json) => {
    const formattedData = {
      facilities: [],
      labels: ["Count In", "Count Out"],
      datasets: [],
    };
    debugger;
    json.forEach((facility) => {
      if (formattedData.facilities.indexOf(facility[byKey]) === -1) {
        formattedData.facilities.push(facility[byKey]);
        formattedData.datasets.push({
          label: facility[byKey],
          data: [facility.count_in, facility.count_out],
          backgroundColor:
            byKey === "floor" ? facility.floor_color : facility.facility_color,
        });
      } else {
        const dataIndex = formattedData.facilities.indexOf(facility[byKey]);
        const prvsCountIn = formattedData.datasets[dataIndex];
        //count in position
        prvsCountIn.data[0] = prvsCountIn.data[0] + facility.count_in;
        //count out position
        prvsCountIn.data[1] = prvsCountIn.data[1] + facility.count_out;
      }
    });
    console.log("FAC", json);
    setData(formattedData);
  };

  useEffect(() => {
    switch (props.DarsaBarChartBy) {
      case DarsaBarChartBy.BySectorWise:
        sectorWiseChart(props.jsonData);
        break;
      case DarsaBarChartBy.ByFacilityWise:
        chartByKeyWise("facility", props.jsonData);
        break;
      case DarsaBarChartBy.ByFloorWise:
        chartByKeyWise("floor", props.jsonData);
        break;
    }
  }, [props.jsonData]);

  return (
    <React.Fragment>
      <h1 className="text-center">{props.title}</h1>

      <Bar
        data={data}
        {...props}
        options={
          props.DarsaBarChartBy === DarsaBarChartBy.ByFacilityWise ||
          props.DarsaBarChartBy === DarsaBarChartBy.ByFloorWise
            ? options
            : {}
        }
      />
    </React.Fragment>
  );
};
DarsaBarChart.propTypes = {
  title: propTypes.string.isRequired,
  jsonData: propTypes.array.isRequired,
  DarsaBarChartBy: propTypes.string.isRequired,
};

// DarsaBarChart Compoent END------------------>

// DarsaPieChart Compoent START------------------>
const DarsaPieChart = (props) => {
  const [data, setData] = useState({});

  const formatJsonData = (json) => {
    const pieJson = {
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: [],
          hoverBackgroundColor: [],
        },
      ],
    };

    json.forEach((facility) => {
      if (pieJson.labels.indexOf(facility.sector_name) == -1) {
        pieJson.labels.push(facility.sector_name);
        pieJson.datasets[0].data.push(facility[props.byKey]);
        pieJson.datasets[0].backgroundColor.push(facility.sector_color);
      }
    });
    setData(pieJson);
  };
  const options = {
    tooltips: {
      callbacks: {
        label: function (tooltipItem, data) {
          var dataset = data.datasets[tooltipItem.datasetIndex];
          var meta = dataset._meta[Object.keys(dataset._meta)[0]];
          var total = meta.total;
          var currentValue = dataset.data[tooltipItem.index];
          var percentage = parseFloat(
            ((currentValue / total) * 100).toFixed(1)
          );
          return currentValue + " (" + percentage + "%)";
        },
        title: function (tooltipItem, data) {
          return data.labels[tooltipItem[0].index];
        },
      },
    },
  };
  useEffect(() => {
    formatJsonData(props.jsonData);
  }, [props.jsonData]);

  return (
    <React.Fragment>
      <h1 className="text-center">{props.title}</h1>
      <Pie data={data} {...props} options={options} />
    </React.Fragment>
  );
};
DarsaPieChart.propTypes = {
  title: propTypes.string.isRequired,
  jsonData: propTypes.array.isRequired,
  byKey: propTypes.string.isRequired,
};

// DarsaPieChart Compoent END------------------>

// DarsaLineChart Compoent START------------------>
const DarsaLineChart = (props) => {
  const [data, setData] = useState({});

  const formatJsonData = (json) => {
    const lineJson = {
      labels: [],
      datasets: [
        {
          label: "Count In",
          borderJoinStyle: "miter",
          pointBorderColor: props.countInBackgroundColor ?? "5b9bd5",
          borderColor: props.countInBackgroundColor ?? "5b9bd5",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          data: [],
        },
        {
          label: "Count Out",
          borderJoinStyle: "miter",
          pointBorderColor: props.countOutBackgroundColor ?? "orange",
          borderColor: props.countOutBackgroundColor ?? "orange",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          data: [],
        },
      ],
    };

    json.forEach((facility) => {
      const time_ = moment(facility.count_time).format("HH:mm");
      if (lineJson.labels.indexOf(time_) === -1) {
        lineJson.labels.push(time_);
        lineJson.datasets[0].data.push(facility.count_in);
        lineJson.datasets[1].data.push(facility.count_out);
      }
    });
    setData(lineJson);
  };
  useEffect(() => {
    formatJsonData(props.jsonData);
  }, [props.jsonData]);

  return (
    <React.Fragment>
      <h1 className="text-center">{props.title}</h1>
      <Line data={data} {...props} />
    </React.Fragment>
  );
};
DarsaLineChart.propTypes = {
  title: propTypes.string.isRequired,
  jsonData: propTypes.array.isRequired,
};

// DarsaLineChart Compoent END------------------>

export default ChartDashboard;
