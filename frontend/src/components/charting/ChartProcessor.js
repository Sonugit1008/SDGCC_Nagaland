import _ from "lodash";
import moment from "moment-timezone";

export const countWise = (logs, count_attr, count_val_attrs) => {
  // get the list of unique count_attr in log

  // get attr only log
  if (logs) {
    if (logs.length > 0) {
      let attr_only_log = logs.map((log) => log[count_attr]);
      let xaxis_vals = _.uniqWith(attr_only_log, _.isEqual);
      let yaxis_vals = count_val_attrs.map((count_val_attr) =>
        xaxis_vals.map((attr) => {
          let count = 0;
          _.forEach(_.filter(logs, [count_attr, attr]), function (value) {
            count = count + value[count_val_attr];
          });
          // console.log(count);
          return count;
        })
      );

      return { labels: xaxis_vals, values: yaxis_vals };
    }
  }

  return { labels: [], values: [] };
};

export const countWiseAtrribute = (
  logs,
  count_attr,
  attr_val,
  count_val_attrs
) => {
  // get the list of unique count_attr in log

  // get attr only log
  if (logs) {
    if (logs.length > 0) {
      let attr_only_log = logs.map((log) => log[count_attr]);
      let xaxis_vals = _.uniqWith(attr_only_log, _.isEqual);
      let yaxis_vals = count_val_attrs.map((count_val_attr) =>
        xaxis_vals.map((attr) => {
          let count = 0;
          _.forEach(_.filter(logs, [count_attr, attr]), function (value) {
            // console.log(value[attr_val]);
            // console.log(count_val_attr);
            if (value[attr_val] === count_val_attr) {
              count = count + 1;
            }
          });
          // console.log(count);
          return count;
        })
      );

      return { labels: xaxis_vals, values: yaxis_vals };
    }
  }

  return { labels: [], values: [] };
};

export const countWiseAvg = (logs, count_attr, count_val_attrs) => {
  // get the list of unique count_attr in log

  // get attr only log
  if (logs) {
    if (logs.length > 0) {
      let attr_only_log = logs.map((log) => log[count_attr]);
      let xaxis_vals = _.uniqWith(attr_only_log, _.isEqual);
      let yaxis_vals = count_val_attrs.map((count_val_attr) =>
        xaxis_vals.map((attr) => {
          let count = 0;
          let number = 1;
          _.forEach(_.filter(logs, [count_attr, attr]), function (value) {
            count = count + value[count_val_attr];
            number = number + 1;
          });
          // console.log(count);
          return Math.floor(count / number);
        })
      );

      return { labels: xaxis_vals, values: yaxis_vals };
    }
  }

  return { labels: [], values: [] };
};

export const timeWise = (
  logs,
  count_attr,
  time_attr,
  count_val_attrs,
  time_split_minutes,
  label
) => {
  // split start and end time into time_split_minute chunks , this is x axis

  // assume the log is time ordered  and get start and end time
  if (logs) {
    if (logs.length > 0) {
      let xaxis_vals = [];
      if (label) {
        for (var i = label?.start; i <= label?.end; i++) xaxis_vals.push(i);
      } else {
        for (var j = 0; j <= 23; j++) xaxis_vals.push(j);
      }

      let attr_only_log = logs.map((log) => log[count_attr]);
      let unique_count_attrs = _.uniqWith(attr_only_log, _.isEqual);

      // merge count_atre and count_val_Attr

      let yaxis_vals = count_val_attrs.map((count_val_attr) => {
        return {
          [count_val_attr]: unique_count_attrs.map((unique_attr) => {
            return {
              label: unique_attr,
              data: xaxis_vals.map((attr) => {
                let count = 0;
                _.forEach(
                  _.filter(logs, [count_attr, unique_attr]),
                  function (value) {
                    if (moment(value[time_attr]).hour() === attr) {
                      count = count + value[count_val_attr];
                    }
                  }
                );
                return count;
              }),
            };
          }),
        };
      });

      return { labels: xaxis_vals, values: yaxis_vals };
    } else {
    }
  }
  return { labels: [], values: [] };
};

export const monthWise = (
  logs,
  count_attr,
  time_attr,
  count_val_attrs,
  time_split_minutes
) => {
  // split start and end time into time_split_minute chunks , this is x axis

  // assume the log is time ordered  and get start and end time
  if (logs) {
    if (logs.length > 0) {
      let xaxis_vals = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
        20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
      ];

      let attr_only_log = logs.map((log) => log[count_attr]);
      let unique_count_attrs = _.uniqWith(attr_only_log, _.isEqual);

      // merge count_atre and count_val_Attr

      let yaxis_vals = count_val_attrs.map((count_val_attr) => {
        return {
          [count_val_attr]: unique_count_attrs.map((unique_attr) => {
            return {
              label: unique_attr,
              data: xaxis_vals.map((attr) => {
                let count = 0;
                _.forEach(
                  _.filter(logs, [count_attr, unique_attr]),
                  function (value) {
                    if (Number(moment(value[time_attr]).format("D")) === attr) {
                      count = count + value[count_val_attr];
                    }
                  }
                );
                return count;
              }),
            };
          }),
        };
      });

      return { labels: xaxis_vals, values: yaxis_vals };
    } else {
    }
  }
  return { labels: [], values: [] };
};

