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
import _, { floor } from "lodash";
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

class NERSDGDash extends Component {
  constructor(props) {
    super(props);
    this.state = {
      states: [],
      difIndicators: {},
      sifIndicators: {},
      sifIndicatorComment: {},
      difIndicatorComment: {},
      sifScoreData: [],
      nationalScoresData: [],
      loading: true,
      sifComparisonGraphType: {
        label: "State vs State",
        value: "svs",
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
        label: "District vs District",
        value: "dvd",
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
        label: "2021-22",
        value: 2021,
      },
      districtRanks: {},
      nationalGoalScores: [],
    };
  }

  componentDidMount() {
    this.getGoals();
    this.getStates();
    this.getDistricts();
    this.getDistrictRanks();
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
        let data = response.data.filter(
          (ind) => String(ind.year) === String(this.state.selectedYear?.value)
        );
        let sifIndicators = {};
        let difIndicators = {};
        let sifIndicatorComment = {};
        let difIndicatorComment = {};
        data
          .filter((id) => id.type === "SIF")
          .forEach((id) => {
            if (sifIndicators[id.goal]) {
              sifIndicators[id.goal].push(id.name);
            } else {
              sifIndicators[id.goal] = [id.name];
            }
            sifIndicatorComment[id.name] = id.comment;
          });
        data
          .filter((id) => id.type === "DIF")
          .forEach((id) => {
            if (difIndicators[id.goal]) {
              difIndicators[id.goal].push(id.name);
            } else {
              difIndicators[id.goal] = [id.name];
            }
            difIndicatorComment[id.name] = id.comment;
          });
        this.setState(
          {
            indicators: data,
            sifIndicators: sifIndicators,
            difIndicators: difIndicators,
            sifIndicatorComment,
            difIndicatorComment,
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

  getDistrictRanks = () => {
    API.get("/api/public/rank/")
      .then((response) => {
        let data = response.data;
        let rank_years = _.groupBy(data, "year");
        let districtRanks = {};

        Object.keys(rank_years).forEach((year) => {
          districtRanks[year] = {};

          let district_data = _.groupBy(rank_years[year], "district");

          Object.keys(district_data).forEach((dist) => {
            districtRanks[year][dist] = district_data[dist][0]?.rank
              ? district_data[dist][0]?.rank
              : 0;
          });
        });
        this.setState({ districtRanks: districtRanks });
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

  // clickHandler = async (id) => {
  //   let chartCanvas = null;

  //   await html2canvas(document.querySelector(`#${id}`)).then((canvas) => {
  //     chartCanvas = canvas;
  //   });

  //   if (chartCanvas) {
  //     const url = chartCanvas.toDataURL("image/png");
  //     // const url = chartCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
  //     const link = document.createElement("a");
  //     link.download = "chart.png";
  //     link.href = url;
  //     link.click();
  //   }
  // };

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
            return data;
          });

        let goal_dif_target = _.groupBy(targetsDIF, "goal");

        let historyTargetsDIF = {};

        Object.keys(goal_dif_target).forEach((goal) => {
          if (!historyTargetsDIF[goal]) {
            historyTargetsDIF[goal] = {};
          }
          let dif_indicator_history = _.groupBy(goal_dif_target[goal], "name");

          this.state.difIndicators[goal] &&
            this.state.difIndicators[goal].forEach((ind) => {
              if (dif_indicator_history[ind]) {
                historyTargetsDIF[goal][ind] = {};
                let dif_years_indicator = _.groupBy(
                  dif_indicator_history[ind],
                  "year"
                );
                Object.keys(dif_years_indicator).forEach((year) => {
                  historyTargetsDIF[goal][ind][year] = dif_years_indicator[
                    year
                  ][0]?.value
                    ? dif_years_indicator[year][0]?.value
                    : 0;
                });
                // historyTargetsDIF[goal][ind] = {
                //   labels: Object.keys(dif_years_indicator),
                //   data: Object.keys(dif_years_indicator).map((year) => {
                //     return dif_years_indicator[year][0]?.value
                //       ? dif_years_indicator[year][0]?.value
                //       : 0;
                //   }),
                // };
              }
            });
        });

        let targetsSIF = response.data
          .filter((data) => data.type === "SIF")
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
            return data;
          });

        let goal_sif_target = _.groupBy(targetsSIF, "goal");

        let historyTargetsSIF = {};

        Object.keys(goal_sif_target).forEach((goal) => {
          if (!historyTargetsSIF[goal]) {
            historyTargetsSIF[goal] = {};
          }
          let indicator_history = _.groupBy(goal_sif_target[goal], "name");

          this.state.sifIndicators[goal] &&
            this.state.sifIndicators[goal].forEach((ind) => {
              if (indicator_history[ind]) {
                historyTargetsSIF[goal][ind] = {};
                let years_indicator = _.groupBy(indicator_history[ind], "year");
                Object.keys(years_indicator).forEach((year) => {
                  historyTargetsSIF[goal][ind][year] = years_indicator[year][0]
                    ?.value
                    ? years_indicator[year][0]?.value
                    : 0;
                });
                // historyTargetsSIF[goal][ind] = {
                //   labels: Object.keys(years_indicator),
                //   data: Object.keys(years_indicator).map((year) => {
                //     return years_indicator[year][0]?.value
                //       ? years_indicator[year][0]?.value
                //       : 0;
                //   }),
                // };
              }
            });
        });

        this.setState({
          reports: targetsDIF,
          historyTargetsSIF: historyTargetsSIF,
          historyTargetsDIF: historyTargetsDIF,
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

        let sifyears = _.unionBy(ngsifscore.map((dd) => dd.year));
        sifyears = _.sortBy(sifyears);
        let nggoalsifscore = _.groupBy(
          ngsifscore.filter((sc) => !sc.indicator),
          "goal"
        );
        let historySIFData = {};
        let nationalHistoryData = {};
        let national_data = this.state.nationalScoresData;
        let national_goal_data = _.groupBy(national_data, "goal");

        Object.keys(nggoalsifscore).forEach((key) => {
          let years = _.groupBy(nggoalsifscore[key], "year");

          if (!national_goal_data[key]) national_goal_data[key] = [];
          let national_years = _.groupBy(national_goal_data[key], "year");

          nationalHistoryData[key] = {
            labels: Object.keys(years),
            data: Object.keys(years).map((year) => {
              return national_years[year]
                ? national_years[year][0]?.value
                  ? national_years[year][0]?.value
                  : 0
                : 0;
            }),
          };

          scorePerNitiChartData[key] = {
            ed_val: years[String(this.state.selectedYear?.value)]
              ? years[String(this.state.selectedYear?.value)][0]?.value
                ? years[String(this.state.selectedYear?.value)][0]?.value
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

            colors: Object.keys(years).map((year) => {
              let obj = years[year][0]?.value ? years[year][0]?.value : 0;

              switch (true) {
                case obj < 49:
                  return "#DC3545";
                case obj < 64:
                  return "#FFC107";
                case obj < 99:
                  return "#009F84";
                case obj >= 100:
                  return "#00AEEE";
              }

              return "#DC3545";
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
          (sc) =>
            sc.indicator &&
            String(sc.year) === String(this.state.selectedYear?.value)
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
            backgroundColor: this.state.sifIndicators[key]?.map((it) => {
              if (ngindicatorsifscore[key]) {
                const obj = ngindicatorsifscore[key][it];
                switch (true) {
                  case obj < 49:
                    return "#DC3545";
                  case obj < 64:
                    return "#FFC107";
                  case obj < 99:
                    return "#009F84";
                  case obj >= 100:
                    return "#00AEEE";
                }
              }

              return "#DC3545";
            }),
          };
        });

        // Calculation states scores for SIF Comparison Chart

        let statescores = data.filter(
          (sc) =>
            !sc.indicator &&
            String(sc.year) === String(this.state.selectedYear?.value)
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
            nationalHistoryData,
            sifyears,
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
          return years[String(this.state.selectedYear?.value)]
            ? years[String(this.state.selectedYear?.value)][0]?.value
              ? years[String(this.state.selectedYear?.value)][0]?.value
              : 0
            : 0;
        });

        this.setState(
          { nationalGoalScores: nationalGoalScores, nationalScoresData: data },
          () => {
            this.getIndicators(this.state.goalsName);
          }
        );
      })
      .catch((error) => {});
  };

  viewDIFScore = () => {
    API.get("/api/public/score/?type=DIF")
      .then((res) => {
        let data = res.data;

        // Calculating History DIF data
        let historyDIFData = {};
        let difyears = _.unionBy(data.map((dd) => dd.year));
        difyears = _.sortBy(difyears);
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
          (sc) =>
            sc.indicator &&
            String(sc.year) === String(this.state.selectedYear?.value)
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

            distIndicatorGraphData[key][dist] = {
              data: this.state.difIndicators[key]?.map((it) => {
                if (indscores[it]) {
                  return indscores[it][0]?.value ? indscores[it][0]?.value : 0;
                }
                return 0;
              }),
              backgroundColor: this.state.difIndicators[key]?.map((it) => {
                if (indscores[it]) {
                  const obj = indscores[it][0]?.value
                    ? indscores[it][0]?.value
                    : 0;
                  switch (true) {
                    case obj < 49:
                      return "#DC3545";
                    case obj < 64:
                      return "#FFC107";
                    case obj < 99:
                      return "#009F84";
                    case obj >= 100:
                      return "#00AEEE";
                  }
                }

                return "#DC3545";
              }),
            };
          });
        });

        // Calculation district scores for DIF Comparison Chart

        let districtscores = data.filter(
          (sc) =>
            !sc.indicator &&
            String(sc.year) === String(this.state.selectedYear?.value)
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
          difyears,
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
                    this.getIndicators(this.state.goalsName);
                  }
                );
              }}
              goalsData={this.state.goalsData}
              isDash={true}
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
              yearsOption={this.state.difyears}
              handleYear={(val) => {
                this.setState({ selectedYear: val }, () => {
                  // this.viewSIFScore();
                  this.getIndicators(this.state.goalsName);
                });
              }}
              isSDGNER={true}
            />
            <hr className="mt-0" />
            {this.state.viewFilter === "Dashboard" ? (
              <>
                <Row className="d-flex justify-content-center mt-4">
                  <Colxx lg="1" className="back_img"></Colxx>
                  <Colxx lg="10">
                    <>
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
                                      NER District SDG Index for Nagaland State
                                    </p>
                                  </Colxx>
                                  <Colxx
                                    lg="6"
                                    className="d-flex justify-content-center"
                                  >
                                    <p className="h5 font-weight-bold text-center">
                                      {this.state.selectedMapDistrict?.value
                                        ? this.state.selectedMapDistrict?.value
                                        : "Kohima"}{" "}
                                      District Scores for{" "}
                                      {this.state.selectedYear?.label}
                                    </p>
                                  </Colxx>
                                </Row>
                                <Row>
                                  <Colxx lg="6">
                                    <Map
                                      filter={this.state.filter}
                                      difNERScores={this.state.difNERScores}
                                      districtRanks={this.state.districtRanks}
                                      selectedYear={
                                        this.state.selectedYear?.value
                                      }
                                      data={features}
                                      setDistrict={(val) => {
                                        // this.handleChangeDistrict(val);

                                        this.setState({
                                          selectedMapDistrict: val,
                                        });
                                      }}
                                    />
                                    <Row className="d-flex justify-content-center">
                                      <Colxx lg="10">
                                        <Row>
                                          <p className="d-flex align-items-center font-italic">
                                            <span
                                              className="d-block bg-dark rounded mr-1"
                                              style={{
                                                width: "8px",
                                                height: "8px",
                                              }}
                                            ></span>{" "}
                                            <i>
                                              Dimapur score is inclusive of
                                              Chumukedima & Niuland for the year
                                              2021-22 and 2022-23
                                            </i>
                                          </p>
                                          <p className="d-flex align-items-center font-italic">
                                            <span
                                              className="d-block bg-dark rounded mr-1"
                                              style={{
                                                width: "8px",
                                                height: "8px",
                                              }}
                                            ></span>
                                            <i>
                                              Kohima score is inclusive of
                                              Tseminyu for the year 2021-22 and
                                              2022-23
                                            </i>
                                          </p>
                                          <p className="d-flex align-items-center font-italic">
                                            <span
                                              className="d-block bg-dark rounded mr-1"
                                              style={{
                                                width: "8px",
                                                height: "8px",
                                              }}
                                            ></span>
                                            <i>
                                              Tuensang score is inclusive of
                                              Shamator & Noklak for the year
                                              2021-22
                                            </i>
                                          </p>
                                          <p className="d-flex align-items-center font-italic">
                                            <span
                                              className="d-block bg-dark rounded mr-1"
                                              style={{
                                                width: "8px",
                                                height: "8px",
                                              }}
                                            ></span>
                                            <i>
                                              Tuensang score is inclusive of
                                              Shamator for the year 2022-23
                                            </i>
                                          </p>
                                        </Row>
                                      </Colxx>
                                    </Row>
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
                                    // {
                                    //   label: "Nagaland vs District",
                                    //   value: "nvd",
                                    // },
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
                                <Label htmlFor="policy">Select District</Label>
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
                                    onChange={this.handleChangeSelDIFCompDist2}
                                  />
                                </div>
                              ) : (
                                <></>
                              )}
                            </Colxx>

                            <Colxx lg="12" className="mb-4 mt-4">
                              <Card>
                                <CardBody className="h-100" id="dashchart6">
                                  <Row>
                                    <Colxx>
                                      <h2 className="text-center">
                                        <span className="ml-3 mt-3">
                                          District Comparison Chart
                                        </span>
                                      </h2>
                                    </Colxx>
                                    <Colxx lg="2">
                                      <button
                                        className="btn btn-white mr-0 float-right"
                                        onClick={() =>
                                          this.clickHandler("dashchart6")
                                        }
                                      >
                                        <i
                                          class="fa fa-download"
                                          aria-hidden="true"
                                        ></i>
                                      </button>
                                    </Colxx>
                                  </Row>

                                  <Chart
                                    ref={(reference) =>
                                      (this.chartRef = reference)
                                    }
                                    key={
                                      String(
                                        this.state.selDIFCompDist1?.value
                                      ) +
                                      String(this.state.selDIFCompDist2?.value)
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
                                    options={{
                                      plugins: {
                                        datalabels: {
                                          anchor: "end",
                                          align: "top",
                                          formatter: Math.round,
                                          font: {
                                            weight: "bold",
                                          },
                                        },
                                      },
                                    }}
                                    plugins={[
                                      {
                                        id: "legendMargin",
                                        beforeInit(chart, legend, options) {
                                          const fitvalue = chart.legend.fit;
                                          chart.legend.fit = function fit() {
                                            fitvalue.bind(chart.legend)();
                                            return (this.height += 20);
                                          };
                                        },
                                      },
                                    ]}
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
                                  <CardBody className="h-100" id="dashchart5">
                                    <div className="mt-0 mb-2">
                                      <h6
                                        style={{ color: "#009F84" }}
                                        className="mt-3 mb-0 font-weight-bold"
                                      >
                                        Click the Goal Icons above to see
                                        goal-specific data
                                      </h6>
                                    </div>
                                    <Row>
                                      <Colxx>
                                        <h2>
                                          <span className="ml-3 mt-3">
                                            District Indicator Scores for{" "}
                                            {this.state.selectedYear?.label} :{" "}
                                            {this.state.filter}
                                          </span>
                                        </h2>
                                      </Colxx>
                                    </Row>
                                    <Row className="d-flex justify-content-around text-center border-bottom pb-2 font-weight-bold h6 mt-2">
                                      <Colxx lg="4">Indicator</Colxx>
                                      <Colxx lg="4">Data</Colxx>
                                      <Colxx lg="4">Target</Colxx>
                                    </Row>
                                    {this.state.difIndicators[
                                      this.state.filter
                                    ]?.map((lb, index) => {
                                      return (
                                        <>
                                          <Row className="border-bottom my-1 p-1">
                                            <Colxx lg="4">
                                              {this.state.difIndicatorComment[
                                                lb
                                              ]
                                                ? this.state
                                                    .difIndicatorComment[lb]
                                                : lb}
                                            </Colxx>
                                            <Colxx
                                              lg="4"
                                              className="text-center"
                                            >
                                              {this.state
                                                .distIndicatorGraphData[
                                                this.state.filter
                                              ][
                                                this.state.selDIFIndicatorDist
                                                  ?.label
                                              ]?.data
                                                ? this.state
                                                    .distIndicatorGraphData[
                                                    this.state.filter
                                                  ][
                                                    this.state
                                                      .selDIFIndicatorDist
                                                      ?.label
                                                  ].data?.length > 0
                                                  ? this.state
                                                      .distIndicatorGraphData[
                                                      this.state.filter
                                                    ][
                                                      this.state
                                                        .selDIFIndicatorDist
                                                        ?.label
                                                    ].data[index]
                                                  : 0
                                                : 0}
                                            </Colxx>
                                            <Colxx
                                              lg="4"
                                              className="text-center"
                                            >
                                              {this.state.historyTargetsDIF[
                                                this.state.filter
                                              ]
                                                ? this.state.historyTargetsDIF[
                                                    this.state.filter
                                                  ][lb]
                                                  ? this.state
                                                      .historyTargetsDIF[
                                                      this.state.filter
                                                    ][lb][
                                                      this.state.selectedYear
                                                        ?.value
                                                    ]
                                                    ? this.state
                                                        .historyTargetsDIF[
                                                        this.state.filter
                                                      ][lb][
                                                        this.state.selectedYear
                                                          ?.value
                                                      ]
                                                    : 0
                                                  : 0
                                                : 0}
                                            </Colxx>
                                          </Row>
                                        </>
                                      );
                                    })}
                                    {/* <Row>
                                     <Colxx>
                                       <h2 className="text-center">
                                         <span className="ml-3 mt-3">
                                           {
                                             this.state.selDIFIndicatorDist
                                               ?.value
                                           }{" "}
                                           District Indicator scores for{" "}
                                           {this.state.selectedYear?.label} :{" "}
                                           {this.state.filter}
                                         </span>
                                       </h2>
                                     </Colxx>

                                     <Colxx lg="2">
                                       <button
                                         className="btn btn-white mr-0 float-right"
                                         onClick={() =>
                                           this.clickHandler("dashchart5")
                                         }
                                       >
                                         <i
                                           class="fa fa-download"
                                           aria-hidden="true"
                                         ></i>
                                       </button>
                                     </Colxx>
                                   </Row>
                                   <Chart
                                     ref={(reference) =>
                                       (this.chartRef = reference)
                                     }
                                     key={
                                       this.state.selDIFIndicatorDist?.value
                                     }
                                     height={75}
                                     labels={this.state.goalsName}
                                     data={{
                                       labels: this.state.difIndicators[
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
                                           label: `${this.state.selDIFIndicatorDist?.label} Score`,
                                           backgroundColor:
                                             this.state
                                               .distIndicatorGraphData[
                                               this.state.filter
                                             ][
                                               this.state.selDIFIndicatorDist
                                                 ?.label
                                             ]?.backgroundColor,
                                           data: this.state
                                             .distIndicatorGraphData[
                                             this.state.filter
                                           ][
                                             this.state.selDIFIndicatorDist
                                               ?.label
                                           ]?.data
                                             ? this.state
                                                 .distIndicatorGraphData[
                                                 this.state.filter
                                               ][
                                                 this.state
                                                   .selDIFIndicatorDist
                                                   ?.label
                                               ].data
                                             : this.state.difIndicators[
                                                 this.state.filter
                                               ]?.map((it) => {
                                                 return 0;
                                               }),
                                           borderColor: "white",
                                           barPercentage: 0.4,
                                           borderWidth: 2,
                                         },
                                       ],
                                     }}
                                     options={{
                                       plugins: {
                                         datalabels: {
                                           anchor: "end",
                                           align: "top",
                                           formatter: (val) => {
                                             return Number(val).toFixed(2);
                                           },
                                           font: {
                                             weight: "bold",
                                           },
                                         },
                                       },
                                     }}
                                     plugins={[
                                       {
                                         id: "legendMargin",
                                         beforeInit(chart, legend, options) {
                                           const fitvalue = chart.legend.fit;
                                           chart.legend.fit =
                                             function fit() {
                                               fitvalue.bind(chart.legend)();
                                               return (this.height += 20);
                                             };
                                         },
                                       },
                                     ]}
                                   />
                                   <Row className="mt-2 d-flex justify-content-center">
                                     <Colxx
                                       lg="10"
                                       className="d-flex justify-content-around"
                                     >
                                       <div className="d-flex justify-content-center align-items-center">
                                         <i
                                           className="fa fa-circle"
                                           style={{ color: "#00AEEE" }}
                                           aria-hidden="true"
                                         ></i>
                                         <span className="ml-1">
                                           Achiever [100]
                                         </span>
                                       </div>
                                       <div className="d-flex justify-content-center align-items-center ml-2">
                                         <i
                                           className="fa fa-circle"
                                           style={{ color: "#009F84" }}
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
                                     </Colxx>
                                   </Row> */}
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

export default NERSDGDash;
