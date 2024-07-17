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
import DashFooter from "../Header/Footer";
import { ProgressBar } from "react-bootstrap";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { saveAs } from 'file-saver';
import {
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
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

class MainDashBoard extends Component {
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
      viewFilter: localStorage.getItem("display")
        ? localStorage.getItem("display")
        : "Dashboard",
      goalsData: [],
      scorePerNitiChartData: {},
      selectedYear: {
        label: new Date().getFullYear() + "-" + (new Date().getFullYear() + 1).toString().substr(-2),
        value: new Date().getFullYear(),
      },
      districtRanks: {},
      nationalGoalScores: [],
    };
  }

  classifyValue = (value) => {
    if (value >= 100) return 'Achiever';
    if (value >= 65) return 'Front Runner';
    if (value >= 50) return 'Performer';
    if (value >= 0) return 'Aspirant';
    return 'Unknown'; // Handle unexpected cases
  };

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
        let sifIndicatorDepartment = {};
        let sifIndicatorSchema = {};
        data
          .filter((id) => id.type === "SIF")
          .forEach((id) => {
            if (sifIndicators[id.goal]) {
              sifIndicators[id.goal].push(id.name);
            } else {
              sifIndicators[id.goal] = [id.name];
            }
            sifIndicatorComment[id.name] = id.comment;
            sifIndicatorDepartment[id.name] = id.department;
            sifIndicatorSchema[id.name] = id.scheme;
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
            sifIndicatorDepartment,
            sifIndicatorSchema,
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

  clickHandlerScore = async (id) => {
    let originalCanvas = null;
  
    // Capture the original chart as a canvas
    await html2canvas(document.querySelector(`#${id}`)).then((canvas) => {
      originalCanvas = canvas;
    });
  
    if (originalCanvas) {
      const padding = 10;
  
      // Create a new canvas with padding
      const paddedCanvas = document.createElement('canvas');
      paddedCanvas.width = originalCanvas.width + 2 * padding;
      paddedCanvas.height = originalCanvas.height + 2 * padding;
      const context = paddedCanvas.getContext('2d');
  
      // Fill the background with white (optional)
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, paddedCanvas.width, paddedCanvas.height);
  
      // Draw the original canvas onto the padded canvas
      context.drawImage(originalCanvas, padding, padding);
  
      // Convert the padded canvas to a data URL and download it
      const url = paddedCanvas.toDataURL("image/png");
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
            labels: Object.keys(years).map((year)=>{
              return `${year}-${String(Number(year) + 1).slice(
                          2,
                          4
                        )}`;
            }),
            // labels: Object.keys(years),
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
            labels: Object.keys(years).map((year)=>{
              return `${year}-${String(Number(year) + 1).slice(
                          2,
                          4
                        )}`;
            }),

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
                  labels: Object.keys(years_indicator).map((year)=>{
                    return `${year}-${String(Number(year) + 1).slice(
                          2,
                          4
                        )}`;
                  }),
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
      break;
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
      break;
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
      break;

      case "score-data":
      
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

    break;  
       
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

  handleExcelDownloadExport = (chartId, fileName) => {
    let dataToExport = [];
     
    if (chartId === 'dashchart2') {
      // Prepare data for sifIndicators
      dataToExport = this.state.sifIndicators[this.state.filter]?.map((lb, index) => {
        return {
          Indicator: lb,
          Data: this.state.goalSIFIndicatorData[this.state.filter]?.data?.[index] || 0,
          Target: this.state.historyTargetsSIF[this.state.filter]?.[lb]?.[this.state.selectedYear?.value] || 0,
        };
      }) || [];
    } else if (chartId === 'dashchart5') {
      // Prepare data for difIndicators
      const { difIndicators, filter, difIndicatorComment, distIndicatorGraphData, selDIFIndicatorDist } = this.state;
  
      dataToExport = difIndicators[filter]?.map((lb, index) => {
        return {
          Indicator: difIndicatorComment[lb] ? difIndicatorComment[lb] : lb,
          Data: distIndicatorGraphData[filter]?.[selDIFIndicatorDist?.label]?.data?.[index] || 0,
          Target: this.state.historyTargetsDIF[this.state.filter]?.[lb]?.[this.state.selectedYear?.value] || 0
        };
      }) || [];
    } else if (chartId === 'dist-score') {
      const table = document.getElementById('dist-score');
      const data = [];
  
      // Extract headers
      const headers = [];
      table.querySelectorAll('thead th').forEach((th) => {
        headers.push(th.innerText);
      });
      data.push(headers);
  
      // Extract rows
      table.querySelectorAll('tbody tr').forEach((tr) => {
        const row = [];
        tr.querySelectorAll('td').forEach((td) => {
          row.push(td.innerText);
        });
        data.push(row);
      });
  
      // Convert array to object format for XLSX.utils.json_to_sheet
      const dataObjects = data.slice(1).map((row) => {
        return row.reduce((acc, cell, index) => {
          acc[headers[index]] = cell;
          return acc;
        }, {});
      });
  
      dataToExport = dataObjects;
    }
    // Convert JSON to Worksheet
    const ws = XLSX.utils.json_to_sheet(dataToExport);
  
    // Create a new Workbook
    const wb = XLSX.utils.book_new();
  
    // Append the Worksheet to the Workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  
    // Generate a file and trigger download
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), `${fileName}.xlsx`);
  };

  DistrcitGoalExport= () => {
    var wb = XLSX.utils.book_new();
    
    // Get the container with the data
    var container = document.getElementById('dist-score');
    
    // Extract data
    var rows = [];
    var headers = container.querySelector('.h6').children;
    var headerRow = [];
    for (var i = 0; i < headers.length; i++) {
      headerRow.push(headers[i].innerText.trim());
    }
    rows.push(headerRow);

    var dataRows = container.querySelectorAll('.border-bottom.py-2');
    dataRows.forEach(function(row) {
      var goal = row.querySelector('.font-weight-bold').innerText.trim();
      var score = row.querySelector('.col-lg-4 .row .col-lg-4').innerText.trim();
      rows.push([goal, score]);
    });

    // Create a worksheet from the data
    var ws = XLSX.utils.aoa_to_sheet(rows);

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    
    // Generate a file name
    var filename = 'data_export.xlsx';
    
    // Write the workbook and start the download
    XLSX.writeFile(wb, filename);
  
};
  
  

  render() {
    return (
      <div className="h-100">
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
              subtab={this.state.subtab}
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

                if (val === "distscore" || val === "distgraph") {
                  this.setState(
                    {
                      selectedYear: {
                        label: new Date().getFullYear() + "-" + (new Date().getFullYear() + 1).toString().substr(-2),
                        value: new Date().getFullYear(),
                      },
                    },
                    () => {
                      this.viewNationalScore();
                    }
                  );
                }
                else{
                  this.setState(
                    {
                      selectedYear: {
                        label: new Date().getFullYear() + "-" + (new Date().getFullYear() + 1).toString().substr(-2),
                        value: new Date().getFullYear(),
                      },
                    },
                    () => {
                      this.viewNationalScore();
                    }
                  );
                }
              }}
            />
            <hr className="mt-0" />
            {this.state.viewFilter === "Dashboard" ? (
              <>
                <Row className="d-flex justify-content-center mt-4">
                  <Colxx lg="1" className="back_img"></Colxx>
                  <Colxx lg="10">
                    {this.state.subtab === "dashboard" ? (
                      <>
                        <Row>
                          <Colxx lg="12">
                            <Card>
                              <Row>
                                <Colxx lg="7">
                                  {this.state.historySIFData &&
                                  this.state.nationalHistoryData ? (
                                    <CardBody className="h-100" >
                                    <div id="dashchart1">
                                      <Row>
                                        <Colxx lg="10">
                                          <h2 className="text-center ">
                                            <span className="ml-3 mt-3 font-weight-bold">
                                              {this.state.filter === "SDG Index"
                                                ? "SDG India Index"
                                                : this.state.filter}{" "}
                                              Nagaland State
                                              {/* for{" "}
                                              {this.state.selectedYear?.label} */}
                                            </span>
                                          </h2>
                                        </Colxx>

                                        <Colxx lg="2" data-html2canvas-ignore="true">
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
                                                      this.clickHandler(
                                                        "dashchart1"
                                                      );
                                                    }, 1000);
                                                  }}
                                                >
                                                  As Image
                                                </DropdownItem>
                                                <DropdownItem
                                                  onClick={() => {
                                                    this.handleExcelDownload(
                                                      "dashchart1",
                                                      `${this.state.filter} Score`
                                                    );
                                                  }}
                                                >
                                                  As Excel
                                                </DropdownItem>
                                              </DropdownMenu>
                                            </UncontrolledButtonDropdown>
                                          </div>
                                        </Colxx>
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
                                                  ]["goal"]?.labels
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
                                                  data: this.state
                                                    .historySIFData[
                                                    this.state.filter
                                                  ]
                                                    ? this.state.historySIFData[
                                                        this.state.filter
                                                      ]["goal"]?.data
                                                    : [],
                                                  fill: false,
                                                  barPercentage: 0.8,
                                                  categoryPercentage: 0.8,
                                                  borderColor:
                                                    "rgb(0, 0, 0)",
                                                  tension: 0.1,
                                                  borderWidth: 2,
                                                },
                                                {
                                                  type: "bar",
                                                  label: `National Score`,
                                                  font: {
                                                    size: 15,
                                                    weight: "bold",
                                                  },
                                                  color: "#000000",
                                                  backgroundColor: "#009F84",
                                                  data: this.state
                                                    .nationalHistoryData[
                                                    this.state.filter
                                                  ]?.data
                                                    ? this.state
                                                        .nationalHistoryData[
                                                        this.state.filter
                                                      ]?.data
                                                    : [],
                                                  fill: false,
                                                  barPercentage: 0.8,
                                                  categoryPercentage: 0.8,
                                                  borderColor:
                                                    "rgb(0, 0, 0)",
                                                  tension: 0.1,
                                                  borderWidth: 2,
                                                },
                                              ],
                                            }}
                                            options={{
                                              onClick: (evt, item) => {
                                                this.setState(
                                                  {
                                                    selectedYear: {
                                                      label: `${
                                                        this.state
                                                          .historySIFData[
                                                          this.state.filter
                                                        ]["goal"]?.labels[
                                                          item[0]?.index
                                                        ]
                                                      }-${
                                                        Number(
                                                          this.state
                                                            .historySIFData[
                                                            this.state.filter
                                                          ]["goal"]?.labels[
                                                            item[0]?.index
                                                          ]
                                                        ) + 1
                                                      }`,
                                                      value:
                                                        this.state
                                                          .historySIFData[
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
                                                    text: "Score",
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
                                                beforeInit(
                                                  chart,
                                                  legend,
                                                  options
                                                ) {
                                                  const fitvalue =
                                                    chart.legend.fit;
                                                  chart.legend.fit =
                                                    function fit() {
                                                      fitvalue.bind(
                                                        chart.legend
                                                      )();
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
                                                    .historySIFData[
                                                    this.state.filter
                                                  ]
                                                    ? this.state.historySIFData[
                                                        this.state.filter
                                                      ]["goal"]?.colors
                                                    : "#0A97D9",
                                                  data: this.state
                                                    .historySIFData[
                                                    this.state.filter
                                                  ]
                                                    ? this.state.historySIFData[
                                                        this.state.filter
                                                      ]["goal"]?.data
                                                    : [],
                                                  fill: false,
                                                  barPercentage: 0.4,
                                                  borderColor:
                                                    "rgb(75, 192, 192)",
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
                                                        this.state
                                                          .historySIFData[
                                                          this.state.filter
                                                        ]["goal"]?.labels[
                                                          item[0]?.index
                                                        ]
                                                      }-${
                                                        Number(
                                                          this.state
                                                            .historySIFData[
                                                            this.state.filter
                                                          ]["goal"]?.labels[
                                                            item[0]?.index
                                                          ]
                                                        ) + 1
                                                      }`,
                                                      value:
                                                        this.state
                                                          .historySIFData[
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
                                                },legend: {
                                                  position: 'top',
                                                  labels: {
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
                                                    font: {
                                                      size: 15,
                                                      weight: "bold",
                                                    },
                                                  },
                                                  ticks: {
                                                    font: {
                                                      weight: 'bold',
                                                    },
                                                  },
                                                },
                                                yAxes: {
                                                  title: {
                                                    display: true,
                                                    text: "Score",
                                                    font: {
                                                      size: 15,
                                                      weight: "bold",
                                                    },
                                                  },
                                                  ticks: {
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
                                                beforeInit(
                                                  chart,
                                                  legend,
                                                  options
                                                ) {
                                                  const fitvalue =
                                                    chart.legend.fit;
                                                  chart.legend.fit =
                                                    function fit() {
                                                      fitvalue.bind(
                                                        chart.legend
                                                      )();
                                                      return (this.height += 20);
                                                    };
                                                },
                                              },
                                            ]}
                                          />
                                          <Row className="mt-2 d-flex justify-content-center" style={{fontSize: "10px"}}>
                                            <Colxx
                                              lg="10"
                                              className="d-flex justify-content-around"
                                            >
                                              <div className="d-flex justify-content-center align-items-center font-weight-bold">
                                                <i
                                                  className="fa fa-circle"
                                                  style={{ color: "#00AEEE" }}
                                                  aria-hidden="true"
                                                ></i>
                                                <span className="ml-1">
                                                  Achiever [100]
                                                </span>
                                              </div>
                                              <div className="d-flex justify-content-center align-items-center ml-2 font-weight-bold">
                                                <i
                                                  className="fa fa-circle"
                                                  style={{ color: "#009F84" }}
                                                  aria-hidden="true"
                                                ></i>
                                                <span className="ml-1">
                                                  Front Runner [65 - 99]
                                                </span>
                                              </div>
                                              <div className="d-flex justify-content-center align-items-center ml-2 font-weight-bold">
                                                <i
                                                  className="fa fa-circle text-warning"
                                                  aria-hidden="true"
                                                ></i>
                                                <span className="ml-1">
                                                  Performer [50 - 64]
                                                </span>
                                              </div>
                                              <div className="d-flex justify-content-center align-items-center ml-2 font-weight-bold">
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
                                      </div>
                                    </CardBody>
                                  ) : (
                                    <></>
                                  )}
                                </Colxx>
                                <Colxx lg="5" id="score-data">
                                  <Row>
                                    <Colxx
                                      lg="10"
                                      className="d-flex justify-content-center align-items-center font-weight-bold h5 mt-2"
                                    >
                                      Nagaland Goal Score for 
                                      {/* Nagaland Front Runner Goals {" "} */}
                                      {this.state.selectedYear?.label}
                                    </Colxx>
                                    <Colxx lg="2" data-html2canvas-ignore="true" >
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
                                                      this.clickHandlerScore(
                                                        "score-data"
                                                      );
                                                    }, 1000);
                                                  }}
                                                >
                                                  As Image
                                                </DropdownItem>
                                                <DropdownItem
                                                  onClick={() => {
                                                    this.handleExcelDownload(
                                                      "score-data",
                                                      `National Goal Score`
                                                    );
                                                  }}
                                                >
                                                  As Excel
                                                </DropdownItem>
                                              </DropdownMenu>
                                            </UncontrolledButtonDropdown>
                                          </div>
                                        </Colxx>
                                  </Row>
                                  <Row className="border-bottom py-2 d-flex align-items-center h6 font-weight-bold">
                                    <Colxx lg="6">Goal</Colxx>
                                    <Colxx lg="4">Score</Colxx>
                                  </Row>
                                  {this.state.sifComparisonData &&
                                    this.state.goalsName.map((data, index) => {
                                      return (
                                        <>
                                          {index === 0 ? (
                                            <Row className="border-bottom py-2 d-flex align-items-center bg-theme-3 mr-0">
                                              <Colxx
                                                lg="6"
                                                className="font-weight-bold"
                                              >
                                                SDG Composite Score
                                              </Colxx>
                                              <Colxx lg="4" className="font-weight-bold">
                                                <Row>
                                                  <Colxx lg="8" className="font-weight-bold">
                                                    <ProgressBar
                                                      variant={`progress-custom-${
                                                        this.state
                                                          .sifComparisonData[
                                                          "Nagaland"
                                                        ]
                                                          ? Number(
                                                              this.state
                                                                .sifComparisonData[
                                                                "Nagaland"
                                                              ][index]
                                                            ).toFixed(0) < 49
                                                            ? "first"
                                                            : Number(
                                                                this.state
                                                                  .sifComparisonData[
                                                                  "Nagaland"
                                                                ][index]
                                                              ).toFixed(0) < 64
                                                            ? "second"
                                                            : Number(
                                                                this.state
                                                                  .sifComparisonData[
                                                                  "Nagaland"
                                                                ][index]
                                                              ).toFixed(0) < 99
                                                            ? "third"
                                                            : "fourth"
                                                          : "first"
                                                      }`}
                                                      style={{ height: "16px" ,
                                                        border: "1px solid black",
                                                      }}
                                                      now={
                                                        // (data.properties.distarea * Math.random() * 4) / 100
                                                        this.state
                                                          .sifComparisonData[
                                                          "Nagaland"
                                                        ]
                                                          ? this.state
                                                              .sifComparisonData[
                                                              "Nagaland"
                                                            ][index]
                                                          : 0
                                                      }
                                                    />
                                                  </Colxx>
                                                  <Colxx lg="4">
                                                    {this.state
                                                      .sifComparisonData[
                                                      "Nagaland"
                                                    ]
                                                      ? this.state
                                                          .sifComparisonData[
                                                          "Nagaland"
                                                        ][index]
                                                      : 0}
                                                  </Colxx>
                                                </Row>
                                              </Colxx>
                                            </Row>
                                          ) : (
                                            <Row className="border-bottom py-2 d-flex align-items-center">
                                              <Colxx
                                                lg="6"
                                                className="font-weight-bold"
                                              >
                                                {/* {data.properties.distname} */}
                                                {data}
                                              </Colxx>
                                              <Colxx lg="4" className="font-weight-bold">
                                                <Row>
                                                  <Colxx lg="8" className="font-weight-bold">
                                                    <ProgressBar
                                                      variant={`progress-custom-${
                                                        this.state
                                                          .sifComparisonData[
                                                          "Nagaland"
                                                        ]
                                                          ? Number(
                                                              this.state
                                                                .sifComparisonData[
                                                                "Nagaland"
                                                              ][index]
                                                            ).toFixed(0) < 49
                                                            ? "first"
                                                            : Number(
                                                                this.state
                                                                  .sifComparisonData[
                                                                  "Nagaland"
                                                                ][index]
                                                              ).toFixed(0) < 64
                                                            ? "second"
                                                            : Number(
                                                                this.state
                                                                  .sifComparisonData[
                                                                  "Nagaland"
                                                                ][index]
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
                                                        this.state
                                                          .sifComparisonData[
                                                          "Nagaland"
                                                        ]
                                                          ? this.state
                                                              .sifComparisonData[
                                                              "Nagaland"
                                                            ][index]
                                                          : 0
                                                      }
                                                    />
                                                  </Colxx>
                                                  <Colxx lg="4">
                                                    {this.state
                                                      .sifComparisonData[
                                                      "Nagaland"
                                                    ]
                                                      ? this.state
                                                          .sifComparisonData[
                                                          "Nagaland"
                                                        ][index]
                                                      : 0}
                                                  </Colxx>
                                                </Row>
                                              </Colxx>
                                            </Row>
                                          )}
                                        </>
                                      );
                                    })}
                                </Colxx>
                              </Row>
                            </Card>
                          </Colxx>
                        </Row>
                      </>
                    ) : this.state.subtab === "statescore" ? (
                      <>
                        <>
                        <div id="export-section">
                          <Row>
                          
                            <Colxx
                              lg="10"
                              className="d-flex justify-content-center mt-3"
                            >
                              <span className="h5 font-weight-bold text-center">
                                State Goal Score as per SDG India Index
                              </span>
                            </Colxx>
                            <Colxx lg="2" data-html2canvas-ignore="true">
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
                                                      this.clickHandlerScore(
                                                        "export-section"
                                                      );
                                                    }, 1000);
                                                  }}
                                                >
                                                  As Image
                                                </DropdownItem>
                                              </DropdownMenu>
                                            </UncontrolledButtonDropdown>
                                          </div>
                                        </Colxx>
                            
                          </Row>
                          <Row style={{ marginTop: "40px" }}>
                            <Colxx lg="1"></Colxx>
                            <Colxx lg="11">
                              <Row
                                className="d-flex justify-content-start"
                                style={{ height: "230px" }}
                              >
                                {this.state.goalsData.map((goal) => {
                                  return (
                                    <>
                                      <div className="position-relative mr-1 mb-2 d-flex flex-column justify-content-end">
                                        <div className="w-100 d-flex justify-content-center">
                                          <p className="h6 " style={{ fontWeight: "bold" }}>
                                            {this.state.scorePerNitiChartData[
                                              goal.name
                                            ]
                                              ? Number(
                                                  this.state
                                                    .scorePerNitiChartData[
                                                    goal.name
                                                  ].ed_val
                                                ).toFixed(0)
                                              : 0}
                                          </p>
                                        </div>
                                        <div className="w-100 d-flex justify-content-center font-weight ">
                                          <div
                                            className={""}
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
                                              border:"2px solid black",
                                             
                                              backgroundColor: this.state
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
                                                  ? "#FFC107"
                                                  : this.state
                                                      .scorePerNitiChartData[
                                                      goal.name
                                                    ].ed_val >= 65 &&
                                                    this.state
                                                      .scorePerNitiChartData[
                                                      goal.name
                                                    ].ed_val <= 99
                                                  ? "#009F84"
                                                  : this.state
                                                      .scorePerNitiChartData[
                                                      goal.name
                                                    ].ed_val === 100
                                                  ? "#00AEEE"
                                                  : "#DC3545"
                                                : "#DC3545",
                                               
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
                                            src={goal.image.replace('http://192.168.0.121:8005/', 'https://sdg.indevconsultancy.in/')}
                                            width="50px"
                                            className="mt-1 cursor-pointer"
                                            onClick={() => {
                                              this.setState(
                                                {
                                                  filter: goal.name,
                                                },
                                                () => {
                                                  this.viewNationalScore();
                                                }
                                              );
                                            }}
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
                              lg="1"
                              className="d-flex flex-column justify-content-center align-items-end font-weight-bold"
                            >
                              <p className="mb-0">Score</p>
                              <p className="mb-0">
                                {this.state.selectedYear?.label}
                              </p>
                            </Colxx>
                            <Colxx lg="11">
                              <Row className="d-flex justify-content-start mt-2">
                                {this.state.goalsData.map((goal) => {
                                  return (
                                    <>
                                      <div className="position-relative mr-1">
                                        <div
                                          className={[
                                            "d-flex flex-column justify-content-center align-items-center h6",
                                          ].join(" ")}
                                          style={{
                                            width: "50px",
                                            height: "50px",
                                            border:"2px solid black",
                                            backgroundColor: this.state
                                              .scorePerNitiChartData[goal.name]
                                              ? this.state
                                                  .scorePerNitiChartData[
                                                  goal.name
                                                ].ed_val >= 50 &&
                                                this.state
                                                  .scorePerNitiChartData[
                                                  goal.name
                                                ].ed_val <= 64
                                                ? "#FFC107"
                                                : this.state
                                                    .scorePerNitiChartData[
                                                    goal.name
                                                  ].ed_val >= 65 &&
                                                  this.state
                                                    .scorePerNitiChartData[
                                                    goal.name
                                                  ].ed_val <= 99
                                                ? "#009F84"
                                                : this.state
                                                    .scorePerNitiChartData[
                                                    goal.name
                                                  ].ed_val === 100
                                                ? "#00AEEE"
                                                : "#DC3545"
                                              : "#DC3545",
                                          }}
                                        >
                                          <i
                                            className={[
                                              "fa",
                                              this.state.scorePerNitiChartData[
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
                                          <span className="text-white font-weight-bold">
                                            {this.state.scorePerNitiChartData[
                                              goal.name
                                            ]
                                              ? Number(
                                                  this.state
                                                    .scorePerNitiChartData[
                                                    goal.name
                                                  ].ed_val
                                                ).toFixed()
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
                              lg="1"
                              className="d-flex flex-column justify-content-center align-items-end font-weight-bold"
                            >
                              <p className="mb-0">Score</p>
                              <p className="mb-0">
                                {String(this.state.selectedYear?.value - 1)}-
                                {String(this.state.selectedYear?.value)?.slice(
                                  2,
                                  4
                                )}
                              </p>
                            </Colxx>
                            <Colxx lg="11">
                              <Row className="d-flex justify-content-start mt-2">
                                {this.state.goalsData.map((goal) => {
                                  return (
                                    <>
                                      <div className="position-relative mr-1">
                                        <div
                                          className={[
                                            "d-flex justify-content-center align-items-center text-white h6 font-weight-bold",
                                          ].join(" ")}
                                          style={{
                                            width: "50px",
                                            height: "50px",
                                            border:"2px solid black",
                                            backgroundColor: this.state
                                              .scorePerNitiChartData[goal.name]
                                              ? this.state
                                                  .scorePerNitiChartData[
                                                  goal.name
                                                ].ed_val >= 50 &&
                                                this.state
                                                  .scorePerNitiChartData[
                                                  goal.name
                                                ].ed_val <= 64
                                                ? "#FFC107"
                                                : this.state
                                                    .scorePerNitiChartData[
                                                    goal.name
                                                  ].ed_val >= 65 &&
                                                  this.state
                                                    .scorePerNitiChartData[
                                                    goal.name
                                                  ].ed_val <= 99
                                                ? "#009F84"
                                                : this.state
                                                    .scorePerNitiChartData[
                                                    goal.name
                                                  ].ed_val === 100
                                                ? "#00AEEE"
                                                : "#DC3545"
                                              : "#DC3545",
                                          }}
                                        >
                                          {this.state.scorePerNitiChartData[
                                            goal.name
                                          ]
                                            ? Number(
                                                this.state
                                                  .scorePerNitiChartData[
                                                  goal.name
                                                ].st_val
                                              )
                                            : 0}
                                        </div>
                                      </div>
                                    </>
                                  );
                                })}
                              </Row>
                            </Colxx>
                          </Row>
                          <Row className="mt-2 mb-3">
                            <Colxx lg="1"></Colxx>
                            <Colxx lg="11" className="d-flex">
                              <div className="d-flex justify-content-center align-items-center font-weight-bold">
                                <i
                                  className="fa fa-circle"
                                  style={{ color: "#00AEEE" }}
                                  aria-hidden="true"
                                ></i>
                                <span className="ml-1">Achiever [100]</span>
                              </div>
                              <div className="d-flex justify-content-center align-items-center ml-2 font-weight-bold">
                                <i
                                  className="fa fa-circle"
                                  style={{ color: "#009F84" }}
                                  aria-hidden="true"
                                ></i>
                                <span className="ml-1">
                                  Front Runner [65 - 99]
                                </span>
                              </div>
                              <div className="d-flex justify-content-center align-items-center ml-2 font-weight-bold">
                                <i
                                  className="fa fa-circle text-warning"
                                  aria-hidden="true"
                                ></i>
                                <span className="ml-1">
                                  Performer [50 - 64]
                                </span>
                              </div>
                              <div className="d-flex justify-content-center align-items-center ml-2 font-weight-bold">
                                <i
                                  className="fa fa-circle text-danger"
                                  aria-hidden="true"
                                ></i>
                                <span className="ml-1">Aspirant [0 - 49]</span>
                              </div>
                              <div className="d-flex justify-content-center align-items-center ml-4 font-weight-bold">
                                <span className="ml-1 font-weight-bold">
                                  Score Status
                                </span>
                              </div>
                              <div className="d-flex justify-content-center align-items-center ml-2 font-weight-bold">
                                <i
                                  className="fa fa-long-arrow-up"
                                  aria-hidden="true"
                                ></i>
                                <span className="ml-1">Improved</span>
                              </div>
                              <div className="d-flex justify-content-center align-items-center ml-2 font-weight-bold">
                                <i
                                  className="fa fa-long-arrow-right"
                                  aria-hidden="true"
                                ></i>
                                <span className="ml-1">No change</span>
                              </div>
                              <div className="d-flex justify-content-center align-items-center ml-2 font-weight-bold">
                                <i
                                  className="fa fa-long-arrow-down"
                                  aria-hidden="true"
                                ></i>
                                <span className="ml-1">Dropped</span>
                              </div>
                            </Colxx>
                            
                          </Row>
                          </div>
                        </>
                        <>
                          {this.state.goalSIFIndicatorData ? (
                            <Row>
                              <Colxx lg="12" className="mb-4 mt-4">
                                <Card>
                                  <CardBody className="h-100" id="dashchart2">
                                    <Row>
                                    <Colxx className="d-flex justify-content-center">
                                        <h2>
                                          <span className="ml-3 mt-3 font-weight-bold">
                                            State Indicator scores for Nagaland
                                            for Goal: {this.state.filter}
                                          </span>
                                        </h2>
                                      </Colxx>
                                      <Colxx lg="2" data-html2canvas-ignore="true">
                                              <div className="mr-0 float-right" id="exportButton">
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
                                                            "dashchart2"
                                                          );
                                                        }, 1000);
                                                      }}
                                                    >
                                                      As Image
                                                    </DropdownItem>
                                                    <DropdownItem
                                                      onClick={() => {
                                                        this.handleExcelDownloadExport(
                                                          "dashchart2",
                                                          `State Indicator scores `
                                                        );
                                                      }}
                                                    >
                                                      As Excel
                                                    </DropdownItem>
                                                  </DropdownMenu>
                                                </UncontrolledButtonDropdown>
                                              </div>
                                            </Colxx>
                                    </Row>
                                    <Row className="d-flex justify-content-around text-center border-bottom pb-2 font-weight-bold h5 mt-2">
                                      <Colxx lg="2">Indicator</Colxx>
                                      <Colxx lg="2">Department</Colxx>
                                      <Colxx lg="2">Scheme</Colxx>
                                      <Colxx lg="2">Data</Colxx>
                                      <Colxx lg="2">Category</Colxx>
                                      <Colxx lg="2">Target</Colxx>
                                      
                                    </Row>
                                    {this.state.sifIndicators[
                                      this.state.filter
                                    ]?.map((lb, index) => {
                                      return (
                                        <>
                                          <Row className="justify-content-around text-center border-bottom pb-2 font-weight-bold mt-2">
                                            <Colxx lg="2" className="font-weight-bold text-center">
                                                {lb}
                                            </Colxx>

                                            <Colxx lg="2" className=" text-center font-weight-bold">
                                              {this.state.sifIndicatorDepartment[
                                                lb
                                              ]
                                                ? this.state
                                                    .sifIndicatorDepartment[lb]
                                                : lb}
                                              
                                            </Colxx>
                                           
                                            <Colxx lg="2" className=" text-center font-weight-bold">
                                              {this.state.sifIndicatorSchema[
                                                lb
                                              ]
                                                ? this.state
                                                  .sifIndicatorSchema[lb]
                                                : lb}
                                              
                                            </Colxx>

                                            <Colxx
                                              lg="2"
                                              className="text-center font-weight-bold"
                                            >
                                              {this.state.goalSIFIndicatorData[
                                                this.state.filter
                                              ]?.data?.length > 0
                                                ? this.state
                                                    .goalSIFIndicatorData[
                                                    this.state.filter
                                                  ]?.data[index]
                                                : 0}
                                            </Colxx>

                                            <Colxx lg="2" className="text-center font-weight-bold">
                                            {this.state.goalSIFIndicatorData[this.state.filter]?.data?.length > 0 
                                              ? (() => {
                                                  const value = this.state.goalSIFIndicatorData[this.state.filter]?.data[index];
                                                  if (value == 100) {
                                                    return 'Achiever';
                                                  } else if (value >= 65 && value <= 99) {
                                                    return 'Front Runner';
                                                  } else if (value >= 50 && value <= 64)  {
                                                    return 'Front Runner';
                                                  }else if (value >= 0 && value <= 49) {
                                                    return 'Aspirant';
                                                  }
                                                })()
                                              : 0}
                                          </Colxx>
                                            <Colxx
                                              lg="2"
                                              className="text-center font-weight-bold"
                                            >
                                              {this.state.historyTargetsSIF[
                                                this.state.filter
                                              ]
                                                ? this.state.historyTargetsSIF[
                                                    this.state.filter
                                                  ][lb]
                                                  ? this.state
                                                      .historyTargetsSIF[
                                                      this.state.filter
                                                    ][lb][
                                                      this.state.selectedYear
                                                        ?.value
                                                    ]
                                                    ? this.state
                                                        .historyTargetsSIF[
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
                                  </CardBody>
                                </Card>
                              </Colxx>
                            </Row>
                          ) : (
                            <></>
                          )}
                        </>
                      </>
                    ) : this.state.subtab === "distscore" ? (
                      <>
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
                                      <p className="h5 font-weight-bold">
                                        NER District SDG Index for Nagaland
                                        State
                                      </p>
                                    </Colxx>
                                    <Colxx lg="5"
                                      
                                      className="d-flex justify-content-center" 
                                    >
                                      
                                        
                                      <p className="h5 font-weight-bold text-center">
                                        {this.state.selectedMapDistrict?.value
                                          ? this.state.selectedMapDistrict
                                              ?.value
                                          : "Kohima"}{" "}
                                        District Scores for{" "}
                                        {this.state.selectedYear?.label}
                                      </p>
                                    </Colxx>
                                    <Colxx lg="1"  data-html2canvas-ignore="true">
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
                                                      this.clickHandlerScore(
                                                        "dist-score"
                                                      );
                                                    }, 1000);
                                                  }}
                                                >
                                                  As Image
                                                </DropdownItem>
                                                <DropdownItem
                                                  onClick={() => {
                                                    this.DistrcitGoalExport(
                                                      "dist-score",
                                                      `District Goal Score`
                                                    );
                                                  }}
                                                >
                                                  As Excel
                                                </DropdownItem>
                                              </DropdownMenu>
                                            </UncontrolledButtonDropdown>
                                          </div>
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
                                              Dimapur score is inclusive of
                                              Chumukedima & Niuland for the year
                                              2021-22 and 2022-23
                                            </p>
                                            <p className="d-flex align-items-center font-italic">
                                              <span
                                                className="d-block bg-dark rounded mr-1"
                                                style={{
                                                  width: "8px",
                                                  height: "8px",
                                                }}
                                              ></span>
                                              Kohima score is inclusive of
                                              Tseminyu for the year 2021-22 and
                                              2022-23
                                            </p>
                                            <p className="d-flex align-items-center font-italic">
                                              <span
                                                className="d-block bg-dark rounded mr-1"
                                                style={{
                                                  width: "8px",
                                                  height: "8px",
                                                }}
                                              ></span>
                                              Tuensang score is inclusive of
                                              Shamator & Noklak for the year
                                              2021-22
                                            </p>
                                            <p className="d-flex align-items-center font-italic">
                                              <span
                                                className="d-block bg-dark rounded mr-1 "
                                                style={{
                                                  width: "8px",
                                                  height: "8px",
                                                }}
                                              ></span>
                                              Tuensang score is inclusive of
                                              Shamator for the year 2022-23
                                            </p>
                                          </Row>
                                        </Colxx>
                                      </Row>
                                    </Colxx>
                                    <Colxx lg="6" className="pt-4 font-weight-bold" id="dist-score" >
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

                                    <Colxx lg="12" className="p-5">
                                      <>
                                        {this.state.difComparisonData &&
                                        this.state.sifComparisonData ? (
                                          <Row className="mt-3">
                                            <Colxx lg="3">
                                              <div className="form-group ">
                                                <Label htmlFor="policy">
                                                  Graph Type
                                                </Label>
                                                <Select
                                                  options={[
                                                    // {
                                                    //   label: "Nagaland vs District",
                                                    //   value: "nvd",
                                                    // },
                                                    {
                                                      label:
                                                        "District vs District",
                                                      value: "dvd",
                                                    },
                                                  ]}
                                                  value={
                                                    this.state
                                                      .difComparisonGraphType
                                                  }
                                                  onChange={(val) => {
                                                    this.setState({
                                                      difComparisonGraphType:
                                                        val,
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
                                                        this.state
                                                          .selDIFCompDist2
                                                          ?.label
                                                    )
                                                    .map((state) => {
                                                      return {
                                                        label: state.name,
                                                        value: state.name,
                                                      };
                                                    })}
                                                  value={
                                                    this.state.selDIFCompDist1
                                                  }
                                                  onChange={
                                                    this
                                                      .handleChangeSelDIFCompDist1
                                                  }
                                                />
                                              </div>
                                            </Colxx>
                                            <Colxx lg="3">
                                              {this.state.difComparisonGraphType
                                                ?.value[0] === "d" ? (
                                                <div className="form-group ">
                                                  <Label htmlFor="policy">
                                                    Select District
                                                  </Label>
                                                  <Select
                                                    options={this.state.districts
                                                      ?.filter(
                                                        (val) =>
                                                          val.name !==
                                                          this.state
                                                            .selDIFCompDist1
                                                            ?.label
                                                      )
                                                      .map((state) => {
                                                        return {
                                                          label: state.name,
                                                          value: state.name,
                                                        };
                                                      })}
                                                    value={
                                                      this.state.selDIFCompDist2
                                                    }
                                                    onChange={
                                                      this
                                                        .handleChangeSelDIFCompDist2
                                                    }
                                                  />
                                                </div>
                                              ) : (
                                                <></>
                                              )}
                                            </Colxx>

                                            <Colxx
                                              lg="12"
                                              className="mb-4 mt-4"
                                            >
                                              <Card>
                                                <CardBody
                                                  className="h-100"
                                                  id="dashchart6"
                                                >
                                                  <Row>
                                                    <Colxx>
                                                      <h2 className="text-center">
                                                        <span className="ml-3 mt-3 font-weight-bold">
                                                          District Comparison
                                                          Chart
                                                        </span>
                                                      </h2>
                                                    </Colxx>
                                                    <Colxx lg="2" data-html2canvas-ignore="true">
                                                      <div className="mr-0 float-right">
                                                        <UncontrolledButtonDropdown
                                                          color="link"
                                                          direction="left"
                                                        >
                                                          <DropdownToggle
                                                            color="link"
                                                            style={{
                                                              color:
                                                                "rgb(50, 50, 50)",
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
                                                                setTimeout(
                                                                  () => {
                                                                    this.clickHandler(
                                                                      "dashchart6"
                                                                    );
                                                                  },
                                                                  1000
                                                                );
                                                              }}
                                                            >
                                                              As Image
                                                            </DropdownItem>
                                                            <DropdownItem
                                                              onClick={() => {
                                                                this.handleExcelDownload(
                                                                  "dashchart6",
                                                                  `District Comparison Chart`
                                                                );
                                                              }}
                                                            >
                                                              As Excel
                                                            </DropdownItem>
                                                          </DropdownMenu>
                                                        </UncontrolledButtonDropdown>
                                                      </div>
                                                    </Colxx>
                                                  </Row>

                                                  <Chart
                                                    ref={(reference) =>
                                                      (this.chartRef =
                                                        reference)
                                                    }
                                                    key={
                                                      String(
                                                        this.state
                                                          .selDIFCompDist1
                                                          ?.value
                                                      ) +
                                                      String(
                                                        this.state
                                                          .selDIFCompDist2
                                                          ?.value
                                                      )
                                                    }
                                                    height={75}
                                                    labels={
                                                      this.state.goalsName
                                                    }
                                                    data={{
                                                      labels:
                                                        this.state.goalsName,
                                                      datasets: [
                                                        {
                                                          type: "bar",
                                                          label: `${this.state.selDIFCompDist1?.label} Score`,
                                                          color: "#000000",
                                                          backgroundColor:
                                                            "rgb(162, 25, 66)",
                                                          data: this.state
                                                            .difComparisonData[
                                                            this.state
                                                              .selDIFCompDist1
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
                                                              .difComparisonGraphType
                                                              ?.value[0] === "n"
                                                              ? "Nagaland"
                                                              : this.state
                                                                  .selDIFCompDist2
                                                                  ?.label
                                                          } Score`,
                                                          color: "#000000",
                                                          backgroundColor:
                                                            "rgb(76, 159, 56)",
                                                          data:
                                                            this.state
                                                              .difComparisonGraphType
                                                              ?.value[0] === "n"
                                                              ? this.state
                                                                  .sifComparisonData[
                                                                  "Nagaland"
                                                                ]
                                                              : this.state
                                                                  .difComparisonData[
                                                                  this.state
                                                                    .selDIFCompDist2
                                                                    ?.label
                                                                ],
                                                                borderColor:
                                                                "rgb(0, 0, 0)",
                                                                 tension: 0.1,
                                                          // borderColor: "white",
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
                                                              weight: "bold",
                                                            },
                                                          },
                                                          ticks: {
                                                            color: "#000000",
                                                            font: {
                                                              size : 10,
                                                              weight: 'bold',
                                                            },
                                                          },
                                                        },
                                                        yAxes: {
                                                          title: {
                                                            display: true,
                                                            text: "Score",
                                                            color: "#000000",
                                                            font: {
                                                              size: 15,
                                                              weight: "bold",
                                                            },
                                                          },
                                                          ticks: {
                                                            font: {
                                                              color: "#000000",
                                                              weight: 'bold',
                                                            },
                                                          },
                                                        },
                                                      },
                                                    }}
                                                    plugins={[
                                                      {
                                                        id: "legendMargin",
                                                        beforeInit(
                                                          chart,
                                                          legend,
                                                          options
                                                        ) {
                                                          const fitvalue =
                                                            chart.legend.fit;
                                                          chart.legend.fit =
                                                            function fit() {
                                                              fitvalue.bind(
                                                                chart.legend
                                                              )();
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
                          ) : (
                            <></>
                          )}
                        </>
                      </>
                    ) : this.state.subtab === "stategraph" ? (
                      <>
                        <>
                          {this.state.historySIFData &&
                          this.state.historyTargetsDIF ? (
                            <>
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
                                    <CardBody className="h-100" id="dashchart4">
                                      <Row>
                                        <Colxx lg="10">
                                          <h2 className="text-center  font-weight-bold">
                                            <span className="ml-3 mt-3">
                                              Historical Graph for Nagaland{" "}
                                              {this.state.historySIFType
                                                ?.value === "goal"
                                                ? this.state.historySIFGoal
                                                    ?.value
                                                : this.state.historySIFIndicator
                                                    ?.value}{" "}
                                              {/* for {this.state.selectedYear?.label} */}
                                            </span>
                                          </h2>
                                        </Colxx>

                                        <Colxx lg="2" data-html2canvas-ignore="true">
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
                                                      this.clickHandler(
                                                        "dashchart4"
                                                      );
                                                    }, 1000);
                                                  }}
                                                >
                                                  As Image
                                                </DropdownItem>
                                                <DropdownItem
                                                  onClick={() => {
                                                    this.handleExcelDownload(
                                                      "dashchart4",
                                                      `Historical Scores for Nagaland ${
                                                        this.state
                                                          .historySIFType
                                                          ?.value === "goal"
                                                          ? this.state
                                                              .historySIFGoal
                                                              ?.value
                                                          : this.state
                                                              .historySIFIndicator
                                                              ?.value
                                                      }`
                                                    );
                                                  }}
                                                >
                                                  As Excel
                                                </DropdownItem>
                                              </DropdownMenu>
                                            </UncontrolledButtonDropdown>
                                          </div>
                                        </Colxx>
                                      </Row>

                                      <Chart
                                        ref={(reference) =>
                                          (this.chartRef = reference)
                                        }
                                        key={
                                          String(
                                            this.state.historySIFGoal?.value
                                          ) +
                                          String(
                                            this.state.historySIFIndicator
                                              ?.value
                                          )
                                        }
                                        height={75}
                                        data={{
                                          labels: this.state.historySIFData[
                                            this.state.historySIFGoal?.label
                                          ]
                                            ? this.state.historySIFType
                                                ?.value === "goal"
                                              ? this.state.historySIFData[
                                                  this.state.historySIFGoal
                                                    ?.label
                                                ]["goal"]?.labels
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
                                                  : this.state
                                                      .historySIFIndicator
                                                      ?.label
                                              } Score`,
                                              font: {
                                                weight: "bold",
                                              },
                                              color: "#000000",
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
                                                        this.state
                                                          .historySIFGoal?.label
                                                      ]["indicator"][
                                                        this.state
                                                          .historySIFIndicator
                                                          ?.label
                                                      ]
                                                      ? this.state
                                                          .historySIFData[
                                                          this.state
                                                            .historySIFGoal
                                                            ?.label
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
                                          ].concat(
                                            this.state.historySIFType?.value ===
                                              "indicator"
                                              ? [
                                                  {
                                                    type: "line",
                                                    label: `Target`,
                                                    font: {
                                                      weight: "bold",
                                                    },
                                                    color: "#000000",
                                                    // backgroundColor: "rgb(162, 25, 66)",
                                                    data: this.state
                                                      .historySIFData[
                                                      this.state.historySIFGoal
                                                        ?.label
                                                    ]
                                                      ? this.state
                                                          .historySIFType
                                                          ?.value === "goal"
                                                        ? this.state
                                                            .historySIFData[
                                                            this.state
                                                              .historySIFGoal
                                                              ?.label
                                                          ]["goal"]?.labels
                                                        : this.state
                                                            .historySIFData[
                                                            this.state
                                                              .historySIFGoal
                                                              ?.label
                                                          ]
                                                        ? this.state
                                                            .historySIFData[
                                                            this.state
                                                              .historySIFGoal
                                                              ?.label
                                                          ]["indicator"]
                                                          ? this.state
                                                              .historySIFData[
                                                              this.state
                                                                .historySIFGoal
                                                                ?.label
                                                            ]["indicator"][
                                                              this.state
                                                                .historySIFIndicator
                                                                ?.label
                                                            ]
                                                            ? this.state.historySIFData[
                                                                this.state
                                                                  .historySIFGoal
                                                                  ?.label
                                                              ]["indicator"][
                                                                this.state
                                                                  .historySIFIndicator
                                                                  ?.label
                                                              ]?.labels?.map(
                                                                (lb) => {
                                                                  return this
                                                                    .state
                                                                    .historySIFType
                                                                    ?.value ===
                                                                    "indicator"
                                                                    ? this.state
                                                                        .historyTargetsSIF[
                                                                        this
                                                                          .state
                                                                          .historySIFGoal
                                                                          ?.label
                                                                      ]
                                                                      ? this
                                                                          .state
                                                                          .historyTargetsSIF[
                                                                          this
                                                                            .state
                                                                            .historySIFGoal
                                                                            ?.label
                                                                        ][
                                                                          this
                                                                            .state
                                                                            .historySIFIndicator
                                                                            ?.label
                                                                        ]
                                                                        ? this
                                                                            .state
                                                                            .historyTargetsSIF[
                                                                            this
                                                                              .state
                                                                              .historySIFGoal
                                                                              ?.label
                                                                          ][
                                                                            this
                                                                              .state
                                                                              .historySIFIndicator
                                                                              ?.label
                                                                          ][lb]
                                                                          ? this
                                                                              .state
                                                                              .historyTargetsSIF[
                                                                              this
                                                                                .state
                                                                                .historySIFGoal
                                                                                ?.label
                                                                            ][
                                                                              this
                                                                                .state
                                                                                .historySIFIndicator
                                                                                ?.label
                                                                            ][
                                                                              lb
                                                                            ]
                                                                          : 0
                                                                        : 0
                                                                      : 0
                                                                    : 0;
                                                                }
                                                              )
                                                            : []
                                                          : []
                                                        : []
                                                      : [],
                                                    // data:
                                                    //   this.state.historySIFType
                                                    //     ?.value === "indicator"
                                                    //     ? this.state
                                                    //         .historyTargetsSIF[
                                                    //         this.state
                                                    //           .historySIFGoal
                                                    //           ?.label
                                                    //       ]
                                                    //       ? this.state
                                                    //           .historyTargetsSIF[
                                                    //           this.state
                                                    //             .historySIFGoal
                                                    //             ?.label
                                                    //         ][
                                                    //           this.state
                                                    //             .historySIFIndicator
                                                    //             ?.label
                                                    //         ]
                                                    //         ? this.state
                                                    //             .historyTargetsSIF[
                                                    //             this.state
                                                    //               .historySIFGoal
                                                    //               ?.label
                                                    //           ][
                                                    //             this.state
                                                    //               .historySIFIndicator
                                                    //               ?.label
                                                    //           ].data
                                                    //         : []
                                                    //       : []
                                                    //     : [],
                                                    fill: false,
                                                    borderColor: "#DC3545",
                                                    tension: 0.1,
                                                  },
                                                ]
                                              : []
                                          ),
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
                                                text: "Score",
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
                              <>
                                {this.state.sifComparisonData ? (
                                  <Row className="mt-5">
                                    <Colxx lg="3">
                                      <div className="form-group ">
                                        <Label htmlFor="policy">
                                          Graph Type
                                        </Label>
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
                                          value={
                                            this.state.sifComparisonGraphType
                                          }
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
                                        <Label htmlFor="policy">
                                          Select State
                                        </Label>
                                        <Select
                                          options={this.state.states
                                            ?.filter(
                                              (val) =>
                                                val.name !==
                                                this.state.selSIFCompState2
                                                  ?.label
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
                                                  this.state.selSIFCompState1
                                                    ?.label
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
                                        <CardBody
                                          className="h-100"
                                          id="dashchart3"
                                        >
                                          <Row>
                                            <Colxx lg="10">
                                              <h2 className="text-center">
                                                <span className="ml-3 mt-3 font-weight-bold">
                                                  State Comparison Chart
                                                </span>
                                              </h2>
                                            </Colxx>

                                            <Colxx lg="2" data-html2canvas-ignore="true">
                                              <div className="mr-0 float-right ">
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
                                                      As Image
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
                                              </div>
                                            </Colxx>
                                          </Row>
                                          <Chart
                                            ref={(reference) =>
                                              (this.chartRef = reference)
                                            }
                                            key={
                                              String(
                                                this.state.selSIFCompState1
                                                  ?.value
                                              ) +
                                              String(
                                                this.state.selSIFCompState2
                                                  ?.value
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
                                                      : this.state
                                                          .selSIFCompState2
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
                                                            .selSIFCompState2
                                                            ?.label
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
                                                      size: 10,
                                                    },
                                                  },
                                                },
                                                yAxes: {
                                                  title: {
                                                    display: true,
                                                    text: "Score",
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
                                              },
                                            }}
                                            plugins={[
                                              {
                                                id: "legendMargin",
                                                beforeInit(
                                                  chart,
                                                  legend,
                                                  options
                                                ) {
                                                  const fitvalue =
                                                    chart.legend.fit;
                                                  chart.legend.fit =
                                                    function fit() {
                                                      fitvalue.bind(
                                                        chart.legend
                                                      )();
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

                              <Row className="d-flex justify-content-center mt-3">
                                <Colxx lg="11">
                                  <Row>
                                    <p className="d-flex align-items-center">
                                      <span
                                        className="d-block bg-dark rounded mr-1"
                                        style={{
                                          width: "8px",
                                          height: "8px",
                                        }}
                                      ></span>{" "}
                                      Certain Indicators are only for a
                                      particular year
                                    </p>
                                  </Row>
                                </Colxx>
                              </Row>
                            </>
                          ) : (
                            <></>
                          )}
                        </>
                      </>
                    ) : this.state.subtab === "distgraph" ? (
                      <>
                        {/* <h6 style={{color: "rgb(220, 53, 69)"}}>Click the Goal Icons to see the data of the particular goal</h6> */}
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
                                      <Row>
                                     
                                        <Colxx className="d-flex justify-content-center">
                                          <h2>
                                            <span className="ml-3 mt-3 font-weight-bold">
                                           {this.state.selDIFIndicatorDist.value} District Indicator scores 11   for{" "}
                                              {this.state.selectedYear?.label} :{" "}
                                              {this.state.filter}
                                            </span>
                                          </h2>
                                        </Colxx>
                                          <Colxx lg="2" data-html2canvas-ignore="true">
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
                                                          this.clickHandler(
                                                            "dashchart5"
                                                          );
                                                        }, 1000);
                                                      }}
                                                    >
                                                      As Image
                                                    </DropdownItem>
                                                    <DropdownItem
                                                      onClick={() => {
                                                        this.handleExcelDownloadExport(
                                                          "dashchart5",
                                                          `District Indicator scores`
                                                        );
                                                      }}
                                                    >
                                                      As Excel
                                                    </DropdownItem>
                                                  </DropdownMenu>
                                                </UncontrolledButtonDropdown>
                                              </div>
                                            </Colxx>
                                        
                                      </Row>
                                      <Row className="d-flex justify-content-around text-center border-bottom pb-2 font-weight-bold h5 mt-2">
                                        <Colxx lg="2">Indicator</Colxx>
                                      <Colxx lg="2">Department</Colxx>
                                      <Colxx lg="2">Scheme</Colxx>
                                      <Colxx lg="2">Data</Colxx>
                                      <Colxx lg="2">Category</Colxx>
                                      <Colxx lg="2">Target</Colxx>
                                      </Row>
                                      {this.state.difIndicators[
                                        this.state.filter
                                      ]?.map((lb, index) => {
                                        return (
                                          <>
                                            <Row className="border-bottom my-1 p-1">
                                              <Colxx lg="4" className="font-weight-bold">
                                                {this.state.difIndicatorComment[
                                                  lb
                                                ]
                                                  ? this.state
                                                      .difIndicatorComment[lb]
                                                  : lb}
                                              </Colxx>
                                              <Colxx
                                                lg="4"
                                                className="text-center font-weight-bold"
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
                                                className="text-center font-weight-bold"
                                              >
                                                {this.state.historyTargetsDIF[
                                                  this.state.filter
                                                ]
                                                  ? this.state
                                                      .historyTargetsDIF[
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
                                                          this.state
                                                            .selectedYear?.value
                                                        ]
                                                      : 0
                                                    : 0
                                                  : 0}
                                              </Colxx>
                                            </Row>
                                          </>
                                        );
                                      })}
                                    </CardBody>
                                  </Card>
                                </Colxx>
                              </Row>
                            </>
                          ) : (
                            <></>
                          )}
                        </>
                      </>
                    )  :
                    (
                      <></>
                    )}
                  </Colxx>
                  <Colxx lg="1" className="back_img"></Colxx>
                </Row>
                {this.props.isDash ? <></> : <DashFooter />}
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