export const timeWiseOcc = (
  logs,
  count_attr,
  time_attr,
  count_val_attrs,
  time_split_minutes
) => {
  // split start and end time into time_split_minute chunks , this is x axis

  // assume the log is time ordered  and get start and end time
  if (logs) {
    if (logs.length > 0) {
      let xaxis_vals = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
        20, 21, 22, 23,
      ];

      let attr_only_log = logs.map((log) => log[count_attr]);
      let unique_count_attrs = _.uniqWith(attr_only_log, _.isEqual);

      // merge count_atre and count_val_Attr

      let yaxis_vals = count_val_attrs.map((count_val_attr) => {
        return {
          [count_val_attr]: unique_count_attrs.map((unique_attr) => {
            return {
              label: unique_attr,
              data: xaxis_vals.map((attr) => {
                let count = 0;
                _.forEach(
                  _.filter(logs, [count_attr, unique_attr]),
                  function (value) {
                    if (value[time_attr] === attr) {
                      count = count + value[count_val_attr];
                    }
                  }
                );
                return count;
              }),
            };
          }),
        };
      });

      return { labels: xaxis_vals, values: yaxis_vals };
    } else {
    }
  }
  return { labels: [], values: [] };
};

export const compliancetimeWise = (
  logs,
  count_attr,
  time_attr,
  time_split_minutes
) => {
  if (logs) {
    if (logs.length > 0) {
      let xaxis_vals = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
        20, 21, 22, 23,
      ];

      let attr_only_log = logs.map((log) => log[count_attr]);
      let unique_count_attrs = _.uniqWith(attr_only_log, _.isEqual);

      let yaxis_vals = unique_count_attrs.map((unique_attr) => {
        return {
          label: unique_attr,
          data: xaxis_vals.map((attr) => {
            let count = 0;
            _.forEach(
              _.filter(logs, [count_attr, unique_attr]),
              function (value) {
                if (moment(value.count_time).hour() === attr) {
                  count = count + 1;
                }
              }
            );
            return count;
          }),
        };
      });
      return { labels: xaxis_vals, values: yaxis_vals };
    } else {
    }
  }
  return { labels: [], values: [] };
};

export const complianceMonthWise = (
  logs,
  count_attr,
  time_attr,
  time_split_minutes
) => {
  if (logs) {
    if (logs.length > 0) {
      let xaxis_vals = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
        20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
      ];

      let attr_only_log = logs.map((log) => log[count_attr]);
      let unique_count_attrs = _.uniqWith(attr_only_log, _.isEqual);

      let yaxis_vals = unique_count_attrs.map((unique_attr) => {
        return {
          label: unique_attr,
          data: xaxis_vals.map((attr) => {
            let count = 0;
            _.forEach(
              _.filter(logs, [count_attr, unique_attr]),
              function (value) {
                if (Number(moment(value.count_time).format("D")) === attr) {
                  count = count + 1;
                }
              }
            );
            return count;
          }),
        };
      });
      return { labels: xaxis_vals, values: yaxis_vals };
    } else {
    }
  }
  return { labels: [], values: [] };
};

export const ANPRtimeWise = (
  logs,
  count_attr,
  time_attr,
  time_split_minutes,
  label
) => {
  if (logs) {
    if (logs.length > 0) {
      let xaxis_vals = [];
      if (label) {
        for (var i = label?.start; i <= label?.end; i++) xaxis_vals.push(i);
      } else {
        for (var j = 0; j <= 23; j++) xaxis_vals.push(j);
      }

      let barData = [];
      let lineData = [];
      xaxis_vals.forEach((attr) => {
        let count = 0;
        let timeDiff = 0;
        let prev_log_time = null;

        _.forEach(
          _.filter(_.sortBy(logs, ["check_time"]), ["facility", count_attr]),
          function (value) {
            if (moment(value.check_time).hour() === attr) {
              count = count + 1;
              if (prev_log_time === null) prev_log_time = value.check_time;
              else {
                let diff = Math.abs(
                  Math.round(
                    (new Date(value.check_time).getTime() -
                      new Date(prev_log_time).getTime()) /
                      1000 /
                      60
                  )
                );

                timeDiff = timeDiff + diff;
                prev_log_time = value.check_time;
              }
            }
          }
        );
        barData.push(count);
        if (count > 0) {
          lineData.push(Math.round(timeDiff / count));
        } else {
          lineData.push(0);
        }
      });

      let yaxis_vals = [
        {
          type: "line",
          label: "Avg Filling Time(in minutes)",
          data: lineData,
        },
        {
          type: "bar",
          label: "Total Vehicles",
          data: barData,
        },
      ];
      return { labels: xaxis_vals, values: yaxis_vals };
    } else {
    }
  }
  return { labels: [], values: [] };
};

// ANPR Dash functions

