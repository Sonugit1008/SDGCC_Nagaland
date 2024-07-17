import React, { Component } from "react";
import { connect } from "react-redux";
import PageHeader from "../common/PageHeader";
import Select from "react-select";
// import CardBodyCell from "../common/CardBodyCell";
import { Row, Card, CardBody, Label } from "reactstrap";
import { Colxx } from "../../components/common/CustomBootstrap";

import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  BarController,
  Legend,
  Tooltip,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import API from "../../helpers/API";
ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  BarController,
  Legend,
  Tooltip
);
const ViewDash = React.lazy(() =>
  import(
    /* webpackChunkName: "views" */ "../PublicDashboard/DashBoard/NewMainDashboard"
  )
);

const ViewMainDash = React.lazy(() =>
  import(/* webpackChunkName: "views" */ "../PublicDashboard/DashBoard/index")
);
const labels = [
  "No Hunger",
  "Zero Hunger",
  "Good health and well-being",
  "Quality education",
  "Gender equality",
  "Clean water and sanitation",
  "Affordable and clean energy",
  "Clean water and sanitation",
  "Affordable and clean energy",
  "Decent work and economic growth",
  "Industry, Innovation and Infrastructure",
  "Reduced inequality",
  "Sustainable cities and communities",
  "Responsible consumption and production",
  "Climate action",
  "Life on land",
  "Peace, justice and strong institutions",
];

export const data1 = {
  labels,
  datasets: [
    {
      type: "bar",
      label: "Index Score",
      backgroundColor: "rgb(197, 25, 45)",
      data: [5, 4, 12, 8, 9, 12, 13, 8, 15, 12, 5, 12, 18, 25, 4, 15, 10],
      borderColor: "white",
      borderWidth: 2,
    },
  ],
};

export const data2 = {
  labels,
  datasets: [
    {
      type: "bar",
      label: "National Score",
      backgroundColor: "rgb(197, 25, 45)",
      data: [5, 4, 12, 8, 9, 12, 13, 8, 15, 12, 5, 12, 18, 25, 4, 15, 10],
      borderColor: "white",
      borderWidth: 2,
    },
    {
      type: "bar",
      label: "State Score",
      backgroundColor: "rgb(76, 159, 56)",
      data: [3, 6, 8, 9, 7, 15, 10, 10, 13, 15, 12, 5, 25, 18, 4, 12, 15],
      borderColor: "white",
      borderWidth: 2,
    },
  ],
};

// export const data3 = {
//   labels,
//   datasets: [
//     {
//       type: "bar",
//       label: "Kohima District Score",
//       backgroundColor: "rgb(162, 25, 66)",
//       data: [5, 4, 12, 8, 9, 12, 13, 8, 15, 12, 5, 12, 18, 25, 4, 15],
//       borderColor: "white",
//       borderWidth: 2,
//     },
//     {
//       type: "bar",
//       label: "State Score",
//       backgroundColor: "rgb(76, 159, 56)",
//       data: [3, 6, 8, 9, 7, 15, 10, 10, 13, 15, 12, 5, 25, 18, 4, 12],
//       borderColor: "white",
//       borderWidth: 2,
//     },
//   ],
// };

class MainDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      selectedGoal: {
        label: "Kohima",
        value: "Kohima",
      },
      isDash: true,
    };
  }

  handleChangeGoal = (selectedGoal) => {
    this.setState({ selectedGoal });
  };
  componentDidMount() {
    this.getGoals();
  }

  getGoals = () => {
    API.get("/api/public/goal/")
      .then((response) => {
        let data = response.data.map((goal) => {
          return goal.name;
        });
        let data1 = {
          labels: data,
          datasets: [
            {
              type: "bar",
              label: "Index Score",
              backgroundColor: "rgb(197, 25, 45)",
              data: data.map((it) => {
                return Math.floor(Math.random() * 50);
              }),
              borderColor: "white",
              borderWidth: 2,
            },
          ],
        };

        let data2 = {
          labels: data,
          datasets: [
            {
              type: "bar",
              label: "National Score",
              backgroundColor: "rgb(197, 25, 45)",
              data: data.map((it) => {
                return Math.floor(Math.random() * 50);
              }),
              borderColor: "white",
              borderWidth: 2,
            },
            {
              type: "bar",
              label: "State Score",
              backgroundColor: "rgb(76, 159, 56)",
              data: data.map((it) => {
                return Math.floor(Math.random() * 50);
              }),
              borderColor: "white",
              borderWidth: 2,
            },
          ],
        };
        this.setState({ goalsData: data, data1: data1, data2: data2 });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // shouldComponentUpdate(nextProps, nextState) {
  //   return (
  //     this.state.goalsData?.length !== nextState.goalsData?.length ||
  //     nextState.selectedGoal !== this.state.selectedGoal
  //   );
  // }

  render() {
    return (
      <>
        {/* <PageHeader
          heading={"Dashboard"}
          is_filter={false}
          filter_func={(text) => this.setState({ filter: text })}
          history={this.props.history}
          match={this.props.match}
          add_new={false}
          back_button={false}
          displaySelector={false}
          changeDisplay={(val) => {
            this.setState({ display: val });
          }}
        ></PageHeader> */}
        <br></br>
        {this.state.isDash && !localStorage.getItem("isdashlog") ? (
          <>
            <ViewMainDash
              isDash={this.state.isDash}
              closeDash={() => {
                this.setState({ isDash: false });
                localStorage.setItem("isdashlog", true);
              }}
            />
          </>
        ) : (
          <>
            <ViewDash {...this.props} isDash={true} />
          </>
        )}
        {/* {this.state.data1 && this.state.data2 && this.state.goalsData ? (
          <>
            <Row>
              <Colxx lg="12" className="mb-4 mt-4">
                <Card>
                  <CardBody>
                    <h2>
                      <span className="ml-3 mt-3"></span>
                    </h2>
                    <Chart
                      height={75}
                      labels={this.state.goalsData}
                      data={this.state.data1}
                    />
                  </CardBody>
                </Card>
              </Colxx>
            </Row>
            <Row>
              <Colxx lg="12" className="mb-4 mt-2">
                <Card>
                  <CardBody>
                    <h2>
                      <span className="ml-3 mt-3"></span>
                    </h2>
                    <Chart
                      height={75}
                      labels={this.state.goalsData}
                      data={this.state.data2}
                    />
                  </CardBody>
                </Card>
              </Colxx>
            </Row>
            <Row>
              <Colxx lg="3">
                <div className="form-group ">
                  <Label htmlFor="policy">Select District</Label>
                  <Select
                    options={[
                      {
                        label: "Dimapur",
                        value: "Dimapur",
                      },
                      {
                        label: "Kiphire",
                        value: "Kiphire",
                      },
                      {
                        label: "Kohima",
                        value: "Kohima",
                      },
                      {
                        label: "Longleng",
                        value: "Longleng",
                      },
                      {
                        label: "Mokokchung",
                        value: "Mokokchung",
                      },
                      {
                        label: "Mon",
                        value: "Mon",
                      },
                      {
                        label: "Noklak",
                        value: "Noklak",
                      },
                      {
                        label: "Peren",
                        value: "Peren",
                      },
                      {
                        label: "Phek",
                        value: "Phek",
                      },
                      {
                        label: "Tuensang",
                        value: "Tuensang",
                      },
                      {
                        label: "Wokha",
                        value: "Wokha",
                      },
                      {
                        label: "Zunheboto",
                        value: "Zunheboto",
                      },
                    ]}
                    defaultValue={this.state.selectedGoal}
                    onChange={this.handleChangeGoal}
                  />
                </div>
              </Colxx>
              <Colxx lg="12" className="mb-4 mt-4">
                <Card>
                  <CardBody>
                    <h2>
                      <span className="ml-3 mt-3"></span>
                    </h2>
                    <Chart
                      height={75}
                      labels={this.state.goalsData}
                      data={{
                        labels: this.state.goalsData,
                        datasets: [
                          {
                            type: "bar",
                            label: `${this.state.selectedGoal.value} District Score`,
                            backgroundColor: "rgb(162, 25, 66)",
                            data: this.state.goalsData.map((it) => {
                              return Math.floor(Math.random() * 50);
                            }),
                            borderColor: "white",
                            borderWidth: 2,
                          },
                          {
                            type: "bar",
                            label: "State Score",
                            backgroundColor: "rgb(76, 159, 56)",
                            data: this.state.goalsData.map((it) => {
                              return Math.floor(Math.random() * 50);
                            }),
                            borderColor: "white",
                            borderWidth: 2,
                          },
                        ],
                      }}
                    />
                  </CardBody>
                </Card>
              </Colxx>
            </Row>
          </>
        ) : (
          <></>
        )} */}
      </>
    );
  }
}

const mapStateToProps = ({ authUser }) => {
  const { timezone } = authUser;

  let flag = {
    write: true,
    edit: true,
  };

  return {
    timezone: timezone,
    permission: flag,
  };
};

const mapActionsToProps = (dispatch) => {
  return {};
};
export default connect(mapStateToProps, mapActionsToProps)(MainDashboard);
