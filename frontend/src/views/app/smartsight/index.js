import React, { Suspense } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import MainDashboard from "../MainDashboard";

const ss = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      {console.log(match.url)}
      <Redirect exact from={`${match.url}/`} to={`${match.url}/dashboard`} />
      <Route
        path={`${match.url}/dashboard`}
        render={(props) => <MainDashboard {...props} />}
      />

      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default ss;