export const ANPRTimeWiseBarLine = (
  mode,
  logs,
  sector,
  count_direction,
  label
) => {
  console.log("ANPR timewise processed");
  if (logs) {
    let preObj = ANPRtimeWise(logs, mode, ["check_time"], 60, label);
    console.log("ANPR timewise labels", preObj.values);
    if (preObj.values.length > 0) {
      let backgroundcolors = [
        "#f39233",
        "#b8de6f",
        "#01c5c4",
        "#ffe05d",
        "#d3ffd1",
        "#ffd299",
        "#ccfbff",
        "#ffeedd",
        "#ded0ff",
        "#fd7e1c",
        "#d82b78",
      ];

      let dataVals = preObj.values;

      let backgroundCount = -1;
      const data = {
        labels: preObj.labels,
        datasets: dataVals.map((count) => {
          if (backgroundCount > backgroundcolors.length - 1) {
            backgroundCount = 0;
          } else {
            backgroundCount = backgroundCount + 1;
          }
          return {
            type: count.type,
            label: count.label,
            fill: false,
            lineTension: 0.1,
            backgroundColor: backgroundcolors[backgroundCount],
            borderColor: backgroundcolors[backgroundCount],
            borderCapStyle: "butt",
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            pointBorderColor: backgroundcolors[backgroundCount],
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: backgroundcolors[backgroundCount],
            pointHoverBorderColor: backgroundcolors[backgroundCount],
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: count.data,
          };
        }),
      };

      return { data: data };
    }
  }
  return { data: {} };
};

// Compliance Dash functions

export const ComplianceTimeWiseLine = (mode, logs, sector, count_direction) => {
  console.log("compliance timewise processed");
  if (logs) {
    let preObj = compliancetimeWise(logs, mode, ["count_time"], 60);
    console.log("compliance timewise labels", preObj.values);
    if (preObj.values.length > 0) {
      let backgroundcolors = [
        "#f39233",
        "#b8de6f",
        "#01c5c4",
        "#ffe05d",
        "#d3ffd1",
        "#ffd299",
        "#ccfbff",
        "#ffeedd",
        "#ded0ff",
        "#fd7e1c",
        "#d82b78",
      ];

      let dataVals = preObj.values;

      let backgroundCount = -1;
      const data = {
        labels: preObj.labels,
        datasets: dataVals.map((count) => {
          if (backgroundCount > backgroundcolors.length - 1) {
            backgroundCount = 0;
          } else {
            backgroundCount = backgroundCount + 1;
          }
          return {
            label:
              mode === "sector" ? sector[count.label].sector_name : count.label,
            fill: false,
            lineTension: 0.1,
            backgroundColor: backgroundcolors[backgroundCount],
            borderColor: backgroundcolors[backgroundCount],
            borderCapStyle: "butt",
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            pointBorderColor: backgroundcolors[backgroundCount],
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: backgroundcolors[backgroundCount],
            pointHoverBorderColor: backgroundcolors[backgroundCount],
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: count.data,
          };
        }),
      };

      return { data: data };
    }
  }
  return { data: {} };
};

export const ComplianceMonthWiseLine = (
  mode,
  logs,
  sector,
  count_direction
) => {
  console.log("compliance monthwise processed");
  if (logs) {
    let preObj = complianceMonthWise(logs, mode, ["count_time"], 60);

    console.log("compliance monthwise label values", preObj.values);
    if (preObj.values.length > 0) {
      let backgroundcolors = [
        "#f39233",
        "#b8de6f",
        "#01c5c4",
        "#ffe05d",
        "#d3ffd1",
        "#ffd299",
        "#ccfbff",
        "#ffeedd",
        "#ded0ff",
        "#fd7e1c",
        "#d82b78",
      ];

      let dataVals = preObj.values;

      let backgroundCount = -1;
      const data = {
        labels: preObj.labels,
        datasets: dataVals.map((count) => {
          if (backgroundCount > backgroundcolors.length - 1) {
            backgroundCount = 0;
          } else {
            backgroundCount = backgroundCount + 1;
          }
          return {
            label:
              mode === "sector" ? sector[count.label].sector_name : count.label,
            fill: false,
            lineTension: 0.1,
            backgroundColor: backgroundcolors[backgroundCount],
            borderColor: backgroundcolors[backgroundCount],
            borderCapStyle: "butt",
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            pointBorderColor: backgroundcolors[backgroundCount],
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: backgroundcolors[backgroundCount],
            pointHoverBorderColor: backgroundcolors[backgroundCount],
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: count.data,
          };
        }),
      };

      return { data: data };
    }
  }
  return { data: {} };
};

// People Count Dash functions

export const peopleCountWiseBar = (mode, logs, sector, floor, facility) => {
  let data = {};
  //console.log("log data");
  //console.log(logs);
  if (logs) {
    let preObj = countWise(logs, mode, ["count_in", "count_out"]);

    data = {
      labels: preObj.labels.map((label) => {
        if (mode === "sector") {
          return sector[label].sector_name;
        } else if (mode === "floor") {
          return label;
        } else if (mode === "facility") {
          return label;
        }
        return "";
      }),
    };

    let datasets = [
      {
        label: "Count In",
        type: "bar",
        data: preObj.values[0],
        fill: false,
        borderColor: "#f39233",
        backgroundColor: "#f39233",
        pointBorderColor: "#EC932F",
        pointBackgroundColor: "#EC932F",
        pointHoverBackgroundColor: "#EC932F",
        pointHoverBorderColor: "#EC932F",
      },
      {
        type: "bar",
        label: "Count Out",
        data: preObj.values[1],
        fill: false,
        backgroundColor: "#b8de6f",
        borderColor: "#b8de6f",
        hoverBackgroundColor: "#71B37C",
        hoverBorderColor: "#71B37C",
        pointHoverBackgroundColor: "#EC932F",
        pointHoverBorderColor: "#EC932F",
      },
    ];

    data["datasets"] = datasets;
    return { data: data, options: peopleCountOptions(data.labels) };
  }

  return { data: data, options: {} };
};

