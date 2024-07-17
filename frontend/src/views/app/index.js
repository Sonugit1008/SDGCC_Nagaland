import React, { Component, Suspense } from "react";
import { Route, withRouter, Switch, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import AppLayout from "../../layout/AppLayout";
import ChangePassword from "../user/ChangePassword";
import Profile from "../user/Profile";
import UserManagement from "../user/UserManagement";
import UserAdd from "../user/UserAdd";
import UserEdit from "../user/UserEdit";
import UserUpload from "../user/UserUpload";
import WebForm from "../NewDataEntry/WebForm";
import UploadData from "../NewDataEntry/UploadData";
import Departments from "../Departments/Departments";
import Goals from "../Goals/Goals";
import Targets from "../Targets/Targets";
import DataEntries from "../DataEntries/DataEntries";
import ViewUnits from "../Unit/ViewUnits";
import AddUnit from "../Unit/AddUnit";
import Schemes from "../Schemes/Schemes";
import AddScheme from "../Schemes/AddScheme";
import Locations from "../Location/Locations";
import AddLocation from "../Location/AddLocation";
import Periodicity from "../Periodicity/Periodicity";
import Indicator from "../IndicatorMaster/Indicator";
import AddPeriodicity from "../Periodicity/AddPeriodicity";
import AddDepartment from "../Departments/AddDepartment";
import AddIndicator from "../IndicatorMaster/AddIndicator";
import AddDistrict from "../Location/AddDistrict";
import AddState from "../Location/AddState";
import AddGoal from "../Goals/AddGoal";
import UploadIndicator from "../IndicatorMaster/UploadIndicator";
import FAQs from "../FAQ/faqs";
import Goalmaster from "../GoalsMaster/Goalmaster";
import AddScore from "../NewDataEntry/AddScore";
import AddFaq from "../FAQ/AddFaq";
import NationalScores from "../Scores/NationalScores";
import StateScores from "../Scores/StateScores";
import DIFScores from "../Scores/DIFScores";
import Districts from "../Location/Districts";
import States from "../Location/States";
import AddNewScore from "../New Scores/AddNewScore";
import DataStatus from "../New Scores/DataStatus";
import ApproveData from "../New Scores/ApproveData";
import NERSDGDash from "../PublicDashboard/DashBoard/NERSDG";
import GetReports from "../Reports/GetReports";
import DeptScheme from "../Reports/DeptScheme";
import PerformingDistricts from "../Reports/PerformingDistricts";
import CriticalDistricts from "../Reports/CriticalDistricts";
import PerformingIndicator from "../Reports/PerformingIndicator";
import CriticalIndicator from "../Reports/CriticalIndicator";
import DistrictRanks from "../Location/DistrictRanks/DistrictRanks";
import AddDistrictRank from "../Location/DistrictRanks/AddDistrictRank";
import PerformingIndicatorDistrict from "../Reports/PerformingIndicatorDistrict";
import CriticalIndicatorDistrict from "../Reports/CriticalIndicatorDistrict";
import AspirantReport from "../Reports/AspirantReport";
import PerformerReport from "../Reports/PerformerReport";
import AchieverReport from "../Reports/AchieverReport";
import FrontRunnerReport from "../Reports/FrontRunnerReport";
import NoTargetReport from "../Reports/NoTargetReport";
import menuItems from "../../constants/routedata";


import Protype from "../Protype/AddNewScore";
import ProIndictor from "../Protype/Indicator";
import AddIndicatorValue from "../Protype/AddIndicatorValue";


const Gogo = React.lazy(() =>
  import(/* webpackChunkName: "viwes-gogo" */ "./smartsight")
);
const SecondMenu = React.lazy(() =>
  import(/* webpackChunkName: "viwes-second-menu" */ "./second-menu")
);
const BlankPage = React.lazy(() =>
  import(/* webpackChunkName: "viwes-b lank-page" */ "./blank-page")
);

const isCanAccessRoute = (roles, path) => {
  let flag = true;

  for (var i = 0; i < roles?.length; i++) {
    if (menuItems[roles[i]]?.includes(path)) {
      flag = false;
      return;
    }
  }

  return flag;
};

const AuthRoute = ({
  roles,
  component: Component,
  path: path,
  url: url,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      path={path}
      render={(props) =>
        isCanAccessRoute(roles, url) ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/app/sdg/dashboard",
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};

class App extends Component {
  render() {
    const { match } = this.props;
    return (
      <AppLayout>
        <div className="dashboard-wrapper">
          <Suspense fallback={<div className="loading" />}>
            <Switch>
              <Redirect exact from={`${match.url}/`} to={`${match.url}/sdg`} />

              <AuthRoute
                roles={this.props.roles}
                url={"/sdg"}
                path={`${match.url}/sdg`}
                component={Gogo}
              />

              <AuthRoute
                roles={this.props.roles}
                url={"/second-menu"}
                path={`${match.url}/second-menu`}
                component={SecondMenu}
              />
              <AuthRoute
                roles={this.props.roles}
                url={"/blank-page"}
                path={`${match.url}/blank-page`}
                component={BlankPage}
              />

              <AuthRoute
                roles={this.props.roles}
                url={"/newdata/addscore/"}
                path={`${match.url}/newdata/addscore/`}
                component={AddScore}
              />

              <AuthRoute
                roles={this.props.roles}
                url={"/newdata/webform/"}
                path={`${match.url}/newdata/webform/`}
                component={WebForm}
              />

              <AuthRoute
                roles={this.props.roles}
                url={"/newdata/upload/"}
                path={`${match.url}/newdata/upload/`}
                component={UploadData}
              />

              {/* <AuthRoute
                roles={this.props.roles}
                url={"/departments/"}
                path={`${match.url}/departments/`}
                component={Departments}
              /> */}

              <AuthRoute
                roles={this.props.roles}
                url={"/department/add/"}
                path={`${match.url}/department/add/`}
                component={AddDepartment}
              />

              <AuthRoute
                roles={this.props.roles}
                url={"/department/"}
                path={`${match.url}/department/`}
                component={Departments}
              />

              <AuthRoute
                roles={this.props.roles}
                url={"/goalsmaster/add"}
                path={`${match.url}/goalsmaster/add`}
                component={AddGoal}
              />

              <AuthRoute
                roles={this.props.roles}
                url={"/goalsmaster/"}
                path={`${match.url}/goalsmaster/`}
                component={Goalmaster}
              />

              {/* <AuthRoute
                roles={this.props.roles}
                url={"/goals/add/"}
                path={`${match.url}/goals/add/`}
                component={AddGoal}
              /> */}

              {/* <AuthRoute
                roles={this.props.roles}
                url={"/goals/"}
                path={`${match.url}/goals/`}
                component={Goals}
              /> */}

              {/* <AuthRoute
                roles={this.props.roles}
                url={"/nersdg/"}
                path={`${match.url}/nersdg/`}
                component={NERSDGDash}
              /> */}

              <AuthRoute
                roles={this.props.roles}
                url={"/faqs/add/"}
                path={`${match.url}/faqs/add/`}
                component={AddFaq}
              />

              <AuthRoute
                roles={this.props.roles}
                url={"/faqs/"}
                path={`${match.url}/faqs/`}
                component={FAQs}
              />

              <AuthRoute
                roles={this.props.roles}
                url={"/periodicity/add/"}
                path={`${match.url}/periodicity/add/`}
                component={AddPeriodicity}
              />

              <AuthRoute
                roles={this.props.roles}
                url={"/periodicity/"}
                path={`${match.url}/periodicity/`}
                component={Periodicity}
              />

              {/* <AuthRoute
                roles={this.props.roles}
                url={"/indicators/upload/"}
                path={`${match.url}/indicators/upload/`}
                component={UploadIndicator}
              /> */}

              <AuthRoute
                roles={this.props.roles}
                url={"/indicators/add/"}
                path={`${match.url}/indicators/add/`}
                component={AddIndicator}
              />

              <AuthRoute
                roles={this.props.roles}
                url={"/indicators/"}
                path={`${match.url}/indicators/`}
                component={Indicator}
              />

              <AuthRoute
                roles={this.props.roles}
                url={"/targets/"}
                path={`${match.url}/targets/`}
                component={Targets}
              />

              {/* <AuthRoute
                roles={this.props.roles}
                url={"/dataentry/"}
                path={`${match.url}/dataentry/`}
                component={DataEntries}
              /> */}

              <AuthRoute
                roles={this.props.roles}
                url={"/unit/add/"}
                path={`${match.url}/unit/add/`}
                component={AddUnit}
              />

              <AuthRoute
                roles={this.props.roles}
                url={"/unit/"}
                path={`${match.url}/unit/`}
                component={ViewUnits}
              />

              <AuthRoute
                roles={this.props.roles}
                url={"/scheme/add/"}
                path={`${match.url}/scheme/add/`}
                component={AddScheme}
              />

              <AuthRoute
                roles={this.props.roles}
                url={"/scheme/"}
                path={`${match.url}/scheme/`}
                component={Schemes}
              />

              <AuthRoute
                roles={this.props.roles}
                url={"/score/dif"}
                path={`${match.url}/score/dif`}
                component={DIFScores}
              />

              <AuthRoute
                roles={this.props.roles}
                url={"/score/state"}
                path={`${match.url}/score/state`}
                component={StateScores}
              />

              <AuthRoute
                roles={this.props.roles}
                url={"/score/national"}
                path={`${match.url}/score/national`}
                component={NationalScores}
              />

              <AuthRoute
                roles={this.props.roles}
                url={"/location/add/"}
                path={`${match.url}/location/add/`}
                component={AddLocation}
              />

              <AuthRoute
                roles={this.props.roles}
                url={"/location/district/"}
                path={`${match.url}/location/district/`}
                component={AddDistrict}
              />

              <AuthRoute
                roles={this.props.roles}
                url={"/location/state/"}
                path={`${match.url}/location/state/`}
                component={AddState}
              />

              <AuthRoute
                roles={this.props.roles}
                url={"/location/"}
                path={`${match.url}/location/`}
                component={Locations}
              />

              <AuthRoute
                roles={this.props.roles}
                url={"/districtrank/add"}
                path={`${match.url}/districtrank/add`}
                component={AddDistrictRank}
              />

              <AuthRoute
                roles={this.props.roles}
                url={"/districtrank/"}
                path={`${match.url}/districtrank/`}
                component={DistrictRanks}
              />

              <AuthRoute
                roles={this.props.roles}
                url={"/district/add"}
                path={`${match.url}/district/add`}
                component={AddDistrict}
              />

              <AuthRoute
                roles={this.props.roles}
                url={"/district/"}
                path={`${match.url}/district/`}
                component={Districts}
              />

              <AuthRoute
                roles={this.props.roles}
                url={"/state/add"}
                path={`${match.url}/state/add`}
                component={AddState}
              />

              <AuthRoute
                roles={this.props.roles}
                url={"/state/"}
                path={`${match.url}/state/`}
                component={States}
              />

              <AuthRoute
                roles={this.props.roles}
                url={"/report/get"}
                path={`${match.url}/report/get`}
                component={GetReports}
              />

              <AuthRoute
                roles={this.props.roles}
                url={"/report/deptscheme"}
                path={`${match.url}/report/deptscheme`}
                component={DeptScheme}
              />

              <AuthRoute
                roles={this.props.roles}
                url={"/report/performing/district"}
                path={`${match.url}/report/performing/district`}
                component={PerformingDistricts}
              />

              <AuthRoute
                roles={this.props.roles}
                url={"/report/critical/district"}
                path={`${match.url}/report/critical/district`}
                component={CriticalDistricts}
              />

              <AuthRoute
                roles={this.props.roles}
                url={"/report/performing/indicator"}
                path={`${match.url}/report/performing/indicator`}
                component={PerformingIndicator}
              />

              <AuthRoute
                roles={this.props.roles}
                url={"/report/critical/indicator"}
                path={`${match.url}/report/critical/indicator`}
                component={CriticalIndicator}
              />

              <AuthRoute
                roles={this.props.roles}
                url={"/report/performing/districtindicator"}
                path={`${match.url}/report/performing/districtindicator`}
                component={PerformingIndicatorDistrict}
              />

              <AuthRoute
                roles={this.props.roles}
                url={"/report/critical/districtindicator"}
                path={`${match.url}/report/critical/districtindicator`}
                component={CriticalIndicatorDistrict}
              />

              <AuthRoute
                roles={this.props.roles}
                url={"/report/aspirant"}
                path={`${match.url}/report/aspirant`}
                component={AspirantReport}
              />

              <AuthRoute
                roles={this.props.roles}
                url={"/report/performer"}
                path={`${match.url}/report/performer`}
                component={PerformerReport}
              />

              <AuthRoute
                roles={this.props.roles}
                url={"/report/achiever"}
                path={`${match.url}/report/achiever`}
                component={AchieverReport}
              />

              <AuthRoute
                roles={this.props.roles}
                url={"/report/frontrunner"}
                path={`${match.url}/report/frontrunner`}
                component={FrontRunnerReport}
              />

              <AuthRoute
                roles={this.props.roles}
                url={"/report/notarget"}
                path={`${match.url}/report/notarget`}
                component={NoTargetReport}
              />

              <AuthRoute
                roles={this.props.roles}
                url={"/newdata/addnewscore/"}
                path={`${match.url}/newdata/addnewscore/`}
                component={AddNewScore}
              />

              <AuthRoute
                roles={this.props.roles}
                url={"/newdata/scorestatus/"}
                path={`${match.url}/newdata/scorestatus/`}
                component={DataStatus}
              />

              <AuthRoute
                roles={this.props.roles}
                url={"/newdata/approve/"}
                path={`${match.url}/newdata/approve/`}
                component={ApproveData}
              />

              <AuthRoute
                roles={this.props.roles}
                url={"/user/changepassword"}
                path={`${match.url}/user/changepassword`}
                component={ChangePassword}
              />

              <AuthRoute
                roles={this.props.roles}
                url={"/userprofile"}
                path={`${match.url}/userprofile`}
                component={Profile}
              />

              {/* {this.props.roles.includes("superadmin") ||
              this.props.roles.includes("company_admin") ? ( */}
              <AuthRoute
                roles={this.props.roles}
                url={"/userupload"}
                path={`${match.url}/userupload`}
                component={UserUpload}
              />
              {/* ) : null}

              {this.props.roles.includes("superadmin") ||
              this.props.roles.includes("company_admin") ? ( */}
              <AuthRoute
                roles={this.props.roles}
                url={"/usermanagement/add"}
                path={`${match.url}/usermanagement/add`}
                component={UserAdd}
              />
              {/* ) : null}
              {this.props.roles.includes("superadmin") ||
              this.props.roles.includes("company_admin") ? ( */}
              <AuthRoute
                roles={this.props.roles}
                url={"/usermanagement/edituser/:userID"}
                path={`${match.url}/usermanagement/edituser/:userID`}
                component={UserEdit}
              />
              {/* ) : null}
              {this.props.roles.includes("superadmin") ||
              this.props.roles.includes("company_admin") ? ( */}
              <AuthRoute
                roles={this.props.roles}
                url={"/usermanagement"}
                path={`${match.url}/usermanagement`}
                component={UserManagement}
              />


<AuthRoute
                roles={this.props.roles}
                url={"/protype/addscore/"}
                path={`${match.url}/protype/addscore/`}
                component={Protype}
              />

              <AuthRoute
                roles={this.props.roles}
                url={"protype/indicator/"}
                path={`${match.url}/protype/indicator/`}
                component={ProIndictor}
              />

              <AuthRoute
                roles={this.props.roles}
                url={"protype/addindicatorvalue/"}
                path={`${match.url}/protype/addindicatorvalue/`}
                component={AddIndicatorValue}
              />
              {/* ) : null} */}

              <Redirect to="/error" />
            </Switch>
          </Suspense>
        </div>
      </AppLayout>
    );
  }
}
const mapStateToProps = ({ menu, authUser }) => {
  const { containerClassnames } = menu;
  const { roles, user_id } = authUser;
  return { containerClassnames, roles, user_id, authUser };
};

export default withRouter(connect(mapStateToProps, {})(App));
