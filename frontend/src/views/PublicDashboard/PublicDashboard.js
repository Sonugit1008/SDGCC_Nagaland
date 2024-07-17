import React, { Component } from "react";
import "leaflet/dist/leaflet.css";
import { features } from "../PublicDashboard/Data/data1.json";
import Header from "./Header/Header";
import SubHeader from "./Header/SubHeader";
import Map from "./Map/Map";
import Select from "react-select";
import TableView from "../PublicDashboard/Body/TableView";
import { Colxx } from "../../components/common/CustomBootstrap";
import { Card, Row, CardBody, Label } from "reactstrap";
import DashTable from "../PublicDashboard/Body/DashTable";
import "../PublicDashboard/DashBoard/Progress.css";
import API from "../../helpers/API";
import _ from "lodash";
import DashFooter from "./Header/Footer";
import { ProgressBar } from "react-bootstrap";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { Tooltip as Reacttooltip } from "reactstrap";
import { Modal } from "react-bootstrap";
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
import html2canvas from "html2canvas";
ChartJS.register(...registerablesJS);
ChartJS.register(ChartDataLabels);
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

class PublicDashBoard extends Component {
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
      subtab: "dashboard",
      filter: "SDG Index",
      selectedSifCatGoal: "SDG Index",
      selectedDifCatGoal: "SDG Index",
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
      siffrontrunnerData: [],
      sifachieverdata: [],
      siffrontgoals: [],
      sifachievergoals: [],
      selectedSifCategoryType: "Front Runner",
      selectedDifCategoryType: "Front Runner",
      diffrontrunnerData: [],
      difachieverdata: [],
      diffrontgoals: [],
      difachievergoals: [],
      tooltipOpen: "",
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
        let data = response.data;
        let sifIndicators = {};
        let difIndicators = {};
        let sifIndicatorComment = {};
        let difIndicatorComment = {};
        data
          .filter((id) => id.type === "SIF" && String(id.year) === String(2020))
          .forEach((id) => {
            if (sifIndicators[id.goal]) {
              sifIndicators[id.goal].push(id.name);
            } else {
              sifIndicators[id.goal] = [id.name];
            }
            sifIndicatorComment[id.name] = id.comment;
          });
        data
          .filter(
            (id) =>
              id.type === "DIF" &&
              String(id.year) === String(this.state.selectedYear?.value)
          )
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
  clickHandler = async (id) => {
    let chartCanvas = null;

    await html2canvas(document.querySelector(`#${id}`)).then((canvas) => {
      chartCanvas = canvas;
    });

    if (chartCanvas) {
      const url = chartCanvas.toDataURL("image/png");
      // const url = chartCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
      const link = document.createElement("a");
      link.download = "chart.png";
      link.href = url;
      link.click();
    }
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

        console.log(
          "ttttttttttttttttttttt",
          historyTargetsSIF["06 - Clean Water and Sanitation"]
        );
        this.setState(
          {
            reports: targetsDIF,
            historyTargetsSIF: historyTargetsSIF,
            historyTargetsDIF: historyTargetsDIF,
            loading: false,
          },
          () => {
            this.viewSIFScore();
          }
        );
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

        let ngindicatorssiff = ngsifscore.filter(
          (sc) => sc.indicator && String(sc.year) === String(2020)
        );

        let siffrontrunnerData = ngindicatorssiff.map((tt) => {
          tt.target_ = this.state.historyTargetsSIF[tt.goal]
            ? this.state.historyTargetsSIF[tt.goal][tt.indicator]
              ? this.state.historyTargetsSIF[tt.goal][tt.indicator][
                  String(2020)
                ]
              : 0
            : 0;

          return tt;
        });

        let siffrontgoals = _.unionBy(
          ngsifscore
            .filter(
              (gg) =>
                !gg.indicator &&
                gg.category === "Front Runner" &&
                Number(gg.year) === Number(2020)
            )
            .map((gg) => gg.goal)
        );

        let sifachieverdata = ngindicatorssiff.map((tt) => {
          tt.target_ = this.state.historyTargetsSIF[tt.goal]
            ? this.state.historyTargetsSIF[tt.goal][tt.indicator]
              ? this.state.historyTargetsSIF[tt.goal][tt.indicator][
                  String(2020)
                ]
              : 0
            : 0;

          return tt;
        });
        let sifachievergoals = _.unionBy(
          ngsifscore
            .filter(
              (gg) =>
                !gg.indicator &&
                gg.category === "Achiever" &&
                Number(gg.year) === Number(2020)
            )
            .map((gg) => gg.goal)
        );

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
          (sc) => !sc.indicator && String(sc.year) === String(2020)
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
            siffrontrunnerData,
            sifachieverdata,
            siffrontgoals,
            sifachievergoals,
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

        let ddddata = distindicatorsdif.filter(
          (rr) => Number(rr.year) === this.state.selectedYear?.value
        );

        let diffrontrunnerData = data.filter(
          (gg) =>
            !gg.indicator &&
            gg.category === "Front Runner" &&
            Number(gg.year) === Number(this.state.selectedYear?.value)
        );

        let diffrontgoals = _.unionBy(
          data
            .filter(
              (gg) =>
                !gg.indicator &&
                gg.category === "Front Runner" &&
                Number(gg.year) === Number(this.state.selectedYear?.value)
            )
            .map((gg) => gg.goal)
        );

        let difachieverdata = data.filter(
          (gg) =>
            !gg.indicator &&
            gg.category === "Achiever" &&
            Number(gg.year) === this.state.selectedYear?.value
        );

        let difachievergoals = _.unionBy(
          data
            .filter(
              (gg) =>
                !gg.indicator &&
                gg.category === "Achiever" &&
                Number(gg.year) === this.state.selectedYear?.value
            )
            .map((gg) => gg.goal)
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
          difachieverdata,
          difachievergoals,
          diffrontrunnerData,
          diffrontgoals,
          difyears,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  handleExcelDownload = (type, name) => {
    let apiData = [];
    switch (type) {
      case "dashchart1":
        // let dataObj = { "Year": "", "Nagaland Score":23, "National Score":36 };

        let labels = this.state.historySIFData[this.state.filter]
          ? this.state.historySIFData[this.state.filter]["goal"]?.labels
          : [];

        let nationalData = this.state.nationalHistoryData[this.state.filter]
          ?.data
          ? this.state.nationalHistoryData[this.state.filter]?.data
          : [];

        let nagalandData = this.state.historySIFData[this.state.filter]
          ? this.state.historySIFData[this.state.filter]["goal"]?.data
          : [];

        labels.forEach((lb, index) => {
          let obj = {
            Year: lb,
            "Nagaland Score": nagalandData[index],
          };

          if (this.state.filter === "SDG Index") {
            obj["National Score"] = nationalData[index];
          }
          apiData.push(obj);
        });

        break;

      case "dashchart4":
        let dc4labels = this.state.historySIFData[
          this.state.historySIFGoal?.label
        ]
          ? this.state.historySIFType?.value === "goal"
            ? this.state.historySIFData[this.state.historySIFGoal?.label][
                "goal"
              ]?.labels
            : this.state.historySIFData[this.state.historySIFGoal?.label]
            ? this.state.historySIFData[this.state.historySIFGoal?.label][
                "indicator"
              ]
              ? this.state.historySIFData[this.state.historySIFGoal?.label][
                  "indicator"
                ][this.state.historySIFIndicator?.label]
                ? this.state.historySIFData[this.state.historySIFGoal?.label][
                    "indicator"
                  ][this.state.historySIFIndicator?.label]?.labels
                : []
              : []
            : []
          : [];

        let dc4values = this.state.historySIFData[
          this.state.historySIFGoal?.label
        ]
          ? this.state.historySIFType?.value === "goal"
            ? this.state.historySIFData[this.state.historySIFGoal?.label][
                "goal"
              ]?.data
            : this.state.historySIFData[this.state.historySIFGoal?.label]
            ? this.state.historySIFData[this.state.historySIFGoal?.label][
                "indicator"
              ]
              ? this.state.historySIFData[this.state.historySIFGoal?.label][
                  "indicator"
                ][this.state.historySIFIndicator?.label]
                ? this.state.historySIFData[this.state.historySIFGoal?.label][
                    "indicator"
                  ][this.state.historySIFIndicator?.label]?.data
                : []
              : []
            : []
          : [];

        let dc4targets = this.state.historySIFData[
          this.state.historySIFGoal?.label
        ]
          ? this.state.historySIFType?.value === "goal"
            ? this.state.historySIFData[this.state.historySIFGoal?.label][
                "goal"
              ]?.labels
            : this.state.historySIFData[this.state.historySIFGoal?.label]
            ? this.state.historySIFData[this.state.historySIFGoal?.label][
                "indicator"
              ]
              ? this.state.historySIFData[this.state.historySIFGoal?.label][
                  "indicator"
                ][this.state.historySIFIndicator?.label]
                ? this.state.historySIFData[this.state.historySIFGoal?.label][
                    "indicator"
                  ][this.state.historySIFIndicator?.label]?.labels?.map(
                    (lb) => {
                      return this.state.historySIFType?.value === "indicator"
                        ? this.state.historyTargetsSIF[
                            this.state.historySIFGoal?.label
                          ]
                          ? this.state.historyTargetsSIF[
                              this.state.historySIFGoal?.label
                            ][this.state.historySIFIndicator?.label]
                            ? this.state.historyTargetsSIF[
                                this.state.historySIFGoal?.label
                              ][this.state.historySIFIndicator?.label][lb]
                              ? this.state.historyTargetsSIF[
                                  this.state.historySIFGoal?.label
                                ][this.state.historySIFIndicator?.label][lb]
                              : 0
                            : 0
                          : 0
                        : 0;
                    }
                  )
                : []
              : []
            : []
          : [];

        dc4labels.forEach((lb, index) => {
          let obj = {
            Year: lb,
            Score: dc4values[index],
          };

          if (this.state.historySIFType?.value === "indicator")
            obj["Target"] = dc4targets[index];

          apiData.push(obj);
        });

      case "dashchart3":
        this.state.goalsName.forEach((gg, index) => {
          let Obj = {
            "Goal Name": gg,
          };

          if (this.state.selSIFCompState1?.label) {
            Obj[`${this.state.selSIFCompState1?.label} Score`] =
              this.state.sifComparisonData[this.state.selSIFCompState1?.label][
                index
              ];
          }

          if (this.state.selSIFCompState2?.label) {
            let dd =
              this.state.sifComparisonGraphType?.value[2] === "n"
                ? this.state.nationalGoalScores
                : this.state.sifComparisonData[
                    this.state.selSIFCompState2?.label
                  ];
            Obj[
              `${
                this.state.sifComparisonGraphType?.value[2] === "n"
                  ? "National"
                  : this.state.selSIFCompState2?.label
              } Score`
            ] = dd[index];
          }

          apiData.push(Obj);
        });

      case "dashchart6":
        this.state.goalsName.forEach((gg, index) => {
          let Obj = {
            "Goal Name": gg,
          };

          if (this.state.selDIFCompDist1?.label) {
            Obj[`${this.state.selDIFCompDist1?.label} Score`] =
              this.state.difComparisonData[this.state.selDIFCompDist1?.label][
                index
              ];
          }

          if (this.state.selDIFCompDist2?.label) {
            let dd =
              this.state.difComparisonGraphType?.value[0] === "n"
                ? this.state.sifComparisonData["Nagaland"]
                : this.state.difComparisonData[
                    this.state.selDIFCompDist2?.label
                  ];
            Obj[
              `${
                this.state.difComparisonGraphType?.value[0] === "n"
                  ? "Nagaland"
                  : this.state.selDIFCompDist2?.label
              } Score`
            ] = dd[index];
          }

          apiData.push(Obj);
        });

      default:
        break;
    }

    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    const fileName = name;
    const ws = XLSX.utils.json_to_sheet(apiData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  handleTooltip = (type) => {
    // let current = { ...this.state.tooltipOpen };

    // current[type] = !current[type];

    this.setState({ tooltipOpen: type });
  };

  render() {
    return (
      <div className="h-100">
        {!this.state.loading ? (
          <>
            {/* <Header
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
              subtab={this.state.subtab}
            /> */}
            {/* <SubHeader
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
              yearsOption={
                this.state.subtab === "distscore" ||
                this.state.subtab === "distgraph"
                  ? this.state.difyears
                  : this.state.sifyears
              }
              handleYear={(val) => {
                this.setState({ selectedYear: val }, () => {
                  // this.viewSIFScore();
                  this.viewNationalScore();
                });
              }}
              subtab={this.state.subtab}
              setSubTab={(val) => {
                this.setState({ subtab: val, filter: "SDG Index" });

                if (val === "distscore") {
                  this.setState(
                    {
                      selectedYear: {
                        label: "2021-22",
                        value: 2021,
                      },
                    },
                    () => {
                      this.viewNationalScore();
                    }
                  );
                }
              }}
            /> */}
            <Row className="d-flex justify-content-center mt-4">
              <Colxx lg="1" className="back_img"></Colxx>
              <Colxx lg="10">
                <Row>
                  <Colxx lg="12">
                    <Card>
                      <Row>
                        <Colxx lg="7">
                          {this.state.historySIFData &&
                          this.state.nationalHistoryData ? (
                            <CardBody className="h-100" id="dashchart1">
                              <Row>
                                <Colxx lg="10">
                                  <h2
                                    className="text-center mb-3"
                                    style={{ fontWeight: 700 }}
                                  >
                                    <span className="ml-3 mt-3">
                                      {" "}
                                      Nagaland in {""}
                                      {this.state.filter === "SDG Index"
                                        ? "SDG India Index"
                                        : this.state.filter}
                                    </span>
                                  </h2>
                                </Colxx>

                                {/* <Colxx lg="2">
                                  <div className="mr-0 float-right">
                                    <UncontrolledButtonDropdown
                                      color="link"
                                      direction="left"
                                    >
                                      <DropdownToggle
                                        color="link"
                                        style={{
                                          color: "rgb(50, 50, 50)",
                                        }}
                                        className="p-0 font-weight-bold text-center"
                                      >
                                        <div className="btn btn-light">
                                          <i
                                            class="fa fa-download"
                                            aria-hidden="true"
                                          ></i>
                                        </div>
                                      </DropdownToggle>
                                      <DropdownMenu>
                                        <DropdownItem
                                          onClick={() => {
                                            setTimeout(() => {
                                              this.clickHandler("dashchart1");
                                            }, 1000);
                                          }}
                                        >
                                          As PDF
                                        </DropdownItem>
                                        <DropdownItem
                                        //   onClick={() => {
                                        //     this.handleExcelDownload(
                                        //       "dashchart1",
                                        //       `${this.state.filter} Score`
                                        //     );
                                        //   }}
                                        >
                                          As Excel
                                        </DropdownItem>
                                      </DropdownMenu>
                                    </UncontrolledButtonDropdown>
                                  </div>
                                </Colxx> */}
                              </Row>
                              {this.state.filter === "SDG Index" ? (
                                <>
                                  <Chart
                                    ref={(reference) =>
                                      (this.chartRef = reference)
                                    }
                                    key={this.state.filter}
                                    data={{
                                      labels: this.state.historySIFData[
                                        this.state.filter
                                      ]
                                        ? this.state.historySIFData[
                                            this.state.filter
                                          ]["goal"]?.labels?.map((dd) => {
                                            return `${dd}-${String(
                                              Number(dd) + 1
                                            ).slice(2, 4)}`;
                                          })
                                        : [],

                                      datasets: [
                                        {
                                          type: "bar",
                                          label: `Nagaland Score`,
                                          font: {
                                            size: 15,
                                            weight: "bold",
                                          },
                                          color: "#000000",
                                          backgroundColor: "#FFC107",
                                          data: this.state.historySIFData[
                                            this.state.filter
                                          ]
                                            ? this.state.historySIFData[
                                                this.state.filter
                                              ]["goal"]?.data
                                            : [],
                                          fill: false,
                                          barPercentage: 1,
                                          categoryPercentage: 0.4,
                                          borderColor: "rgb(0, 0, 0)",
                                          tension: 0.1,
                                          borderWidth: 2,
                                        },
                                        // {
                                        //   type: "bar",
                                        //   label: `National Score`,
                                        //   backgroundColor: "#009F84",
                                        //   data: this.state.nationalHistoryData[
                                        //     this.state.filter
                                        //   ]?.data
                                        //     ? this.state.nationalHistoryData[
                                        //         this.state.filter
                                        //       ]?.data
                                        //     : [],
                                        //   fill: false,
                                        //   barPercentage: 1,
                                        //   categoryPercentage: 0.4,
                                        //   borderColor: "rgb(75, 192, 192)",
                                        //   tension: 0.1,
                                        // },
                                      ],
                                    }}
                                    options={{
                                      onClick: (evt, item) => {
                                        this.setState(
                                          {
                                            selectedYear: {
                                              label: `${
                                                this.state.historySIFData[
                                                  this.state.filter
                                                ]["goal"]?.labels[
                                                  item[0]?.index
                                                ]
                                              }-${
                                                Number(
                                                  this.state.historySIFData[
                                                    this.state.filter
                                                  ]["goal"]?.labels[
                                                    item[0]?.index
                                                  ]
                                                ) + 1
                                              }`,
                                              value:
                                                this.state.historySIFData[
                                                  this.state.filter
                                                ]["goal"]?.labels[
                                                  item[0]?.index
                                                ],
                                            },
                                          },
                                          () => {
                                            this.viewNationalScore();
                                          }
                                        );
                                      },
                                      plugins: {
                                        datalabels: {
                                          anchor: "end",
                                          align: "top",
                                          formatter: Math.round,
                                          color: "#000000",
                                          font: {
                                            weight: "bold",
                                          },
                                        },
                                        legend: {
                                          position: 'top',
                                          labels: {
                                            color: "#000000",
                                            font: {
                                              weight: 'bold', // Make legend labels bold
                                            },
                                          },
                                        },
                                      },
                                      scales: {
                                        xAxes: {
                                          title: {
                                            display: true,
                                            text: "Year",
                                            color: "#000000",
                                            font: {
                                              size: 15,
                                              weight: "bold",
                                            },
                                          },
                                          ticks: {
                                            color: "#000000",
                                            font: {
                                              weight: 'bold',
                                            },
                                          },
                                        },
                                        yAxes: {
                                          title: {
                                            display: true,
                                            text: "Composite Score",
                                            color: "#000000",
                                            font: {
                                              size: 15,
                                              weight: "bold",
                                            },
                                          },
                                          ticks: {
                                            color: "#000000",
                                            font: {
                                              weight: 'bold',
                                            },
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
                                </>
                              ) : (
                                <>
                                  <Chart
                                    ref={(reference) =>
                                      (this.chartRef = reference)
                                    }
                                    key={this.state.filter}
                                    data={{
                                      labels: this.state.historySIFData[
                                        this.state.filter
                                      ]
                                        ? this.state.historySIFData[
                                            this.state.filter
                                          ]["goal"]?.labels
                                        : [],

                                      datasets: [
                                        {
                                          type: "bar",
                                          label: `${this.state.filter} Score`,
                                          backgroundColor: this.state
                                            .historySIFData[this.state.filter]
                                            ? this.state.historySIFData[
                                                this.state.filter
                                              ]["goal"]?.colors
                                            : "#0A97D9",
                                          data: this.state.historySIFData[
                                            this.state.filter
                                          ]
                                            ? this.state.historySIFData[
                                                this.state.filter
                                              ]["goal"]?.data
                                            : [],
                                          fill: false,
                                          barPercentage: 0.4,
                                          borderColor: "rgb(75, 192, 192)",
                                          tension: 0.1,
                                        },
                                      ],
                                    }}
                                    options={{
                                      onClick: (evt, item) => {
                                        this.setState(
                                          {
                                            selectedYear: {
                                              label: `${
                                                this.state.historySIFData[
                                                  this.state.filter
                                                ]["goal"]?.labels[
                                                  item[0]?.index
                                                ]
                                              }-${
                                                Number(
                                                  this.state.historySIFData[
                                                    this.state.filter
                                                  ]["goal"]?.labels[
                                                    item[0]?.index
                                                  ]
                                                ) + 1
                                              }`,
                                              value:
                                                this.state.historySIFData[
                                                  this.state.filter
                                                ]["goal"]?.labels[
                                                  item[0]?.index
                                                ],
                                            },
                                          },
                                          () => {
                                            this.viewNationalScore();
                                          }
                                        );
                                      },
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
                                      scales: {
                                        xAxes: {
                                          title: {
                                            display: true,
                                            text: "Year",
                                            font: {
                                              size: 15,
                                            },
                                          },
                                        },
                                        yAxes: {
                                          title: {
                                            display: true,
                                            text: "Score",
                                            font: {
                                              size: 15,
                                            },
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
                                  </Row>
                                </>
                              )}
                            </CardBody>
                          ) : (
                            <></>
                          )}
                        </Colxx>
                        <Colxx lg="5">
                          <Row>
                            <Colxx
                              lg="12"
                              className="d-flex justify-content-center align-items-center font-weight-bold h5 mt-4 "
                              style={{ fontWeight: 700 }}
                            >
                              Nagaland in SDG India Index 2020-21
                            </Colxx>
                          </Row>
                          <Row>
                            <Colxx
                              lg="12"
                              className="d-flex justify-content-center align-items-center mt-2"
                            >
                              {/* <div className="form-group w-50">
                                <Select
                                  options={
                                    this.state.sifyears
                                      ? this.state.sifyears.map((year) => {
                                          return {
                                            label: `${year}-${String(
                                              Number(year) + 1
                                            ).slice(2, 4)}`,
                                            value: year,
                                          };
                                        })
                                      : []
                                  }
                                  value={this.state.selectedYear}
                                  onChange={(val) => {
                                    this.setState({ selectedYear: val }, () => {
                                      this.viewNationalScore();
                                    });
                                  }}
                                />
                              </div> */}
                            </Colxx>
                          </Row>
                          <hr
                            className="text-dark d-flex justify-content-center align-items-center mt-2 mx-1"
                            style={{
                              border: "1px solid #000",
                            }}
                          />

                          <Row className="mx-1 d-flex flex-column  align-items-left">
                            <h5 style={{ fontWeight: 600 }}>
                              Front Runner Goals
                            </h5>
                            <Row className="d-flex justify-content-center mt-2 mb-2 mx-1">
                              {this.state.goalsData
                                .filter((rr) =>
                                  this.state.siffrontgoals?.includes(rr.name)
                                )
                                .map((goal) => {
                                  return (
                                    <>
                                      <div className="position-relative mr-1">
                                        <div className="d-flex justify-content-center w-100">
                                          <img
                                            alt=""
                                            // src={goal.image.replace('http://192.168.0.121:8005/', 'https://sdg.indevconsultancy.in/')}
                                            src={goal.image}
                                            width="64px"
                                            className="mt-1 cursor-pointer"
                                            onClick={() => {
                                              this.setState(
                                                {
                                                  // filter: goal.name,
                                                  selectedSifCategoryType:
                                                    "Front Runner",
                                                  selectedSifCatGoal: goal.name,
                                                  sifmodal: true,
                                                }
                                                // () => {
                                                //   this.viewNationalScore();
                                                // }
                                              );
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </>
                                  );
                                })}
                            </Row>
                            <h6 style={{ color: "#21a38b", fontWeight: 600 }}>
                              Click the goal icons to see goal-specific data
                            </h6>
                          </Row>

                          <hr
                            className="text-dark d-flex justify-content-left align-items-left mt-2 mx-1"
                            style={{
                              border: "1px solid #000",
                            }}
                          />

                          {/* <Row className="mx-1 d-flex flex-column">
                            <h5 style={{ fontWeight: 600 }}>
                              Nagaland Achiever Goals (SDG India Index)
                            </h5>
                            <Row className="d-flex justify-content-start mt-2 mb-2 mx-1">
                              {this.state.goalsData
                                .filter((rr) =>
                                  this.state.sifachievergoals?.includes(rr.name)
                                )
                                .map((goal) => {
                                  return (
                                    <>
                                      <div className="position-relative mr-1">
                                        <div className="d-flex justify-content-center w-100">
                                          <img
                                            alt=""
                                            src={goal.image}
                                            width="50px"
                                            className="mt-1 cursor-pointer"
                                            onClick={() => {
                                              this.setState(
                                                {
                                                  // filter: goal.name,
                                                  selectedSifCategoryType:
                                                    "Achiever",
                                                  selectedSifCatGoal: goal.name,
                                                  sifmodal: true,
                                                }
                                                // () => {
                                                //   this.viewNationalScore();
                                                // }
                                              );
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </>
                                  );
                                })}
                            </Row>
                            <h6 style={{ color: "#21a38b", fontWeight: 600 }}>
                              Click the goal icons to see goal-specific data
                            </h6>
                          </Row> */}
                          <Row>
                            <Colxx
                              lg="12"
                              className="d-flex justify-content-center align-items-center font-weight-bold h5 mt-4 "
                              style={{ fontWeight: 700 }}
                            >
                              Nagaland in NER District SDG India Index 2021-22
                            </Colxx>
                          </Row>
                          <hr
                            className="text-dark d-flex justify-content-center align-items-center mt-2 mx-1"
                            style={{
                              border: "1px solid #000",
                            }}
                          />
                          <Row className="mx-1 d-flex flex-column align-items-left">
                            <h5 style={{ fontWeight: 600 }}>
                              Front Runner Goals
                            </h5>
                            <Row className="d-flex justify-content-start mt-2 mb-2 ml-3 flex-wrap">
                              {this.state.goalsData
                                .filter((rr) =>
                                  this.state.diffrontgoals?.includes(rr.name)
                                )
                                .map((goal) => {
                                  return (
                                    <>
                                      <div
                                        className="position-relative mr-1"
                                        id={String(`front${goal.sno}`)}
                                      >
                                        <div className="d-flex justify-content-center w-100">
                                          <img
                                            alt=""
                                          //  src={goal.image.replace('http://192.168.0.121:8005/', 'https://sdg.indevconsultancy.in/')}
                                           src={goal.image}
                                          width="64px"
                                            className="mt-1 cursor-pointer"
                                            onClick={() => {
                                              this.setState({
                                                selectedDifCatGoal: goal.name,
                                                selectedDifCategoryType:
                                                  "Front Runner",
                                                difmodal: true,
                                              });
                                            }}
                                            // onMouseEnter={() => {
                                            //   this.handleTooltip(
                                            //     `front${goal.name}`
                                            //   );
                                            // }}
                                            // onMouseLeave={() => {
                                            //   this.handleTooltip(
                                            //     `front${goal.name}`
                                            //   );
                                            // }}
                                          />
                                        </div>
                                      </div>
                                      {/* <Reacttooltip
                                        placement="bottom"
                                        isOpen={
                                          this.state.tooltipOpen ===
                                          String(`front${goal.name}`)
                                        }
                                        autohide={false}
                                        target={String(`front${goal.sno}`)}
                                      >
                                        {this.state.diffrontrunnerData
                                          .filter(
                                            (dd) =>
                                              dd.goal ===
                                              this.state.selectedDifCatGoal
                                          )
                                          .map((rr) => {
                                            return (
                                              <>
                                                <p>{rr.name}</p>
                                              </>
                                            );
                                          })}
                                      </Reacttooltip> */}
                                    </>
                                  );
                                })}
                            </Row>
                            <h6 style={{ color: "#21a38b", fontWeight: 600 }}>
                              Click the goal icons to see front-runner districts
                            </h6>
                            <hr
                              className="text-dark d-flex justify-content-center align-items-center mt-2 mx-1"
                              style={{
                                border: "1px solid #000",
                              }}
                            />
                          </Row>
                        </Colxx>
                      </Row>

                      <Row className="mb-1"></Row>

                      <Row className="d-flex justify-content-center p-2">
                        <Colxx lg="12">
                          <>
                            {this.state.sifComparisonData ? (
                              <Row className="mt-2">
                                <Colxx lg="3">
                                  <div className="form-group ">
                                    <Label htmlFor="policy">Graph Type</Label>
                                    <Select
                                      options={[
                                        // {
                                        //   label: "State vs National",
                                        //   value: "svn",
                                        // },
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
                                      onChange={
                                        this.handleChangeSelSIFCompState1
                                      }
                                    />
                                  </div>
                                </Colxx>
                                <Colxx lg="3">
                                  {this.state.sifComparisonGraphType
                                    ?.value[2] === "s" ? (
                                    <div className="form-group ">
                                      <Label htmlFor="policy">
                                        Select State
                                      </Label>
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
                                    <CardBody className="h-100" id="dashchart3">
                                      <Row>
                                        <Colxx lg="10">
                                          <h2 className="text-center">
                                            <span className="ml-3 mt-3 font-weight-bold">
                                              State Comparison Chart 2020-21
                                            </span>
                                          </h2>
                                        </Colxx>

                                        <Colxx lg="2">
                                          {/* <div className="mr-0 float-right">
                                            <UncontrolledButtonDropdown
                                              color="link"
                                              direction="left"
                                            >
                                              <DropdownToggle
                                                color="link"
                                                style={{
                                                  color: "rgb(50, 50, 50)",
                                                }}
                                                className="p-0 font-weight-bold text-center"
                                              >
                                                <div className="btn btn-light">
                                                  <i
                                                    class="fa fa-download"
                                                    aria-hidden="true"
                                                  ></i>
                                                </div>
                                              </DropdownToggle>
                                              <DropdownMenu>
                                                <DropdownItem
                                                  onClick={() => {
                                                    setTimeout(() => {
                                                      this.clickHandler(
                                                        "dashchart3"
                                                      );
                                                    }, 1000);
                                                  }}
                                                >
                                                  As PDF
                                                </DropdownItem>
                                                <DropdownItem
                                                  onClick={() => {
                                                    this.handleExcelDownload(
                                                      "dashchart3",
                                                      `State Comparison Chart`
                                                    );
                                                  }}
                                                >
                                                  As Excel
                                                </DropdownItem>
                                              </DropdownMenu>
                                            </UncontrolledButtonDropdown>
                                          </div> */}
                                        </Colxx>
                                      </Row>
                                      <Chart
                                        ref={(reference) =>
                                          (this.chartRef = reference)
                                        }
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
                                              color: "#000000",
                                              backgroundColor:
                                                "rgb(162, 25, 66)",
                                              data: this.state
                                                .sifComparisonData[
                                                this.state.selSIFCompState1
                                                  ?.label
                                              ],
                                              borderColor:
                                                    "rgb(0, 0, 0)",
                                                  tension: 0.1,
                                              // borderColor: "white",
                                              borderWidth: 2,
                                            },
                                            {
                                              type: "bar",
                                              label: `${
                                                this.state
                                                  .sifComparisonGraphType
                                                  ?.value[2] === "n"
                                                  ? "National"
                                                  : this.state.selSIFCompState2
                                                      ?.label
                                              } Score`,
                                              color: "#000000",
                                              backgroundColor:
                                                "rgb(76, 159, 56)",
                                              data:
                                                this.state
                                                  .sifComparisonGraphType
                                                  ?.value[2] === "n"
                                                  ? this.state
                                                      .nationalGoalScores
                                                  : this.state
                                                      .sifComparisonData[
                                                      this.state
                                                        .selSIFCompState2?.label
                                                    ],

                                              // borderColor: "white",
                                              borderColor:
                                                "rgb(0, 0, 0)",
                                              tension: 0.1,
                                              borderWidth: 2,
                                              font: "bold",
                                            },
                                          ],
                                        }}
                                        options={{
                                          plugins: {
                                            datalabels: {
                                              anchor: "end",
                                              align: "top",
                                              formatter: Math.round,
                                              color: "#000000",
                                              font: {
                                                weight: "bold",
                                              },
                                            },
                                            legend: {
                                              position: 'top',
                                              labels: {
                                                color: "#000000",
                                                font: {
                                                  weight: 'bold', // Make legend labels bold
                                                },
                                              },
                                            },
                                          },
                                          scales: {
                                            xAxes: {
                                              title: {
                                                display: true,
                                                text: "Goal",
                                                color: "#000000",
                                                font: {
                                                  size: 15,
                                                  weight:"bold",
                                                },
                                              },
                                              ticks: {
                                                color: "#000000",
                                                font: {
                                                  weight: 'bold',
                                                  
                                                },
                                              },
                                            },
                                            yAxes: {
                                              title: {
                                                display: true,
                                                text: "Composite Score",
                                                color: "#000000",
                                                font: {
                                                  size: 15,
                                                  weight: 'bold',
                                                },
                                              },
                                              ticks: {
                                                color: "#000000",
                                                font: {
                                                  weight: 'bold',
                                                },
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
                                    </CardBody>
                                  </Card>
                                </Colxx>
                              </Row>
                            ) : (
                              <></>
                            )}
                          </>
                        </Colxx>
                      </Row>
                    </Card>
                  </Colxx>
                </Row>
              </Colxx>
              <Colxx lg="1" className="back_img"></Colxx>
            </Row>
            <Modal
              show={this.state.difmodal}
              onHide={() => this.setState({ difmodal: false })}
              backdrop="static"
              keyboard={false}
              size="lg"
            >
              <Modal.Header>
                <Modal.Title>
                  {this.state.selectedDifCategoryType} Districts for goal:{" "}
                  {this.state.selectedDifCatGoal}
                </Modal.Title>
                <i
                  className="fa fa-close fa-2x cursor-pointer"
                  onClick={() => {
                    this.setState({ difmodal: false });
                  }}
                />
              </Modal.Header>
              <Modal.Body>
                <Row>
                  <Colxx lg="12" className="mb-4 ml-4">
                    {/* <Card> */}
                    <CardBody className="h-100 pt-0 pl-0" id="dashchart2">
                      <Row className="d-flex justify-content-around text-center border-bottom pb-2 font-weight-bold h6">
                        <Colxx lg="4">District Name</Colxx>
                      </Row>

                      {_.uniqBy(
                        (this.state.selectedDifCategoryType === "Front Runner"
                          ? this.state.diffrontrunnerData
                          : this.state.difachieverdata
                        )
                          ?.filter(
                            (dd) => dd.goal === this.state.selectedDifCatGoal
                          )
                          .map((dd) => dd.name)
                      ).map((lb, index) => {
                        return (
                          <>
                            <Row className="border-bottom my-1 p-1">
                              <Colxx lg="4">{lb}</Colxx>
                            </Row>
                          </>
                        );
                      })}
                    </CardBody>
                    {/* </Card> */}
                  </Colxx>
                </Row>
              </Modal.Body>
            </Modal>
            <Modal
              show={this.state.sifmodal}
              onHide={() => this.setState({ sifmodal: false })}
              backdrop="static"
              keyboard={false}
              size="lg"
            >
              <Modal.Header>
                <Modal.Title>
                  State Indicator scores for Nagaland for Goal (
                  {this.state.selectedSifCategoryType}):{" "}
                  {this.state.selectedSifCatGoal}
                </Modal.Title>
                <i
                  className="fa fa-close fa-2x cursor-pointer"
                  onClick={() => {
                    this.setState({ sifmodal: false });
                  }}
                />
              </Modal.Header>
              <Modal.Body>
                <Row>
                  <Colxx lg="12" className="mb-4 ml-4">
                    {/* <Card> */}
                    <CardBody className="h-100" id="dashchart2">
                      <Row className="d-flex justify-content-around text-center border-bottom pb-2 font-weight-bold h6">
                        <Colxx lg="4">Indicator</Colxx>
                        <Colxx lg="4">Data</Colxx>
                        <Colxx lg="4">Target</Colxx>
                      </Row>
                      {(this.state.selectedSifCategoryType === "Front Runner"
                        ? this.state.siffrontrunnerData
                        : this.state.sifachieverdata
                      )
                        ?.filter(
                          (dd) => dd.goal === this.state.selectedSifCatGoal
                        )
                        .map((lb, index) => {
                          return (
                            <>
                              <Row className="border-bottom my-1 p-1">
                                <Colxx lg="4">{lb.indicator}</Colxx>
                                <Colxx lg="4" className="text-center">
                                  {lb.value && lb.value !== "Null"
                                    ? lb.value
                                    : 0}
                                </Colxx>
                                <Colxx lg="4" className="text-center">
                                  {lb.target_ && lb.target_ !== "Null"
                                    ? lb.target_
                                    : 0}
                                </Colxx>
                              </Row>
                            </>
                          );
                        })}
                    </CardBody>
                    {/* </Card> */}
                  </Colxx>
                </Row>
              </Modal.Body>
            </Modal>
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

export default PublicDashBoard;