export const PeopleCountWisePie = (mode, logs, sector, count_direction) => {
  let data = {};
  //console.log("count direction");
  //console.log(count_direction);
  if (logs) {
    let preObj = countWise(logs, mode, [count_direction]);

    //console.log("pre obj data");
    //console.log(preObj);

    const data = {
      labels: preObj.labels.map((label) => {
        if (mode === "sector") {
          return sector[label].sector_name;
        } else if (mode === "floor") {
          return label;
        } else if (mode === "facility") {
          return label;
        }
        return "";
      }),
      datasets: [
        {
          data: preObj.values[0],
          backgroundColor: [
            "#f39233",
            "#b8de6f",

            "#01c5c4",
            "#ffe05d",
            "#d3ffd1",
            "#ffd299",
            "#ccfbff",
            "#ffeedd",
            "#ded0ff",
            "#fd7e1c",
            "#d82b78",
            "#942dbd",
            "#ffdb74",
            "#15b4a3",
          ],
          hoverBackgroundColor: [
            "#f39233",
            "#b8de6f",

            "#01c5c4",
            "#ffe05d",
            "#d3ffd1",
            "#ffd299",
            "#ccfbff",
            "#ffeedd",
            "#ded0ff",
            "#fd7e1c",
            "#d82b78",
            "#942dbd",
            "#ffdb74",
            "#15b4a3",
          ],
        },
      ],
    };

    return { data: data };
  }
  return data;
};

export const PeopleTimeWiseLine = (
  mode,
  logs,
  sector,
  count_direction,
  label
) => {
  console.log("timewise processed");
  if (logs) {
    let preObj = timeWise(
      logs,
      mode,
      ["count_time"],
      ["count_in", "count_out"],
      60,
      label
    );
    console.log("timewise labels");
    console.log(preObj.values);
    console.log(preObj.values);
    if (preObj.values.length > 0) {
      let backgroundcolors = [
        "#f39233",
        "#b8de6f",
        "#01c5c4",
        "#ffe05d",
        "#d3ffd1",
        "#ffd299",
        "#ccfbff",
        "#ffeedd",
        "#ded0ff",
        "#fd7e1c",
        "#d82b78",
      ];
      let count_no = 0;
      let dataVals = preObj.values[count_no].count_in;
      if (count_direction === "count_out") {
        count_no = 1;
        dataVals = preObj.values[1].count_out;
      }
      let backgroundCount = -1;
      const data = {
        labels: preObj.labels,
        datasets: dataVals.map((count) => {
          if (backgroundCount > backgroundcolors.length - 1) {
            backgroundCount = 0;
          } else {
            backgroundCount = backgroundCount + 1;
          }
          return {
            label:
              mode === "sector" ? sector[count.label].sector_name : count.label,
            fill: false,
            lineTension: 0.1,
            backgroundColor: backgroundcolors[backgroundCount],
            borderColor: backgroundcolors[backgroundCount],
            borderCapStyle: "butt",
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            pointBorderColor: backgroundcolors[backgroundCount],
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: backgroundcolors[backgroundCount],
            pointHoverBorderColor: backgroundcolors[backgroundCount],
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: count.data,
          };
        }),
      };

      return { data: data };
    }
  }
  return { data: {} };
};

export const PeopleMonthWiseLine = (mode, logs, sector, count_direction) => {
  console.log("timewise processed");
  if (logs) {
    let preObj = monthWise(
      logs,
      mode,
      ["count_time"],
      ["count_in", "count_out"],
      60
    );
    console.log("timewise labels");
    console.log(preObj.values);
    console.log(preObj.values);
    if (preObj.values.length > 0) {
      let backgroundcolors = [
        "#f39233",
        "#b8de6f",
        "#01c5c4",
        "#ffe05d",
        "#d3ffd1",
        "#ffd299",
        "#ccfbff",
        "#ffeedd",
        "#ded0ff",
        "#fd7e1c",
        "#d82b78",
      ];
      let count_no = 0;
      let dataVals = preObj.values[count_no].count_in;
      if (count_direction === "count_out") {
        count_no = 1;
        dataVals = preObj.values[1].count_out;
      }
      let backgroundCount = -1;
      const data = {
        labels: preObj.labels,
        datasets: dataVals.map((count) => {
          if (backgroundCount > backgroundcolors.length - 1) {
            backgroundCount = 0;
          } else {
            backgroundCount = backgroundCount + 1;
          }
          return {
            label:
              mode === "sector" ? sector[count.label].sector_name : count.label,
            fill: false,
            lineTension: 0.1,
            backgroundColor: backgroundcolors[backgroundCount],
            borderColor: backgroundcolors[backgroundCount],
            borderCapStyle: "butt",
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            pointBorderColor: backgroundcolors[backgroundCount],
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: backgroundcolors[backgroundCount],
            pointHoverBorderColor: backgroundcolors[backgroundCount],
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: count.data,
          };
        }),
      };

      return { data: data };
    }
  }
  return { data: {} };
};

