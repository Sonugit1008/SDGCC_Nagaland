import { countWise, timeWise } from "../ChartProcessor";
import moment from "moment-timezone";

describe("Process Log Counting", () => {
  const logPayload = [
    {
      floor: 1,
      sector: 1,
      count_time: "2020-05-26T17:13:16Z",
      count_direction: "out",
      count_in: 1,
      count_out: 1,
      setting_id: 95,
    },
    {
      floor: 1,
      sector: 1,
      count_time: "2020-05-26T18:12:16Z",
      count_direction: "out",
      count_in: 1,
      count_out: 0,
      setting_id: 95,
    },
    {
      floor: 1,
      sector: 1,
      count_time: "2020-05-26T19:12:16Z",
      count_direction: "out",
      count_in: 0,
      count_out: 1,
      setting_id: 95,
    },
    {
      floor: 1,
      sector: 1,
      count_time: "2020-05-26T20:12:16Z",
      count_direction: "out",
      count_in: 1,
      count_out: 0,
      setting_id: 95,
    },
    {
      floor: 1,
      sector: 2,
      count_time: "2020-05-26T20:12:16Z",
      count_direction: "out",
      count_in: 1,
      count_out: 0,
      setting_id: 95,
    },

    {
      floor: 1,
      sector: 2,
      count_time: "2020-05-26T19:12:16Z",
      count_direction: "out",
      count_in: 1,
      count_out: 0,
      setting_id: 95,
    },
  ];

  const reportPayload = [];

  it("returns the sector count correctly", () => {
    const report = countWise(logPayload, "sector", ["count_in", "count_out"]);

    expect(report.labels).toEqual([1, 2]);
    expect(report.values[0]).toEqual([3, 2]);
    expect(report.values[1]).toEqual([2, 0]);
  });

  it("returns the Floor count correctly", () => {
    const report = countWise(logPayload, "floor", ["count_in", "count_out"]);

    expect(report.labels).toEqual([1]);
    expect(report.values[0]).toEqual([5]);
    expect(report.values[1]).toEqual([2]);
  });

  it("returns time split correctly", () => {
    let start_time = moment("2020-05-26T17:12:16Z");
    let end_time = moment("2020-05-26T20:12:16Z");

    const report = timeWise(
      logPayload,
      "floor",
      "count_time",
      ["count_in", "count_out"],
      60,
      start_time,
      end_time
    );

    expect(report.labels.length).toEqual(4);
  });

  it("returns time values correctly", () => {
    let start_time = moment("2020-05-26T17:12:16Z");
    let end_time = moment("2020-05-26T20:12:16Z");

    const report = timeWise(
      logPayload,
      "floor",
      "count_time",
      ["count_in", "count_out"],
      60,
      start_time,
      end_time
    );

    expect(report.values[0]).toEqual({ count_in: [{ 1: [1, 1, 1, 2] }] });
  });
});
