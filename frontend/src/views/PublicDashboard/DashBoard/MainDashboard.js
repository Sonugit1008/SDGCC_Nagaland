import React, { Component } from "react";
import "leaflet/dist/leaflet.css";
import { features } from "../Data/data1.json";
import Header from "../Header/Header";
import SubHeader from "../Header/SubHeader";
import Map from "../Map/Map";
import Select from "react-select";
import TableView from "../Body/TableView";
import { Colxx } from "../../../components/common/CustomBootstrap";
import { Card, Row, CardBody, Label } from "reactstrap";
import DashTable from "../Body/DashTable";
import "./Progress.css";
import API from "../../../helpers/API";
import _ from "lodash";
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
  registerables as registerablesJS,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import url from "availity-reactstrap-validation/lib/AvValidator/url";
ChartJS.register(...registerablesJS);
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

class MainDashBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      states: [],
      difIndicators: {},
      sifIndicators: {},
      sifScoreData: [],
      loading: true,
      sifComparisonGraphType: {
        label: "State vs National",
        value: "svn",
      },
      selSIFCompState1: {
        label: "Nagaland",
        value: "Nagaland",
      },
      historySIFType: {
        label: "Goal Wise",
        value: "goal",
      },
      historySIFGoal: {
        label: "SDG Index",
        value: "SDG Index",
      },
      difComparisonGraphType: {
        label: "Nagaland vs District",
        value: "nvd",
      },
      selDIFCompDist1: {
        label: "Kohima",
        value: "Kohima",
      },
      selDIFIndicatorDist: {
        label: "Kohima",
        value: "Kohima",
      },
      historyDIFType: {
        label: "Goal Wise",
        value: "goal",
      },
      historyDIFGoal: {
        label: "SDG Index",
        value: "SDG Index",
      },
      historyDIFDist: {
        label: "Kohima",
        value: "Kohima",
      },
      filter: "SDG Index",
      viewFilter: localStorage.getItem("display")
        ? localStorage.getItem("display")
        : "Dashboard",
      goalsData: [],
      scorePerNitiChartData: {},
      selectedYear: {
        label: "2021",
        value: 2021,
      },
      nationalGoalScores: [],
    };
  }

  componentDidMount() {
    this.getGoals();
    this.getStates();
    this.getDistricts();
  }

  getGoals = () => {
    API.get("/api/public/goal/")
      .then((response) => {
        let data = response.data;
        let goalsName = data.map((goal) => {
          return goal.name;
        });

        this.setState(
          {
            goalsData: data,
            goalsName,
          },
          () => {
            this.viewNationalScore();
          }
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getIndicators = (goalsName) => {
    API.get("/api/public/indicator/")
      .then((response) => {
        let data = response.data;
        let sifIndicators = {};
        let difIndicators = {};
        data
          .filter((id) => id.type === "SIF")
          .forEach((id) => {
            if (sifIndicators[id.goal]) {
              sifIndicators[id.goal].push(id.name);
            } else {
              sifIndicators[id.goal] = [id.name];
            }
          });
        data
          .filter((id) => id.type === "DIF")
          .forEach((id) => {
            if (difIndicators[id.goal]) {
              difIndicators[id.goal].push(id.name);
            } else {
              difIndicators[id.goal] = [id.name];
            }
          });
        this.setState(
          {
            indicators: data,
            sifIndicators: sifIndicators,
            difIndicators: difIndicators,
          },
          () => {
            this.viewGoalsData();
            this.viewSIFScore();
          }
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getStates = () => {
    API.get("/api/state/view/")
      .then((response) => {
        let data = response.data;

        this.setState({ states: data });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getDistricts = () => {
    API.get("/api/district/view/")
      .then((response) => {
        let data = response.data;

        this.setState({ districts: data });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  handleChangeSelSIFCompState1 = (selSIFCompState1) => {
    this.setState({ selSIFCompState1 });
  };

  handleChangeSelSIFCompState2 = (selSIFCompState2) => {
    this.setState({ selSIFCompState2 });
  };

  handleChangeSelDIFCompDist1 = (selDIFCompDist1) => {
    this.setState({ selDIFCompDist1 });
  };

  handleChangeSelDIFCompDist2 = (selDIFCompDist2) => {
    this.setState({ selDIFCompDist2 });
  };

  viewGoalsData = () => {
    API.get("/api/goalvalue/")
      .then((response) => {
        let targetsDIF = response.data
          .filter((data) => data.type === "DIF")
          .map((data) => {
            data["indicatorvalue"] =
              data.indicatorvalue?.length > 0
                ? { ...data.indicatorvalue[0] }
                : {};
            data["indicator_id"] = data.indicatorvalue?.id;
            data["progress_value"] = data.indicatorvalue?.progress_value;
            data["baseline_value"] = data.indicatorvalue?.baseline_value;
            data["value"] = data.indicatorvalue?.value;
            data["short_value"] = data.indicatorvalue?.short_value;
            data["mid_value"] = data.indicatorvalue?.mid_value;
            data["district"] = data.indicatorvalue?.district;

            return data;
          });

        this.setState({
          reports: targetsDIF,
          loading: false,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  viewSIFScore = () => {
    API.get("/api/public/score/?type=SIF")
      .then((res) => {
        let data = res.data;
        let scorePerNitiChartData = {};
        let ngsifscore = data.filter((sc) => sc.name === "Nagaland");

        let nggoalsifscore = _.groupBy(
          ngsifscore.filter((sc) => !sc.indicator),
          "goal"
        );
        let historySIFData = {};

        Object.keys(nggoalsifscore).forEach((key) => {
          let years = _.groupBy(nggoalsifscore[key], "year");
          scorePerNitiChartData[key] = {
            ed_val: years[this.state.selectedYear?.label]
              ? years[this.state.selectedYear?.label][0]?.value
                ? years[this.state.selectedYear?.label][0]?.value
                : 0
              : 0,
            st_val: years[String(this.state.selectedYear?.value - 1)]
              ? years[String(this.state.selectedYear?.value - 1)][0]?.value
                ? years[String(this.state.selectedYear?.value - 1)][0]?.value
                : 0
              : 0,
          };

          if (!historySIFData[key]) historySIFData[key] = {};

          historySIFData[key]["goal"] = {
            labels: Object.keys(years),
            data: Object.keys(years).map((year) => {
              return years[year][0]?.value ? years[year][0]?.value : 0;
            }),
          };
        });

        // Calculating History SIF indicators

        let goal_history_indicator = _.groupBy(
          ngsifscore.filter((sc) => sc.indicator),
          "goal"
        );

        Object.keys(goal_history_indicator).forEach((goal) => {
          if (!historySIFData[goal]) {
            historySIFData[goal] = {};
          }

          let indicator_history = _.groupBy(
            goal_history_indicator[goal],
            "indicator"
          );

          historySIFData[goal]["indicator"] = {};

          this.state.sifIndicators[goal] &&
            this.state.sifIndicators[goal].forEach((ind) => {
              if (indicator_history[ind]) {
                let years_indicator = _.groupBy(indicator_history[ind], "year");
                historySIFData[goal]["indicator"][ind] = {
                  labels: Object.keys(years_indicator),
                  data: Object.keys(years_indicator).map((year) => {
                    return years_indicator[year][0]?.value
                      ? years_indicator[year][0]?.value
                      : 0;
                  }),
                };
              }
            });
        });

        // Calculating Indicators data

        let ngindicatorssif = ngsifscore.filter(
          (sc) => sc.indicator && sc.year === this.state.selectedYear?.label
        );
        let ngindicatorsifscore = {};

        ngindicatorssif.forEach((ind) => {
          if (!ngindicatorsifscore[ind.goal]) {
            ngindicatorsifscore[ind.goal] = {};
          }
          ngindicatorsifscore[ind.goal][ind.indicator] = ind.value;
        });

        let goalSIFIndicatorData = {};

        this.state.goalsName.forEach((key) => {
          goalSIFIndicatorData[key] = {
            label: this.state.sifIndicators[key],
            data: this.state.sifIndicators[key]?.map((it) => {
              if (ngindicatorsifscore[key]) {
                return ngindicatorsifscore[key][it]
                  ? ngindicatorsifscore[key][it]
                  : 0;
              }

              return 0;
            }),
          };
        });

        // Calculation states scores for SIF Comparison Chart

        let statescores = data.filter(
          (sc) => !sc.indicator && sc.year === this.state.selectedYear?.label
        );
        let stategoalscore = _.groupBy(statescores, "name");
        let sifComparisonData = {};

        Object.keys(stategoalscore).forEach((state) => {
          let stateGoals = _.groupBy(stategoalscore[state], "goal");

          sifComparisonData[state] = this.state.goalsName.map((goal) => {
            return stateGoals[goal] ? stateGoals[goal][0]?.value : 0;
          });
        });

        this.setState(
          {
            sifScoreData: data,
            scorePerNitiChartData,
            goalSIFIndicatorData,
            sifComparisonData,
            historySIFData,
          },
          () => {
            this.viewDIFScore();
          }
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  viewNationalScore = () => {
    API.get("/api/public/score/?type=National")
      .then((res) => {
        let data = res.data;

        let goalscores = _.groupBy(data, "goal");
        let nationalGoalScores = this.state.goalsName.map((goal) => {
          if (!goalscores[goal]) return 0;

          let years = _.groupBy(goalscores[goal], "year");
          return years[this.state.selectedYear?.label]
            ? years[this.state.selectedYear?.label][0]?.value
              ? years[this.state.selectedYear?.label][0]?.value
              : 0
            : 0;
        });

        this.setState({ nationalGoalScores: nationalGoalScores }, () => {
          this.getIndicators(this.state.goalsName);
        });
      })
      .catch((error) => {});
  };

  viewDIFScore = () => {
    API.get("/api/public/score/?type=DIF")
      .then((res) => {
        let data = res.data;

        // Calculating History DIF data
        let historyDIFData = {};

        let district_history_indicator = _.groupBy(data, "name");

        Object.keys(district_history_indicator).forEach((dist) => {
          if (!historyDIFData[dist]) {
            historyDIFData[dist] = {};
          }

          let goal_history = _.groupBy(
            district_history_indicator[dist],
            "goal"
          );

          Object.keys(goal_history).forEach((goal) => {
            if (!historyDIFData[dist][goal]) {
              historyDIFData[dist][goal] = {};
            }

            let goalData = goal_history[goal].filter((data) => !data.indicator);

            let goal_years = _.groupBy(goalData, "year");
            historyDIFData[dist][goal]["goal"] = {
              labels: Object.keys(goal_years),
              data: Object.keys(goal_years).map((year) => {
                return goal_years[year][0]?.value
                  ? goal_years[year][0]?.value
                  : 0;
              }),
            };

            let indicatorData = goal_history[goal].filter(
              (data) => data.indicator
            );
            let indicator_history = _.groupBy(indicatorData, "indicator");

            historyDIFData[dist][goal]["indicator"] = {};

            this.state.difIndicators[goal] &&
              this.state.difIndicators[goal].forEach((ind) => {
                if (indicator_history[ind]) {
                  let years_indicator = _.groupBy(
                    indicator_history[ind],
                    "year"
                  );
                  historyDIFData[dist][goal]["indicator"][ind] = {
                    labels: Object.keys(years_indicator),
                    data: Object.keys(years_indicator).map((year) => {
                      return years_indicator[year][0]?.value
                        ? years_indicator[year][0]?.value
                        : 0;
                    }),
                  };
                }
              });
          });
        });

        // Calculation district indicator scores
        let distindicatorsdif = data.filter(
          (sc) => sc.indicator && sc.year === this.state.selectedYear?.label
        );

        let distgoaldif = _.groupBy(distindicatorsdif, "goal");

        let distIndicatorGraphData = {};

        this.state.goalsName.forEach((key) => {
          distIndicatorGraphData[key] = {};

          let dists = {};

          if (distgoaldif[key]) {
            dists = _.groupBy(distgoaldif[key], "name");
          }

          Object.keys(dists).forEach((dist) => {
            let indscores = _.groupBy(dists[dist], "indicator");

            distIndicatorGraphData[key][dist] = this.state.difIndicators[
              key
            ]?.map((it) => {
              if (indscores[it]) {
                return indscores[it][0]?.value ? indscores[it][0]?.value : 0;
              }
              return 0;
            });
          });
        });

        // Calculation district scores for DIF Comparison Chart

        let districtscores = data.filter(
          (sc) => !sc.indicator && sc.year === this.state.selectedYear?.label
        );

        let districtgoalscore = _.groupBy(districtscores, "name");
        let difComparisonData = {};

        let difNERScores = {};

        Object.keys(districtgoalscore).forEach((state) => {
          let districtGoals = _.groupBy(districtgoalscore[state], "goal");
          let nerscores = {};
          difComparisonData[state] = this.state.goalsName.map((goal) => {
            nerscores[goal] = districtGoals[goal]
              ? districtGoals[goal][0]?.value
              : 0;
            return districtGoals[goal] ? districtGoals[goal][0]?.value : 0;
          });

          difNERScores[state] = nerscores;
        });

        this.setState({
          difScoreData: data,
          difComparisonData,
          difNERScores,
          distIndicatorGraphData,
          historyDIFData,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    return (
      <div className="">
        {!this.state.loading ? (
          <>
            <Header
              filter={this.state.filter}
              setFilter={(value) => {
                this.setState(
                  {
                    filter: value,
                  },
                  () => {
                    this.viewNationalScore();
                  }
                );
              }}
              goalsData={this.state.goalsData}
              isDash={this.props.isDash}
            />
            <SubHeader
              setView={(val) => {
                this.setState({
                  viewFilter: val,
                });
                localStorage.setItem("display", val);
              }}
              displayType={this.state.displayType}
              toggleDataType={() => {
                this.setState({ displayType: !this.state.displayType });
              }}
              viewFilter={this.state.viewFilter}
              selectedYear={this.state.selectedYear}
              handleYear={(val) => {
                this.setState({ selectedYear: val }, () => {
                  // this.viewSIFScore();
                  this.viewNationalScore();
                });
              }}
            />
            <hr className="mt-0" />
            {this.state.viewFilter === "Dashboard" ? (
              <>
                <Row className="d-flex justify-content-center mt-4">
                  <Colxx lg="1" className="back_img"></Colxx>
                  <Colxx lg="10">
                    {!this.state.displayType ? (
                      <>
                        <>
                          <Row className="">
                            <Colxx lg="12">
                              <div>
                                <p className="h3 font-weight-bold">
                                  Nagaland:&nbsp;{this.state.filter}
                                </p>
                                <div
                                  className="font-weight-bold pl-2 ml-2"
                                  style={{ borderLeft: "2px solid #CCDADF" }}
                                >
                                  <p className="mb-0">Score</p>
                                  <p className="h3">
                                    {this.state.scorePerNitiChartData[
                                      this.state.filter
                                    ]
                                      ? this.state.scorePerNitiChartData[
                                          this.state.filter
                                        ].ed_val
                                      : 0}
                                  </p>
                                </div>
                              </div>
                            </Colxx>
                          </Row>
                          {/* SIF Scores as per Niti Aayog SDG India Index */}
                          <>
                            <Row style={{ marginTop: "50px" }}>
                              <Colxx lg="3"></Colxx>
                              <Colxx lg="9">
                                <Row
                                  className="d-flex justify-content-start"
                                  style={{ height: "220px" }}
                                >
                                  {this.state.goalsData.map((goal) => {
                                    return (
                                      <>
                                        <div className="position-relative mr-1 d-flex flex-column justify-content-end">
                                          <div className="w-100 d-flex justify-content-center">
                                            <p className="h6">
                                              {this.state.scorePerNitiChartData[
                                                goal.name
                                              ]
                                                ? this.state
                                                    .scorePerNitiChartData[
                                                    goal.name
                                                  ].ed_val
                                                : 0}
                                            </p>
                                          </div>
                                          <div className="w-100 d-flex justify-content-center">
                                            <div
                                              className={
                                                this.state
                                                  .scorePerNitiChartData[
                                                  goal.name
                                                ]
                                                  ? this.state
                                                      .scorePerNitiChartData[
                                                      goal.name
                                                    ].ed_val >= 50 &&
                                                    this.state
                                                      .scorePerNitiChartData[
                                                      goal.name
                                                    ].ed_val <= 64
                                                    ? "bg-warning"
                                                    : this.state
                                                        .scorePerNitiChartData[
                                                        goal.name
                                                      ].ed_val >= 65 &&
                                                      this.state
                                                        .scorePerNitiChartData[
                                                        goal.name
                                                      ].ed_val <= 99
                                                    ? "bg-success"
                                                    : this.state
                                                        .scorePerNitiChartData[
                                                        goal.name
                                                      ].ed_val === 100
                                                    ? "bg-info"
                                                    : "bg-danger"
                                                  : "bg-danger"
                                              }
                                              style={{
                                                height: `${
                                                  this.state
                                                    .scorePerNitiChartData[
                                                    goal.name
                                                  ]
                                                    ? this.state
                                                        .scorePerNitiChartData[
                                                        goal.name
                                                      ].ed_val * 2
                                                    : 0
                                                }px`,
                                                width: "50px",
                                              }}
                                            ></div>
                                          </div>
                                        </div>
                                      </>
                                    );
                                  })}
                                </Row>

                                <Row className="d-flex justify-content-start">
                                  {this.state.goalsData.map((goal) => {
                                    return (
                                      <>
                                        <div className="position-relative mr-1">
                                          <div className="d-flex justify-content-center w-100">
                                            <img
                                              alt=""
                                              src={goal.image}
                                              width="50px"
                                              className="mt-1"
                                            />
                                          </div>
                                        </div>
                                      </>
                                    );
                                  })}
                                </Row>
                              </Colxx>
                            </Row>
                            <Row>
                              <Colxx
                                lg="3"
                                className="d-flex flex-column justify-content-center align-items-end"
                              >
                                <p className="mb-0">Score</p>
                                <p className="mb-0">
                                  {this.state.selectedYear?.label}
                                </p>
                              </Colxx>
                              <Colxx lg="9">
                                <Row className="d-flex justify-content-start mt-2">
                                  {this.state.goalsData.map((goal) => {
                                    return (
                                      <>
                                        <div className="position-relative mr-1">
                                          <div
                                            className={[
                                              "d-flex flex-column justify-content-center align-items-center h6",
                                              this.state.scorePerNitiChartData[
                                                goal.name
                                              ]
                                                ? this.state
                                                    .scorePerNitiChartData[
                                                    goal.name
                                                  ].ed_val >= 50 &&
                                                  this.state
                                                    .scorePerNitiChartData[
                                                    goal.name
                                                  ].ed_val <= 64
                                                  ? "bg-warning"
                                                  : this.state
                                                      .scorePerNitiChartData[
                                                      goal.name
                                                    ].ed_val >= 65 &&
                                                    this.state
                                                      .scorePerNitiChartData[
                                                      goal.name
                                                    ].ed_val <= 99
                                                  ? "bg-success"
                                                  : this.state
                                                      .scorePerNitiChartData[
                                                      goal.name
                                                    ].ed_val === 100
                                                  ? "bg-info"
                                                  : "bg-danger"
                                                : "bg-danger",
                                            ].join(" ")}
                                            style={{
                                              width: "50px",
                                              height: "50px",
                                            }}
                                          >
                                            <i
                                              className={[
                                                "fa",
                                                this.state
                                                  .scorePerNitiChartData[
                                                  goal.name
                                                ]
                                                  ? this.state
                                                      .scorePerNitiChartData[
                                                      goal.name
                                                    ].st_val >
                                                    this.state
                                                      .scorePerNitiChartData[
                                                      goal.name
                                                    ].ed_val
                                                    ? "fa-long-arrow-down"
                                                    : this.state
                                                        .scorePerNitiChartData[
                                                        goal.name
                                                      ].st_val <
                                                      this.state
                                                        .scorePerNitiChartData[
                                                        goal.name
                                                      ].ed_val
                                                    ? "fa-long-arrow-up"
                                                    : "fa-long-arrow-right"
                                                  : "fa-long-arrow-right",
                                              ].join(" ")}
                                              aria-hidden="true"
                                            ></i>
                                            <span className="text-white">
                                              {this.state.scorePerNitiChartData[
                                                goal.name
                                              ]
                                                ? this.state
                                                    .scorePerNitiChartData[
                                                    goal.name
                                                  ].ed_val
                                                : 0}
                                            </span>
                                          </div>
                                        </div>
                                      </>
                                    );
                                  })}
                                </Row>
                              </Colxx>
                            </Row>
                            <Row>
                              <Colxx
                                lg="3"
                                className="d-flex flex-column justify-content-center align-items-end"
                              >
                                <p className="mb-0">Score</p>
                                <p className="mb-0">
                                  {String(this.state.selectedYear?.value - 1)}
                                </p>
                              </Colxx>
                              <Colxx lg="9">
                                <Row className="d-flex justify-content-start mt-2">
                                  {this.state.goalsData.map((goal) => {
                                    return (
                                      <>
                                        <div className="position-relative mr-1">
                                          <div
                                            className={[
                                              "d-flex justify-content-center align-items-center text-white h6",
                                              this.state.scorePerNitiChartData[
                                                goal.name
                                              ]
                                                ? this.state
                                                    .scorePerNitiChartData[
                                                    goal.name
                                                  ].ed_val >= 50 &&
                                                  this.state
                                                    .scorePerNitiChartData[
                                                    goal.name
                                                  ].ed_val <= 64
                                                  ? "bg-warning"
                                                  : this.state
                                                      .scorePerNitiChartData[
                                                      goal.name
                                                    ].ed_val >= 65 &&
                                                    this.state
                                                      .scorePerNitiChartData[
                                                      goal.name
                                                    ].ed_val <= 99
                                                  ? "bg-success"
                                                  : this.state
                                                      .scorePerNitiChartData[
                                                      goal.name
                                                    ].ed_val === 100
                                                  ? "bg-info"
                                                  : "bg-danger"
                                                : "bg-danger",
                                            ].join(" ")}
                                            style={{
                                              width: "50px",
                                              height: "50px",
                                            }}
                                          >
                                            {this.state.scorePerNitiChartData[
                                              goal.name
                                            ]
                                              ? this.state
                                                  .scorePerNitiChartData[
                                                  goal.name
                                                ].st_val
                                              : 0}
                                          </div>
                                        </div>
                                      </>
                                    );
                                  })}
                                </Row>
                              </Colxx>
                            </Row>
                            <Row>
                              <Colxx lg="3"></Colxx>
                              <Colxx lg="9" className="d-flex">
                                <div className="d-flex justify-content-center align-items-center">
                                  <i
                                    className="fa fa-circle text-info"
                                    aria-hidden="true"
                                  ></i>
                                  <span className="ml-1">Achiever [100]</span>
                                </div>
                                <div className="d-flex justify-content-center align-items-center ml-2">
                                  <i
                                    className="fa fa-circle text-success"
                                    aria-hidden="true"
                                  ></i>
                                  <span className="ml-1">
                                    Front Runner [65 - 99]
                                  </span>
                                </div>
                                <div className="d-flex justify-content-center align-items-center ml-2">
                                  <i
                                    className="fa fa-circle text-warning"
                                    aria-hidden="true"
                                  ></i>
                                  <span className="ml-1">
                                    Performer [50 - 64]
                                  </span>
                                </div>
                                <div className="d-flex justify-content-center align-items-center ml-2">
                                  <i
                                    className="fa fa-circle text-danger"
                                    aria-hidden="true"
                                  ></i>
                                  <span className="ml-1">
                                    Aspirant [0 - 49]
                                  </span>
                                </div>
                                <div className="d-flex justify-content-center align-items-center ml-4">
                                  <span className="ml-1 font-weight-bold">
                                    Score Status
                                  </span>
                                </div>
                                <div className="d-flex justify-content-center align-items-center ml-2">
                                  <i
                                    className="fa fa-long-arrow-up"
                                    aria-hidden="true"
                                  ></i>
                                  <span className="ml-1">Improved</span>
                                </div>
                                <div className="d-flex justify-content-center align-items-center ml-2">
                                  <i
                                    className="fa fa-long-arrow-right"
                                    aria-hidden="true"
                                  ></i>
                                  <span className="ml-1">No change</span>
                                </div>
                                <div className="d-flex justify-content-center align-items-center ml-2">
                                  <i
                                    className="fa fa-long-arrow-down"
                                    aria-hidden="true"
                                  ></i>
                                  <span className="ml-1">Dropped</span>
                                </div>
                              </Colxx>
                            </Row>
                            <Row>
                              <Colxx
                                lg="12"
                                className="d-flex justify-content-center mt-3"
                              >
                                <span className="h4 font-weight-bold">
                                  State Scores as per NITI Aayog SDG India Index
                                </span>
                              </Colxx>
                            </Row>
                          </>
                        </>
                        {/* SIF Indicator scores for Nagaland for Goal */}
                        <>
                          {this.state.goalSIFIndicatorData ? (
                            <Row>
                              <Colxx lg="12" className="mb-4 mt-4">
                                <Card>
                                  <CardBody>
                                    <h2>
                                      <span className="ml-3 mt-3"></span>
                                    </h2>

                                    <Chart
                                      height={90}
                                      labels={this.state.goalsName}
                                      data={{
                                        labels: this.state.sifIndicators[
                                          this.state.filter
                                        ]?.map((lb) => {
                                          let lbb = [];
                                          if (lb.length > 40) {
                                            let x = 0;
                                            while (x < lb.length) {
                                              lbb.push(lb.slice(x, x + 40));

                                              x = x + 40;
                                            }

                                            return lbb;
                                          } else return lb;
                                        }),
                                        datasets: [
                                          {
                                            type: "bar",
                                            label: `State Indicator scores for Nagaland for Goal: ${this.state.filter}`,
                                            backgroundColor: "rgb(197, 25, 45)",
                                            data: this.state
                                              .goalSIFIndicatorData[
                                              this.state.filter
                                            ]?.data,
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
                          ) : (
                            <></>
                          )}
                        </>
                        {/* SIF wise Comparison */}
                        <>
                          {this.state.sifComparisonData ? (
                            <Row className="mt-3">
                              <Colxx lg="3">
                                <div className="form-group ">
                                  <Label htmlFor="policy">Graph Type</Label>
                                  <Select
                                    options={[
                                      {
                                        label: "State vs National",
                                        value: "svn",
                                      },
                                      {
                                        label: "State vs State",
                                        value: "svs",
                                      },
                                    ]}
                                    value={this.state.sifComparisonGraphType}
                                    onChange={(val) => {
                                      this.setState({
                                        sifComparisonGraphType: val,
                                        selSIFCompState1: null,
                                        selSIFCompState2: null,
                                      });
                                    }}
                                  />
                                </div>
                              </Colxx>
                              <Colxx lg="3">
                                <div className="form-group ">
                                  <Label htmlFor="policy">Select State</Label>
                                  <Select
                                    options={this.state.states
                                      ?.filter(
                                        (val) =>
                                          val.name !==
                                          this.state.selSIFCompState2?.label
                                      )
                                      .map((state) => {
                                        return {
                                          label: state.name,
                                          value: state.name,
                                        };
                                      })}
                                    value={this.state.selSIFCompState1}
                                    onChange={this.handleChangeSelSIFCompState1}
                                  />
                                </div>
                              </Colxx>
                              <Colxx lg="3">
                                {this.state.sifComparisonGraphType?.value[2] ===
                                "s" ? (
                                  <div className="form-group ">
                                    <Label htmlFor="policy">Select State</Label>
                                    <Select
                                      options={this.state.states
                                        ?.filter(
                                          (val) =>
                                            val.name !==
                                            this.state.selSIFCompState1?.label
                                        )
                                        .map((state) => {
                                          return {
                                            label: state.name,
                                            value: state.name,
                                          };
                                        })}
                                      value={this.state.selSIFCompState2}
                                      onChange={
                                        this.handleChangeSelSIFCompState2
                                      }
                                    />
                                  </div>
                                ) : (
                                  <></>
                                )}
                              </Colxx>

                              <Colxx lg="12" className="mb-4 mt-4">
                                <Card>
                                  <CardBody>
                                    <h2>
                                      <span className="ml-3 mt-3">
                                        State wise Comparison
                                      </span>
                                    </h2>
                                    <Chart
                                      key={
                                        String(
                                          this.state.selSIFCompState1?.value
                                        ) +
                                        String(
                                          this.state.selSIFCompState2?.value
                                        )
                                      }
                                      height={75}
                                      labels={this.state.goalsName}
                                      data={{
                                        labels: this.state.goalsName,
                                        datasets: [
                                          {
                                            type: "bar",
                                            label: `${this.state.selSIFCompState1?.label} Score`,
                                            backgroundColor: "rgb(162, 25, 66)",
                                            data: this.state.sifComparisonData[
                                              this.state.selSIFCompState1?.label
                                            ],
                                            borderColor: "white",
                                            borderWidth: 2,
                                          },
                                          {
                                            type: "bar",
                                            label: `${
                                              this.state.sifComparisonGraphType
                                                ?.value[2] === "n"
                                                ? "National"
                                                : this.state.selSIFCompState2
                                                    ?.label
                                            } Score`,
                                            backgroundColor: "rgb(76, 159, 56)",
                                            data:
                                              this.state.sifComparisonGraphType
                                                ?.value[2] === "n"
                                                ? this.state.nationalGoalScores
                                                : this.state.sifComparisonData[
                                                    this.state.selSIFCompState2
                                                      ?.label
                                                  ],

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
                          ) : (
                            <></>
                          )}
                        </>
                        {/* Historical Graph for [Goal Name] for Nagaland as per SIF */}
                        {/* <>
                          {this.state.historySIFData ? (
                            <Row className="mt-3">
                              <Colxx lg="3">
                                <div className="form-group ">
                                  <Label htmlFor="policy">Graph Type</Label>
                                  <Select
                                    options={[
                                      {
                                        label: "Goal Wise",
                                        value: "goal",
                                      },
                                      {
                                        label: "Indicator Wise",
                                        value: "indicator",
                                      },
                                    ]}
                                    value={this.state.historySIFType}
                                    onChange={(val) => {
                                      this.setState({
                                        historySIFType: val,
                                        historySIFIndicator: null,
                                        historySIFGoal: null,
                                      });
                                    }}
                                  />
                                </div>
                              </Colxx>
                              <Colxx lg="3">
                                <div className="form-group ">
                                  <Label htmlFor="policy">Select Goal</Label>
                                  <Select
                                    options={this.state.goalsName?.map(
                                      (state) => {
                                        return {
                                          label: state,
                                          value: state,
                                        };
                                      }
                                    )}
                                    value={this.state.historySIFGoal}
                                    onChange={(val) => {
                                      this.setState({
                                        historySIFGoal: val,
                                        historySIFIndicator: null,
                                      });
                                    }}
                                  />
                                </div>
                              </Colxx>
                              <Colxx lg="3">
                                {this.state.historySIFType?.value ===
                                "indicator" ? (
                                  <div className="form-group ">
                                    <Label htmlFor="policy">
                                      Select Indicator
                                    </Label>
                                    <Select
                                      options={this.state.goalSIFIndicatorData[
                                        this.state.historySIFGoal?.value
                                      ]?.label?.map((state) => {
                                        return {
                                          label: state,
                                          value: state,
                                        };
                                      })}
                                      value={this.state.historySIFIndicator}
                                      onChange={(val) => {
                                        this.setState({
                                          historySIFIndicator: val,
                                        });
                                      }}
                                    />
                                  </div>
                                ) : (
                                  <></>
                                )}
                              </Colxx>
                              <Colxx lg="12" className="mb-4 mt-4">
                                <Card>
                                  <CardBody>
                                    <h2>
                                      <span className="ml-3 mt-3">
                                        Historical Graph for{" "}
                                        {this.state.historySIFType?.value ===
                                        "goal"
                                          ? this.state.historySIFGoal?.value
                                          : this.state.historySIFIndicator
                                              ?.value}{" "}
                                        for Nagaland as per State
                                      </span>
                                    </h2>
                                    <Chart
                                      key={
                                        String(
                                          this.state.historySIFGoal?.value
                                        ) +
                                        String(
                                          this.state.historySIFIndicator?.value
                                        )
                                      }
                                      height={75}
                                      data={{
                                        labels: this.state.historySIFData[
                                          this.state.historySIFGoal?.label
                                        ]
                                          ? this.state.historySIFType?.value ===
                                            "goal"
                                            ? this.state.historySIFData[
                                                this.state.historySIFGoal?.label
                                              ]["goal"]?.labels
                                            : this.state.historySIFData[
                                                this.state.historySIFGoal?.label
                                              ]
                                            ? this.state.historySIFData[
                                                this.state.historySIFGoal?.label
                                              ]["indicator"]
                                              ? this.state.historySIFData[
                                                  this.state.historySIFGoal
                                                    ?.label
                                                ]["indicator"][
                                                  this.state.historySIFIndicator
                                                    ?.label
                                                ]
                                                ? this.state.historySIFData[
                                                    this.state.historySIFGoal
                                                      ?.label
                                                  ]["indicator"][
                                                    this.state
                                                      .historySIFIndicator
                                                      ?.label
                                                  ]?.labels
                                                : []
                                              : []
                                            : []
                                          : [],
                                        datasets: [
                                          {
                                            type: "line",
                                            label: `${
                                              this.state.historySIFType
                                                ?.value === "goal"
                                                ? this.state.historySIFGoal
                                                    ?.label
                                                : this.state.historySIFIndicator
                                                    ?.label
                                            } Score`,
                                            // backgroundColor: "rgb(162, 25, 66)",
                                            data: this.state.historySIFData[
                                              this.state.historySIFGoal?.label
                                            ]
                                              ? this.state.historySIFType
                                                  ?.value === "goal"
                                                ? this.state.historySIFData[
                                                    this.state.historySIFGoal
                                                      ?.label
                                                  ]["goal"]?.data
                                                : this.state.historySIFData[
                                                    this.state.historySIFGoal
                                                      ?.label
                                                  ]
                                                ? this.state.historySIFData[
                                                    this.state.historySIFGoal
                                                      ?.label
                                                  ]["indicator"]
                                                  ? this.state.historySIFData[
                                                      this.state.historySIFGoal
                                                        ?.label
                                                    ]["indicator"][
                                                      this.state
                                                        .historySIFIndicator
                                                        ?.label
                                                    ]
                                                    ? this.state.historySIFData[
                                                        this.state
                                                          .historySIFGoal?.label
                                                      ]["indicator"][
                                                        this.state
                                                          .historySIFIndicator
                                                          ?.label
                                                      ]?.data
                                                    : []
                                                  : []
                                                : []
                                              : [],
                                            fill: false,
                                            borderColor: "rgb(75, 192, 192)",
                                            tension: 0.1,
                                          },
                                        ],
                                      }}
                                    />
                                  </CardBody>
                                </Card>
                              </Colxx>
                            </Row>
                          ) : (
                            <></>
                          )}
                        </> */}
                      </>
                    ) : (
                      <>
                        {" "}
                        {/* Nagaland Map and DIF Scores as per NER Index */}
                        <>
                          {this.state.difNERScores ? (
                            <Row>
                              <Colxx lg="12">
                                <Card className="bg-white pb-4">
                                  <Row className="mt-3">
                                    <Colxx
                                      lg="6"
                                      className="d-flex justify-content-center"
                                    >
                                      <p className="h4 font-weight-bold">
                                        Nagaland
                                      </p>
                                    </Colxx>
                                    <Colxx
                                      lg="6"
                                      className="d-flex justify-content-center"
                                    >
                                      <p className="h5 font-weight-bold">
                                        {this.state.selectedMapDistrict?.value
                                          ? this.state.selectedMapDistrict
                                              ?.value
                                          : "Kohima"} District Scores as per NER Index
                                      </p>
                                    </Colxx>
                                  </Row>
                                  <Row>
                                    <Colxx lg="6">
                                      <Map
                                        filter={this.state.filter}
                                        difNERScores={this.state.difNERScores}
                                        data={features.filter(
                                          (val) =>
                                            val.properties.statename ===
                                            "Nagaland"
                                        )}
                                        setDistrict={(val) => {
                                          // this.handleChangeDistrict(val);

                                          this.setState({
                                            selectedMapDistrict: val,
                                          });
                                        }}
                                      />
                                    </Colxx>
                                    <Colxx lg="6" className="pt-4">
                                      <DashTable
                                        key={
                                          this.state.selectedYear?.label +
                                          this.state.filter
                                        }
                                        filter={this.state.filter}
                                        goals={this.state.goalsName}
                                        // dataSet={features.filter(
                                        //   (val) =>
                                        //     val.properties.statename ===
                                        //     "Nagaland"
                                        // )}
                                        selectedMapDistrict={
                                          this.state.selectedMapDistrict?.value
                                            ? this.state.selectedMapDistrict
                                                ?.value
                                            : "Kohima"
                                        }
                                        difNERScores={this.state.difNERScores}
                                      />
                                    </Colxx>
                                  </Row>
                                </Card>
                              </Colxx>
                            </Row>
                          ) : (
                            <></>
                          )}
                        </>
                        {/* DIF wise Comparison */}
                        <>
                          {this.state.difComparisonData &&
                          this.state.sifComparisonData ? (
                            <Row className="mt-3">
                              <Colxx lg="3">
                                <div className="form-group ">
                                  <Label htmlFor="policy">Graph Type</Label>
                                  <Select
                                    options={[
                                      {
                                        label: "Nagaland vs District",
                                        value: "nvd",
                                      },
                                      {
                                        label: "District vs District",
                                        value: "dvd",
                                      },
                                    ]}
                                    value={this.state.difComparisonGraphType}
                                    onChange={(val) => {
                                      this.setState({
                                        difComparisonGraphType: val,
                                        selDIFCompDist1: null,
                                        selDIFCompDist2: null,
                                      });
                                    }}
                                  />
                                </div>
                              </Colxx>
                              <Colxx lg="3">
                                <div className="form-group ">
                                  <Label htmlFor="policy">
                                    Select District
                                  </Label>
                                  <Select
                                    options={this.state.districts
                                      ?.filter(
                                        (val) =>
                                          val.name !==
                                          this.state.selDIFCompDist2?.label
                                      )
                                      .map((state) => {
                                        return {
                                          label: state.name,
                                          value: state.name,
                                        };
                                      })}
                                    value={this.state.selDIFCompDist1}
                                    onChange={this.handleChangeSelDIFCompDist1}
                                  />
                                </div>
                              </Colxx>
                              <Colxx lg="3">
                                {this.state.difComparisonGraphType?.value[0] ===
                                "d" ? (
                                  <div className="form-group ">
                                    <Label htmlFor="policy">
                                      Select District
                                    </Label>
                                    <Select
                                      options={this.state.districts
                                        ?.filter(
                                          (val) =>
                                            val.name !==
                                            this.state.selDIFCompDist1?.label
                                        )
                                        .map((state) => {
                                          return {
                                            label: state.name,
                                            value: state.name,
                                          };
                                        })}
                                      value={this.state.selDIFCompDist2}
                                      onChange={
                                        this.handleChangeSelDIFCompDist2
                                      }
                                    />
                                  </div>
                                ) : (
                                  <></>
                                )}
                              </Colxx>

                              <Colxx lg="12" className="mb-4 mt-4">
                                <Card>
                                  <CardBody>
                                    <h2>
                                      <span className="ml-3 mt-3">
                                        District wise Comparison
                                      </span>
                                    </h2>
                                    <Chart
                                      key={
                                        String(
                                          this.state.selDIFCompDist1?.value
                                        ) +
                                        String(
                                          this.state.selDIFCompDist2?.value
                                        )
                                      }
                                      height={75}
                                      labels={this.state.goalsName}
                                      data={{
                                        labels: this.state.goalsName,
                                        datasets: [
                                          {
                                            type: "bar",
                                            label: `${this.state.selDIFCompDist1?.label} Score`,
                                            backgroundColor: "rgb(162, 25, 66)",
                                            data: this.state.difComparisonData[
                                              this.state.selDIFCompDist1?.label
                                            ],
                                            borderColor: "white",
                                            borderWidth: 2,
                                          },
                                          {
                                            type: "bar",
                                            label: `${
                                              this.state.difComparisonGraphType
                                                ?.value[0] === "n"
                                                ? "Nagaland"
                                                : this.state.selDIFCompDist2
                                                    ?.label
                                            } Score`,
                                            backgroundColor: "rgb(76, 159, 56)",
                                            data:
                                              this.state.difComparisonGraphType
                                                ?.value[0] === "n"
                                                ? this.state.sifComparisonData[
                                                    "Nagaland"
                                                  ]
                                                : this.state.difComparisonData[
                                                    this.state.selDIFCompDist2
                                                      ?.label
                                                  ],
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
                          ) : (
                            <></>
                          )}
                        </>
                        {/* DIF Indicator scores for [District Name] for Goal */}
                        <>
                          {this.state.distIndicatorGraphData ? (
                            <>
                              <Row className="mt-3">
                                <Colxx lg="3">
                                  <div className="form-group ">
                                    <Label htmlFor="policy">
                                      Select District
                                    </Label>
                                    <Select
                                      options={this.state.districts.map(
                                        (state) => {
                                          return {
                                            label: state.name,
                                            value: state.name,
                                          };
                                        }
                                      )}
                                      value={this.state.selDIFIndicatorDist}
                                      onChange={(val) => {
                                        this.setState({
                                          selDIFIndicatorDist: val,
                                        });
                                      }}
                                    />
                                  </div>
                                </Colxx>
                              </Row>
                              <Row>
                                <Colxx lg="12" className="mb-4 mt-2">
                                  <Card>
                                    <CardBody>
                                      <h2>
                                        <span className="ml-3 mt-3">
                                          District Indicator scores for{" "}
                                          {
                                            this.state.selDIFIndicatorDist
                                              ?.value
                                          }{" "}
                                          for Goal: {this.state.filter}
                                        </span>
                                      </h2>
                                      <Chart
                                        key={
                                          this.state.selDIFIndicatorDist?.value
                                        }
                                        height={75}
                                        labels={this.state.goalsName}
                                        data={{
                                          labels:
                                            this.state.difIndicators[
                                              this.state.filter
                                            ],
                                          datasets: [
                                            {
                                              type: "bar",
                                              label: `${this.state.selDIFIndicatorDist?.label} Score`,
                                              backgroundColor:
                                                "rgb(197, 25, 45)",
                                              data: this.state
                                                .distIndicatorGraphData[
                                                this.state.filter
                                              ][
                                                this.state.selDIFIndicatorDist
                                                  ?.label
                                              ]
                                                ? this.state
                                                    .distIndicatorGraphData[
                                                    this.state.filter
                                                  ][
                                                    this.state
                                                      .selDIFIndicatorDist
                                                      ?.label
                                                  ]
                                                : this.state.difIndicators[
                                                    this.state.filter
                                                  ]?.map((it) => {
                                                    return 0;
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
                          )}
                        </>
                        {/* Historical Graph for [Goal Name] as per DIF */}
                        {/* <>
                          {this.state.historyDIFData ? (
                            <Row className="mt-3">
                              <Colxx lg="3">
                                <div className="form-group ">
                                  <Label htmlFor="policy">Graph Type</Label>
                                  <Select
                                    options={[
                                      {
                                        label: "Goal Wise",
                                        value: "goal",
                                      },
                                      {
                                        label: "Indicator Wise",
                                        value: "indicator",
                                      },
                                    ]}
                                    value={this.state.historyDIFType}
                                    onChange={(val) => {
                                      this.setState({
                                        historyDIFType: val,
                                        historyDIFIndicator: null,
                                        historyDIFGoal: null,
                                        historyDIFDist: null,
                                      });
                                    }}
                                  />
                                </div>
                              </Colxx>
                              <Colxx lg="3">
                                <div className="form-group ">
                                  <Label htmlFor="policy">
                                    Select District
                                  </Label>
                                  <Select
                                    options={this.state.districts.map(
                                      (state) => {
                                        return {
                                          label: state.name,
                                          value: state.name,
                                        };
                                      }
                                    )}
                                    value={this.state.historyDIFDist}
                                    onChange={(val) => {
                                      this.setState({
                                        historyDIFDist: val,
                                        historyDIFGoal: null,
                                        historyDIFIndicator: null,
                                      });
                                    }}
                                  />
                                </div>
                              </Colxx>
                              <Colxx lg="3">
                                <div className="form-group ">
                                  <Label htmlFor="policy">Select Goal</Label>
                                  <Select
                                    options={this.state.goalsName?.map(
                                      (state) => {
                                        return {
                                          label: state,
                                          value: state,
                                        };
                                      }
                                    )}
                                    value={this.state.historyDIFGoal}
                                    onChange={(val) => {
                                      this.setState({
                                        historyDIFGoal: val,
                                        historyDIFIndicator: null,
                                      });
                                    }}
                                  />
                                </div>
                              </Colxx>
                              <Colxx lg="3">
                                {this.state.historyDIFType?.value ===
                                "indicator" ? (
                                  <div className="form-group ">
                                    <Label htmlFor="policy">
                                      Select Indicator
                                    </Label>
                                    <Select
                                      options={this.state.difIndicators[
                                        this.state.historyDIFGoal?.value
                                      ]?.map((state) => {
                                        return {
                                          label: state,
                                          value: state,
                                        };
                                      })}
                                      value={this.state.historyDIFIndicator}
                                      onChange={(val) => {
                                        this.setState({
                                          historyDIFIndicator: val,
                                        });
                                      }}
                                    />
                                  </div>
                                ) : (
                                  <></>
                                )}
                              </Colxx>
                              <Colxx lg="12" className="mb-4 mt-4">
                                <Card>
                                  <CardBody>
                                    <h2>
                                      <span className="ml-3 mt-3">
                                        Historical Graph for{" "}
                                        {this.state.historyDIFType?.value ===
                                        "goal"
                                          ? this.state.historyDIFGoal?.value
                                          : this.state.historyDIFIndicator
                                              ?.value}{" "}
                                        for Nagaland as per District
                                      </span>
                                    </h2>
                                    <Chart
                                      key={
                                        String(
                                          this.state.historyDIFGoal?.value
                                        ) +
                                        String(
                                          this.state.historyDIFDist?.value
                                        ) +
                                        String(
                                          this.state.historyDIFIndicator?.value
                                        )
                                      }
                                      height={75}
                                      labels={this.state.goalsName}
                                      data={{
                                        labels: this.state.historyDIFData[
                                          this.state.historyDIFDist?.label
                                        ]
                                          ? this.state.historyDIFData[
                                              this.state.historyDIFDist?.label
                                            ][this.state.historyDIFGoal?.label]
                                            ? this.state.historyDIFType
                                                ?.value === "goal"
                                              ? this.state.historyDIFData[
                                                  this.state.historyDIFDist
                                                    ?.label
                                                ][
                                                  this.state.historyDIFGoal
                                                    ?.label
                                                ]["goal"]?.labels
                                              : this.state.historyDIFData[
                                                  this.state.historyDIFDist
                                                    ?.label
                                                ][
                                                  this.state.historyDIFGoal
                                                    ?.label
                                                ]
                                              ? this.state.historyDIFData[
                                                  this.state.historyDIFDist
                                                    ?.label
                                                ][
                                                  this.state.historyDIFGoal
                                                    ?.label
                                                ]["indicator"]
                                                ? this.state.historyDIFData[
                                                    this.state.historyDIFDist
                                                      ?.label
                                                  ][
                                                    this.state.historyDIFGoal
                                                      ?.label
                                                  ]["indicator"][
                                                    this.state
                                                      .historyDIFIndicator
                                                      ?.label
                                                  ]
                                                  ? this.state.historyDIFData[
                                                      this.state.historyDIFDist
                                                        ?.label
                                                    ][
                                                      this.state.historyDIFGoal
                                                        ?.label
                                                    ]["indicator"][
                                                      this.state
                                                        .historyDIFIndicator
                                                        ?.label
                                                    ]?.labels
                                                  : []
                                                : []
                                              : []
                                            : []
                                          : [],
                                        datasets: [
                                          {
                                            type: "line",
                                            label: `${
                                              this.state.historyDIFType
                                                ?.value === "goal"
                                                ? this.state.historyDIFGoal
                                                    ?.label
                                                : this.state.historyDIFIndicator
                                                    ?.label
                                            } Score`,
                                            // backgroundColor: "rgb(162, 25, 66)",
                                            data: this.state.historyDIFData[
                                              this.state.historyDIFDist?.label
                                            ]
                                              ? this.state.historyDIFData[
                                                  this.state.historyDIFDist
                                                    ?.label
                                                ][
                                                  this.state.historyDIFGoal
                                                    ?.label
                                                ]
                                                ? this.state.historyDIFType
                                                    ?.value === "goal"
                                                  ? this.state.historyDIFData[
                                                      this.state.historyDIFDist
                                                        ?.label
                                                    ][
                                                      this.state.historyDIFGoal
                                                        ?.label
                                                    ]["goal"]?.data
                                                  : this.state.historyDIFData[
                                                      this.state.historyDIFDist
                                                        ?.label
                                                    ][
                                                      this.state.historyDIFGoal
                                                        ?.label
                                                    ]
                                                  ? this.state.historyDIFData[
                                                      this.state.historyDIFDist
                                                        ?.label
                                                    ][
                                                      this.state.historyDIFGoal
                                                        ?.label
                                                    ]["indicator"]
                                                    ? this.state.historyDIFData[
                                                        this.state
                                                          .historyDIFDist?.label
                                                      ][
                                                        this.state
                                                          .historyDIFGoal?.label
                                                      ]["indicator"][
                                                        this.state
                                                          .historyDIFIndicator
                                                          ?.label
                                                      ]
                                                      ? this.state
                                                          .historyDIFData[
                                                          this.state
                                                            .historyDIFDist
                                                            ?.label
                                                        ][
                                                          this.state
                                                            .historyDIFGoal
                                                            ?.label
                                                        ]["indicator"][
                                                          this.state
                                                            .historyDIFIndicator
                                                            ?.label
                                                        ]?.data
                                                      : []
                                                    : []
                                                  : []
                                                : []
                                              : [],
                                            fill: false,
                                            borderColor: "rgb(75, 192, 192)",
                                            tension: 0.1,
                                          },
                                        ],
                                      }}
                                    />
                                  </CardBody>
                                </Card>
                              </Colxx>
                            </Row>
                          ) : (
                            <></>
                          )}
                        </> */}
                      </>
                    )}
                  </Colxx>
                  <Colxx lg="1" className="back_img"></Colxx>
                </Row>
              </>
            ) : (
              <TableView
                dataSet={this.state.reports.filter(
                  (data) => data.goal === this.state.filter
                )}
                filter={this.state.filter}
              />
            )}
          </>
        ) : (
          <>
            <div className="loading"></div>
          </>
        )}
      </div>
    );
  }
}

export default MainDashBoard;