export const peopleCountOptions = (labels) => {
  const options = {
    tooltips: {
      mode: "label",
    },
    elements: {
      line: {
        fill: false,
      },
    },
    scales: {
      xAxes: [
        {
          display: true,
          gridLines: {
            display: false,
          },

          labels: labels,
          backgroundColor: "#71B37C",
        },
      ],
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
          display: true,
          position: "left",
          id: "y-axis-1",
          gridLines: {
            display: false,
          },
          labels: {
            show: true,
          },
        },
      ],
    },
  };
  return options;
};

// people occupancy functions

export const peopleOccupancyWiseBar = (mode, logs, sector, floor, facility) => {
  let data = {};
  //console.log("log data");
  //console.log(logs);
  if (logs) {
    if (logs.length) {
      // pre process logs for the most recent value
      console.log("sector log");
      console.log(logs);
      let attr_only_log = logs.map((log) => log["zone_id"]);
      console.log(attr_only_log);
      let xaxis_vals = _.uniqWith(attr_only_log, _.isEqual);
      // eslint-disable-next-line
      let finallog = xaxis_vals.map((val) => {
        for (let i = logs.length - 1; i > -1; i--) {
          if (logs[i]["zone_id"] === val) {
            return logs[i];
          }
        }
      });

      console.log("people occupany final log");
      console.log(finallog);
      let preObj = countWise(finallog, mode, [
        "recent_count",
        "max_occupancy",
        "recent_chair",
      ]);
      data = {
        labels: preObj.labels.map((label) => {
          if (mode === "sector") {
            return sector[label].sector_name;
          } else if (mode === "floor") {
            return label;
          } else if (mode === "facility") {
            return label;
          }
          return label;
        }),
      };
      let count = -1;
      let leftover_occ = preObj.values[1].map((val) => {
        count++;
        return val - preObj.values[0][count];
      });

      let datasets = [
        {
          label: "Count",
          type: "bar",
          data: preObj.values[0],
          fill: false,
          borderColor: "#EC932F",
          backgroundColor: "#EC932F",
          pointBorderColor: "#EC932F",
          pointBackgroundColor: "#EC932F",
          pointHoverBackgroundColor: "#EC932F",
          pointHoverBorderColor: "#EC932F",
        },
        {
          type: "bar",
          label: "Spare Occupancy",
          data: leftover_occ,
          fill: false,
          backgroundColor: "#71B37C",
          borderColor: "#71B37C",
          hoverBackgroundColor: "#71B37C",
          hoverBorderColor: "#71B37C",
        },
        {
          type: "bar",
          label: "Chairs",
          data: preObj.values[2],
          fill: false,
          backgroundColor: "#ccfbff",
          borderColor: "#71B37C",
          hoverBackgroundColor: "#ccfbff",
          hoverBorderColor: "#71B37C",
        },
      ];

      data["datasets"] = datasets;

      const options = {
        scales: {
          xAxes: [
            {
              stacked: true,
              labels: data.labels,
            },
          ],
          yAxes: [
            {
              stacked: true,
            },
          ],
        },
        tooltips: {
          callbacks: {
            title: function (tooltipItem, data) {
              return data.labels[tooltipItem[0].index];
            },
          },
        },
      };

      return { data: data, options: options };
    }
  }
  return { data: {}, options: {} };
};

export const PeopleOccupancyTimeWiseLine = (mode, logs, sector, timezone) => {
  if (logs) {
    if (logs.length) {
      // process the log

      let procLog = logs.map((log) => {
        return {
          zone: log.zone_id,
          sector: log.sector,
          floor: log.floor,
          facility: log.facility,
          avg_count: Math.floor(log.count / log.records),
          hour: moment(log.count_time).tz(timezone)._d.getHours(),
        };
      });

      console.log("processlog");
      console.log(procLog);

      let preObj = timeWiseOcc(procLog, mode, ["hour"], ["avg_count"], 60);

      let backgroundcolors = [
        "#ff8100",
        "#ffd6d6",
        "#ff9237",
        "#f9fddc",
        "#ffaf79",
        "#d3ffd1",
        "#ffd299",
        "#ccfbff",
        "#ffeedd",
        "#ded0ff",
        "#fd7e1c",
        "#d82b78",
        "#942dbd",
        "#ffdb74",
        "#15b4a3",
      ];
      let count_no = 0;
      let dataVals = preObj.values[count_no].avg_count;

      let backgroundCount = -1;
      const data = {
        labels: preObj.labels,
        datasets: dataVals.map((count) => {
          if (backgroundCount > backgroundcolors.length - 1) {
            backgroundCount = 0;
          } else {
            backgroundCount = backgroundCount + 1;
          }
          return {
            label:
              mode === "sector" ? sector[count.label].sector_name : count.label,
            fill: false,
            lineTension: 0.1,
            backgroundColor: backgroundcolors[backgroundCount],
            borderColor: backgroundcolors[backgroundCount],
            borderCapStyle: "butt",
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            pointBorderColor: backgroundcolors[backgroundCount],
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: backgroundcolors[backgroundCount],
            pointHoverBorderColor: backgroundcolors[backgroundCount],
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: count.data,
          };
        }),
      };

      return { data: data };
    }
  }
  return { data: {} };
};

