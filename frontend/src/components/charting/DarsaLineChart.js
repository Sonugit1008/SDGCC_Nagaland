import React, { Component, Fragment } from "react";

import { Button, Card, CardBody, ButtonGroup } from "reactstrap";
import { Line } from "react-chartjs-2";
import {
	ComplianceTimeWiseLine,
	ComplianceMonthWiseLine,
	PeopleTimeWiseLine,
	PeopleOccupancyTimeWiseLine,
	PeopleMonthWiseLine,
} from "./ChartProcessor";
import { connect } from "react-redux";

class DashLineChart extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currentMode: "facility",
			countDirection: "count_in",
		};
	}

	render() {
		return (
			<Card>
				<CardBody>
					<h2>
						<span className="ml-3 mt-3">{this.props.title}</span>

						{this.props.mode === "peoplecount" || this.props.mode === "peoplecountmonthly" ? (
							<Fragment>
								<ButtonGroup className="ml-4 mb-4">
									<Button
										className="btn-header-light"
										onClick={() => {
											this.setState({ countDirection: "count_in" });
										}}
										active={this.state.countDirection === "count_in"}
										size="sm"
										value="Count IN"
									>
										Count In
									</Button>
									<Button
										className="btn-header-light"
										onClick={() => {
											this.setState({ countDirection: "count_out" });
										}}
										active={this.state.countDirection === "count_out"}
										size="sm"
										value="Count Out"
									>
										Count Out
									</Button>
								</ButtonGroup>
							</Fragment>
						) : (
							<Fragment></Fragment>
						)}

						<ButtonGroup className="float-right ml-4 mb-4">
							{this.props.mode === "peopleoccupancy" ? (
								<Button
									className="btn-header-light"
									onClick={() => {
										this.setState({ currentMode: "zone" });
									}}
									active={this.state.currentMode === "zone"}
									size="sm"
									value="Zone"
								>
									Zone
								</Button>
							) : (
								<Fragment></Fragment>
							)}
							
							<Button
								className="btn-header-light"
								onClick={() => {
									this.setState({ currentMode: "sector" });
								}}
								active={this.state.currentMode === "sector"}
								size="sm"
								value="Sector"
							>
								Sector
							</Button>
							<Button
								className="btn-header-light"
								onClick={() => {
									this.setState({ currentMode: "floor" });
								}}
								active={this.state.currentMode === "floor"}
								size="sm"
								value="Floor"
							>
								Floor
							</Button>
							<Button
								className="btn-header-light"
								onClick={() => {
									this.setState({ currentMode: "facility" });
								}}
								active={this.state.currentMode === "facility"}
								size="sm"
								value="Facility"
							>
								Facility
							</Button>
						</ButtonGroup>
					</h2>

					{this.props.mode === "peoplecount" ? (
						<Line
							height={75}
							{...PeopleTimeWiseLine(
								this.state.currentMode,
								this.props.dashData,
								this.props.sector,
								this.state.countDirection,
								this.props.label
							)}
						/>
					) : (
						<Fragment></Fragment>
					)}
					{this.props.mode === "compliance" ? (
						<Line
							height={75}
							{...ComplianceTimeWiseLine(
								this.state.currentMode,
								this.props.dashData,
								this.props.sector,
								this.state.countDirection
							)}
						/>
					) : (
						<Fragment></Fragment>
					)}
					{this.props.mode === "compliancemonthly" ? (
						<Line
							height={75}
							{...ComplianceMonthWiseLine(
								this.state.currentMode,
								this.props.dashData,
								this.props.sector,
								this.state.countDirection
							)}
						/>
					) : (
						<Fragment></Fragment>
					)}
					{this.props.mode === "peoplecountmonthly" ? (
						<Line
							height={75}
							{...PeopleMonthWiseLine(
								this.state.currentMode,
								this.props.dashData,
								this.props.sector,
								this.state.countDirection
							)}
						/>
					) : (
						<Fragment></Fragment>
					)}

					{this.props.mode === "peopleoccupancy" ? (
						<Fragment>
							{" "}
							<Line
								height={75}
								{...PeopleOccupancyTimeWiseLine(
									this.state.currentMode,
									this.props.dashData,
									this.props.sector,
									this.props.timezone
								)}
							/>
						</Fragment>
					) : (
						<Fragment></Fragment>
					)}
				</CardBody>
			</Card>
		);
	}
}

DashLineChart.propTypes = {
	// gets the log list
	// get sectorlist
	// get floorlist
	// get facilitylist
	// get display attribute/s
};

const mapStateToProps = ({ authUser }) => {
	const { timezone } = authUser;

	return {
		timezone: timezone,
	};
};

export default connect(mapStateToProps, null)(DashLineChart);