// Age Gender functions
export const AgeGenderEmotionWiseBar = (mode, selector, logs, sector) => {
  if (logs) {
    if (logs.length) {
      if (selector === "age") {
        let preObj = countWise(logs, mode, [
          "age_1",
          "age_2",
          "age_3",
          "age_4",
          "age_5",
        ]);

        let data = {
          labels: preObj.labels.map((label) => {
            if (mode === "sector") {
              return sector[label].sector_name;
            } else if (mode === "floor") {
              return label;
            } else if (mode === "facility") {
              return label;
            }
            return "";
          }),
        };

        let datasets = [
          {
            label: "0-30",
            type: "bar",
            data: preObj.values[0],
            fill: false,
            borderColor: "#f39233",
            backgroundColor: "#f39233",
            pointBorderColor: "#EC932F",
            pointBackgroundColor: "#EC932F",
            pointHoverBackgroundColor: "#f39233",
            pointHoverBorderColor: "#f39233",
            yAxisID: "y-axis-1",
          },
          {
            type: "bar",
            label: "30-40",
            data: preObj.values[1],
            fill: false,
            backgroundColor: "#b8de6f",
            borderColor: "#b8de6f",
            hoverBackgroundColor: "#b8de6f",
            hoverBorderColor: "#b8de6f",
            yAxisID: "y-axis-1",
          },

          {
            type: "bar",
            label: "40-50",
            data: preObj.values[2],
            fill: false,
            backgroundColor: "#01c5c4",
            borderColor: "#01c5c4",
            hoverBackgroundColor: "#01c5c4",
            hoverBorderColor: "#01c5c4",
            yAxisID: "y-axis-1",
          },

          {
            type: "bar",
            label: "50-60",
            data: preObj.values[3],
            fill: false,
            backgroundColor: "#ffe05d",
            borderColor: "#ffe05d",
            hoverBackgroundColor: "#ffe05d",
            hoverBorderColor: "#ffe05d",
            yAxisID: "y-axis-1",
          },

          {
            type: "bar",
            label: "> 60",
            data: preObj.values[4],
            fill: false,
            backgroundColor: "#d3ffd1",
            borderColor: "#d3ffd1",
            hoverBackgroundColor: "#d3ffd1",
            hoverBorderColor: "#d3ffd1",
            yAxisID: "y-axis-1",
          },
        ];

        data["datasets"] = datasets;
        return { data: data, options: peopleCountOptions(data.labels) };
      } else if (selector === "gender") {
        let preObj = countWise(logs, mode, ["male", "female"]);
        let data = {
          labels: preObj.labels.map((label) => {
            if (mode === "sector") {
              return sector[label].sector_name;
            } else if (mode === "floor") {
              return label;
            } else if (mode === "facility") {
              return label;
            }
            return "";
          }),
        };

        let datasets = [
          {
            label: "Male",
            type: "bar",
            data: preObj.values[0],
            fill: false,
            borderColor: "#f39233",
            backgroundColor: "#f39233",
            pointBorderColor: "#EC932F",
            pointBackgroundColor: "#EC932F",
            pointHoverBackgroundColor: "#EC932F",
            pointHoverBorderColor: "#EC932F",
            yAxisID: "y-axis-1",
          },
          {
            type: "bar",
            label: "Female",
            data: preObj.values[1],
            fill: false,
            backgroundColor: "#f28dcd",
            borderColor: "#f28dcd",
            hoverBackgroundColor: "#f28dcd",
            hoverBorderColor: "#f28dcd",
            yAxisID: "y-axis-1",
          },
        ];

        data["datasets"] = datasets;
        return { data: data, options: peopleCountOptions(data.labels) };
      } else if (selector === "emotion") {
        let preObj = countWiseAvg(logs, mode, [
          "emotion_1",
          "emotion_2",
          "emotion_3",
          "emotion_4",
          "emotion_5",
        ]);

        let data = {
          labels: preObj.labels.map((label) => {
            if (mode === "sector") {
              return sector[label].sector_name;
            } else if (mode === "floor") {
              return label;
            } else if (mode === "facility") {
              return label;
            }
            return "";
          }),
        };

        let datasets = [
          {
            label: "Neutral",
            type: "bar",
            data: preObj.values[0],
            fill: false,
            borderColor: "#f39233",
            backgroundColor: "#f39233",
            pointBorderColor: "#EC932F",
            pointBackgroundColor: "#f39233",
            pointHoverBackgroundColor: "#f39233",
            pointHoverBorderColor: "#EC932F",
            yAxisID: "y-axis-1",
          },
          {
            type: "bar",
            label: "Happy",
            data: preObj.values[1],
            fill: false,
            backgroundColor: "#b8de6f",
            borderColor: "#b8de6f",
            hoverBackgroundColor: "#b8de6f",
            hoverBorderColor: "#b8de6f",
            yAxisID: "y-axis-1",
          },

          {
            type: "bar",
            label: "Sad",
            data: preObj.values[2],
            fill: false,
            backgroundColor: "#01c5c4",
            borderColor: "#01c5c4",
            hoverBackgroundColor: "#01c5c4",
            hoverBorderColor: "#01c5c4",
            yAxisID: "y-axis-1",
          },

          {
            type: "bar",
            label: "Surprise",
            data: preObj.values[3],
            fill: false,
            backgroundColor: "#ffe05d",
            borderColor: "#ffe05d",
            hoverBackgroundColor: "#ffe05d",
            hoverBorderColor: "#ffe05d",
            yAxisID: "y-axis-1",
          },

          {
            type: "bar",
            label: "Anger",
            data: preObj.values[4],
            fill: false,
            backgroundColor: "#d3ffd1",
            borderColor: "#d3ffd1",
            hoverBackgroundColor: "#d3ffd1",
            hoverBorderColor: "#d3ffd1",
            yAxisID: "y-axis-1",
          },
        ];

        data["datasets"] = datasets;
        return { data: data, options: peopleCountOptions(data.labels) };
      }
    }
  }

  return { data: {}, options: {} };
};

export const AgeGenderEmotionWisePie = (selector, logs) => {
  console.log(selector);
  if (selector === "age") {
    if (logs) {
      if (logs.length) {
        var age1 = 0;
        var age2 = 0;
        var age3 = 0;
        var age4 = 0;
        var age5 = 0;

        for (var i = 0; i < logs.length; i++) {
          age1 = age1 + logs[i].age_1;
          age2 = age2 + logs[i].age_2;
          age3 = age3 + logs[i].age_3;
          age4 = age4 + logs[i].age_4;
          age5 = age5 + logs[i].age_5;
        }
        console.log(selector);
        console.log([age1, age2, age3, age4, age5]);
        const data = {
          labels: ["0-30", "30-40", "40-50", "50-60", ">60"],
          datasets: [
            {
              data: [age1, age2, age3, age4, age5],
              backgroundColor: [
                "#f39233",
                "#b8de6f",

                "#01c5c4",
                "#ffe05d",
                "#d3ffd1",
                "#ffd299",
                "#ccfbff",
                "#ffeedd",
                "#ded0ff",
                "#fd7e1c",
                "#d82b78",
                "#942dbd",
                "#ffdb74",
                "#15b4a3",
              ],
              hoverBackgroundColor: [
                "#f39233",
                "#b8de6f",

                "#01c5c4",
                "#ffe05d",
                "#d3ffd1",
                "#ffd299",
                "#ccfbff",
                "#ffeedd",
                "#ded0ff",
                "#fd7e1c",
                "#d82b78",
                "#942dbd",
                "#ffdb74",
                "#15b4a3",
              ],
            },
          ],
        };

        return { data: data };
      }
    }
  } else if (selector === "gender") {
    if (logs) {
      if (logs.length) {
        var male = 0;
        var female = 0;

        for (var j = 0; j < logs.length; j++) {
          male = male + logs[j].male;
          female = female + logs[j].female;
        }

        const data = {
          labels: ["Male", "Female"],
          datasets: [
            {
              data: [male, female],
              backgroundColor: [
                "#f39233",
                "#b8de6f",

                "#01c5c4",
                "#ffe05d",
                "#d3ffd1",
                "#ffd299",
                "#ccfbff",
                "#ffeedd",
                "#ded0ff",
                "#fd7e1c",
                "#d82b78",
                "#942dbd",
                "#ffdb74",
                "#15b4a3",
              ],
              hoverBackgroundColor: [
                "#f39233",
                "#b8de6f",

                "#01c5c4",
                "#ffe05d",
                "#d3ffd1",
                "#ffd299",
                "#ccfbff",
                "#ffeedd",
                "#ded0ff",
                "#fd7e1c",
                "#d82b78",
                "#942dbd",
                "#ffdb74",
                "#15b4a3",
              ],
            },
          ],
        };

        return { data: data };
      }
    }
  } else if (selector === "emotion") {
    if (logs) {
      if (logs.length) {
        var emotion_1 = 0;
        var emotion_2 = 0;
        var emotion_3 = 0;
        var emotion_4 = 0;
        var emotion_5 = 0;

        for (var k = 0; k < logs.length; k++) {
          emotion_1 = emotion_1 + logs[k].emotion_1;
          emotion_2 = emotion_2 + logs[k].emotion_2;
          emotion_3 = emotion_3 + logs[k].emotion_3;
          emotion_4 = emotion_4 + logs[k].emotion_4;
          emotion_5 = emotion_5 + logs[k].emotion_5;
        }

        emotion_1 = Math.floor(emotion_1 / logs.length);
        emotion_2 = Math.floor(emotion_2 / logs.length);
        emotion_3 = Math.floor(emotion_3 / logs.length);
        emotion_4 = Math.floor(emotion_4 / logs.length);
        emotion_5 = Math.floor(emotion_5 / logs.length);

        console.log(selector);
        console.log([emotion_1, emotion_2, emotion_3, emotion_4, emotion_5]);
        const data = {
          labels: ["Neutral", "Happy", "Sad", "Surprise", "Anger"],
          datasets: [
            {
              data: [emotion_1, emotion_2, emotion_3, emotion_4, emotion_5],
              backgroundColor: [
                "#f39233",
                "#b8de6f",

                "#01c5c4",
                "#ffe05d",
                "#d3ffd1",
                "#ffd299",
                "#ccfbff",
                "#ffeedd",
                "#ded0ff",
                "#fd7e1c",
                "#d82b78",
                "#942dbd",
                "#ffdb74",
                "#15b4a3",
              ],
              hoverBackgroundColor: [
                "#f39233",
                "#b8de6f",

                "#01c5c4",
                "#ffe05d",
                "#d3ffd1",
                "#ffd299",
                "#ccfbff",
                "#ffeedd",
                "#ded0ff",
                "#fd7e1c",
                "#d82b78",
                "#942dbd",
                "#ffdb74",
                "#15b4a3",
              ],
            },
          ],
        };

        return { data: data };
      }
    }
  }

  return { data: {} };
};

// Parking Functions

export const ParkingyWiseBar = (mode, logs, sector, floor, facility) => {
  let data = {};
  //console.log("log data");
  //console.log(logs);
  if (logs) {
    if (logs.length) {
      // pre process logs for the most recent value
      console.log("sector log");
      console.log(logs);
      let attr_only_log = logs.map((log) => log["zone_id"]);
      console.log(attr_only_log);
      let xaxis_vals = _.uniqWith(attr_only_log, _.isEqual);
      // eslint-disable-next-line
      let finallog = xaxis_vals.map((val) => {
        for (let i = logs.length - 1; i > -1; i--) {
          if (logs[i]["zone_id"] === val) {
            return logs[i];
          }
        }
      });

      console.log("people occupany final log");
      console.log(finallog);
      let preObj = countWise(finallog, mode, ["recent_count", "max_occupancy"]);
      data = {
        labels: preObj.labels.map((label) => {
          if (mode === "sector") {
            return sector[label].sector_name;
          } else if (mode === "floor") {
            return label;
          } else if (mode === "facility") {
            return label;
          }
          return label;
        }),
      };
      let count = -1;
      let leftover_occ = preObj.values[1].map((val) => {
        count++;
        return val - preObj.values[0][count];
      });

      let datasets = [
        {
          label: "Parked",
          type: "bar",
          data: preObj.values[0],
          fill: false,
          borderColor: "#EC932F",
          backgroundColor: "#EC932F",
          pointBorderColor: "#EC932F",
          pointBackgroundColor: "#EC932F",
          pointHoverBackgroundColor: "#EC932F",
          pointHoverBorderColor: "#EC932F",
        },
        {
          type: "bar",
          label: "Available",
          data: leftover_occ,
          fill: false,
          backgroundColor: "#71B37C",
          borderColor: "#71B37C",
          hoverBackgroundColor: "#71B37C",
          hoverBorderColor: "#71B37C",
        },
      ];

      data["datasets"] = datasets;

      const options = {
        scales: {
          xAxes: [
            {
              stacked: true,
              labels: data.labels,
            },
          ],
          yAxes: [
            {
              stacked: true,
            },
          ],
        },
        tooltips: {
          callbacks: {
            title: function (tooltipItem, data) {
              return data.labels[tooltipItem[0].index];
            },
          },
        },
      };

      return { data: data, options: options };
    }
  }
  return { data: {}, options: {} };
};

export const ParkingTimeWiseLine = (mode, logs, sector, timezone) => {
  if (logs) {
    if (logs.length) {
      // process the log

      let procLog = logs.map((log) => {
        return {
          zone: log.zone_id,
          sector: log.sector,
          floor: log.floor,
          facility: log.facility,
          avg_count: Math.floor(log.count / log.records),
          hour: moment(log.count_time).tz(timezone)._d.getHours(),
        };
      });

      let preObj = timeWiseOcc(procLog, mode, ["hour"], ["avg_count"], 60);

      let backgroundcolors = [
        "#ff8100",
        "#ffd6d6",
        "#ff9237",
        "#f9fddc",
        "#ffaf79",
        "#d3ffd1",
        "#ffd299",
        "#ccfbff",
        "#ffeedd",
        "#ded0ff",
        "#fd7e1c",
        "#d82b78",
        "#942dbd",
        "#ffdb74",
        "#15b4a3",
      ];

      let count_no = 0;
      let dataVals = preObj.values[count_no].avg_count;

      let backgroundCount = -1;
      const data = {
        labels: preObj.labels,
        datasets: dataVals.map((count) => {
          if (backgroundCount > backgroundcolors.length - 1) {
            backgroundCount = 0;
          } else {
            backgroundCount = backgroundCount + 1;
          }
          return {
            label:
              mode === "sector" ? sector[count.label].sector_name : count.label,
            fill: false,
            lineTension: 0.1,
            backgroundColor: backgroundcolors[backgroundCount],
            borderColor: backgroundcolors[backgroundCount],
            borderCapStyle: "butt",
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            pointBorderColor: backgroundcolors[backgroundCount],
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: backgroundcolors[backgroundCount],
            pointHoverBorderColor: backgroundcolors[backgroundCount],
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: count.data,
          };
        }),
      };

      return { data: data };
    }
  }
  return { data: {} };
};
