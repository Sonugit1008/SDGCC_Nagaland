import React, { Component, Suspense, Fragment } from "react";
import { connect } from "react-redux";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  Link
} from "react-router-dom";
import { IntlProvider } from "react-intl";
import AppLocale from "./lang";
import ColorSwitcher from "./components/common/ColorSwitcher";
import NotificationContainer from "./components/common/react-notifications/NotificationContainer";
import { isMultiColorActive, isDemo } from "./constants/defaultValues";
import { getDirection } from "./helpers/Utils";
import WebSocketComponent from "./components/WebSocket";
import Faqs from "./views/FAQ/faqs";
import { Card, NavbarBrand, Row } from "reactstrap";
import { Colxx, Separator } from "./components/common/CustomBootstrap";
import ContactUs from "./views/FAQ/ContactUs";
import DownloadReports from "./views/FAQ/DownloadReports";
import BestPractices from "./views/FAQ/BestPractices";
import YoutubeLinks from "./views/FAQ/YoutubeLinks";
import PastActivities from "./views/FAQ/PastActivities";
import UpcomingActivities from "./views/FAQ/UpcomingActivities";
import Navigation from "./views/FAQ/Navigation";
import Disclaimer from "./views/FAQ/Disclaimer";
import PublicDashboard from "./views/PublicDashboard/PublicDashboard"

const ViewDash = React.lazy(() =>
  import(/* webpackChunkName: "views" */ "./views/PublicDashboard/DashBoard/index")
);

const ViewIndexDash = React.lazy(() =>
  import(/* webpackChunkName: "views" */ "./views/PublicDashboard/DashBoard/NewMainDashboard")
);

const ViewMain = React.lazy(() =>
  import(/* webpackChunkName: "views" */ "./views")
);
const ViewApp = React.lazy(() =>
  import(/* webpackChunkName: "views-app" */ "./views/app")
);

const ViewUser = React.lazy(() =>
  import(/* webpackChunkName: "views-user" */ "./views/user")
);
const ViewError = React.lazy(() =>
  import(/* webpackChunkName: "views-error" */ "./views/error")
);

// prettier-ignore
const AuthRoute = ({ component: Component, authUser, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        authUser || isDemo ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/user/login",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {}
    const direction = getDirection();
    if (direction.isRtl) {
      document.body.classList.add("rtl");
      document.body.classList.remove("ltr");
    } else {
      document.body.classList.add("ltr");
      document.body.classList.remove("rtl");
    }
  }



  render() {
    const { locale, loginUser } = this.props;
    const currentAppLocale = AppLocale[locale];

    return (

      <div className="h-100">
        <IntlProvider
          locale={currentAppLocale.locale}
          messages={currentAppLocale.messages}
        >
          <>
            <NotificationContainer />
            {this.props.authUser ? (<React.Fragment>
              <WebSocketComponent></WebSocketComponent>
              {isMultiColorActive && <ColorSwitcher />}
              <Suspense fallback={<div className="loading" />}>
                <Router basename="/dashboard">
                  <Switch>
                    <AuthRoute
                      path="/app"
                      authUser={loginUser}
                      component={ViewApp}
                    />

                    <Route
                      path="/user"
                      render={props => <ViewUser {...props} />}
                    />
                    <Route
                      path="/error"
                      exact
                      render={props => <ViewError {...props} />}
                    />
                    <Route
                      path="/"
                      exact
                      render={props => <ViewMain {...props} />}
                    />
                    <Redirect to="/error" />
                  </Switch>
                </Router>
              </Suspense>
            </React.Fragment>) : (<Fragment>
              <Suspense fallback={<div className="loading" />}>
                <Router basename="/dashboard">
                  <Switch>
                    <AuthRoute
                      path="/app"
                      authUser={loginUser}
                      component={ViewApp}
                    />
                    <Route
                      path="/user"
                      render={props => <ViewUser {...props} />}
                    />
                    <Route
                      path="/error"
                      exact
                      render={props => <ViewError {...props} />}
                    />
                    <Route
                      path="/faqs"
                      exact
                      render={props => {
                        return <>
                          <Row>
                            <Colxx>
                              <Card className="d-flex p-1">
                                <Row className="d-flex justify-content-between m-0">
                                  <div>
                                    {/* <img
                                      style={{ width: "75px" }}
                                      src={"/dashboard/assets/img/sdg_logo1.jpg"}
                                      alt=""
                                    /> */}
                                    <img
                                      style={{ width: "300px" }}
                                      className="ml-1"
                                      src={"/dashboard/assets/img/nagalandsdglogo.png"}
                                      alt=""
                                    />
                                  </div>
                                  <div className="my-2 mx-4">
                                    <i
                                      className="fa fa-bars fa-3x cursor-pointer"
                                      onClick={() => {
                                        this.setState({ showSideMenu: true });
                                      }}
                                    ></i>
                                  </div>
                                  <Colxx
                                    lg="3"
                                    className={[
                                      "position-absolute bg-white",
                                      this.state.showSideMenu ? "d-flex flex-column" : "d-none",
                                    ].join(" ")}
                                    style={{ zIndex: "1000", height: "100vh", top: 0, right: 0 }}
                                  >
                                    <Row className="d-flex justify-content-end p-4 w-100">
                                      <i
                                        className="fa fa-close fa-3x cursor-pointer"
                                        onClick={() => {
                                          this.setState({ showSideMenu: false });
                                        }}
                                      ></i>
                                    </Row>
                                    <Row className="w-100 p-4 d-flex flex-column">
                                      <Link to="/user/login">
                                        <p className="h5 font-weight-bold">Login</p>
                                      </Link>
                                      <Link to="/user/register" className="mt-3">
                                        <p className="h5 font-weight-bold">Register</p>
                                      </Link>
                                      <Separator className="my-2" />
                                      <Link to="/faqs" className="mt-3">
                                        <p className="h5 font-weight-bold">FAQs</p>
                                      </Link>
                                      <Link to="/contactus" className="mt-3">
                                        <p className="h5 font-weight-bold">Contact Us</p>
                                      </Link>
                                      <Link to="/downloads" className="mt-3">
                                        <p className="h5 font-weight-bold">Downloads</p>
                                      </Link>
                                      <Link to="/practices" className="mt-3">
                                        <p className="h5 font-weight-bold">Good Practices</p>
                                      </Link>
                                      {/* <Link to="/youtubelinks" className="mt-3">
                                        <p className="h5 font-weight-bold">Youtube Links</p>
                                      </Link> */}
                                      <Link to="/activities/past" className="mt-3">
                                        <p className="h5 font-weight-bold">Past Activities</p>
                                      </Link>
                                      <Link to="/activities/upcoming" className="mt-3">
                                        <p className="h5 font-weight-bold">Upcoming Activities</p>
                                      </Link>
                                      <Link to="/navigation" className="mt-3">
                                        <p className="h5 font-weight-bold">Navigation Map</p>
                                      </Link>
                                      <Link to="/disclaimer" className="mt-3">
                                        <p className="h5 font-weight-bold">Disclaimer</p>
                                      </Link>
                                    </Row>
                                  </Colxx>
                                </Row>
                              </Card>
                            </Colxx>
                          </Row>
                          <Row className="d-flex justify-content-center p-4 mt-4">
                            <Colxx lg="11">
                              <Faqs {...props} public={true} closeSidebar={() => {
                                this.setState({ showSideMenu: false })
                              }} />
                            </Colxx>
                          </Row>
                        </>
                      }}
                    />
                     <Route
                      path="/public_dashboard"
                      exact
                      render={props => {
                        return <>
                          <Row>
                            <Colxx>
                              <Card className="d-flex p-1">
                                <Row className="d-flex justify-content-between m-0">
                                  <div>
                                    {/* <img
                                      style={{ width: "75px" }}
                                      src={"/dashboard/assets/img/sdg_logo1.jpg"}
                                      alt=""
                                    /> */}
                                    <img
                                      style={{ width: "300px" }}
                                      className="ml-1"
                                      src={"/dashboard/assets/img/nagalandsdglogo.png"}
                                      alt=""
                                    />
                                  </div>
                                  <div className="my-2 mx-4">
                                    <i
                                      className="fa fa-bars fa-3x cursor-pointer"
                                      onClick={() => {
                                        this.setState({ showSideMenu: true });
                                      }}
                                    ></i>
                                  </div>
                                  <Colxx
                                    lg="3"
                                    className={[
                                      "position-absolute bg-white",
                                      this.state.showSideMenu ? "d-flex flex-column" : "d-none",
                                    ].join(" ")}
                                    style={{ zIndex: "1000", height: "100vh", top: 0, right: 0 }}
                                  >
                                    <Row className="d-flex justify-content-end p-4 w-100">
                                      <i
                                        className="fa fa-close fa-3x cursor-pointer"
                                        onClick={() => {
                                          this.setState({ showSideMenu: false });
                                        }}
                                      ></i>
                                    </Row>
                                    <Row className="w-100 p-4 d-flex flex-column">
                                      <Link to="/user/login">
                                        <p className="h5 font-weight-bold">Login</p>
                                      </Link>
                                      <Link to="/user/register" className="mt-3">
                                        <p className="h5 font-weight-bold">Register</p>
                                      </Link>
                                      {/* <Separator className="my-2" />
                                      <Link to="/faqs" className="mt-3">
                                        <p className="h5 font-weight-bold">FAQs</p>
                                      </Link>
                                      <Link to="/contactus" className="mt-3">
                                        <p className="h5 font-weight-bold">Contact Us</p>
                                      </Link>
                                      <Link to="/downloads" className="mt-3">
                                        <p className="h5 font-weight-bold">Downloads</p>
                                      </Link>
                                      <Link to="/practices" className="mt-3">
                                        <p className="h5 font-weight-bold">Good Practices</p>
                                      </Link> */}
                                      {/* <Link to="/youtubelinks" className="mt-3">
                                        <p className="h5 font-weight-bold">Youtube Links</p>
                                      </Link> */}
                                      {/* <Link to="/activities/past" className="mt-3">
                                        <p className="h5 font-weight-bold">Past Activities</p>
                                      </Link>
                                      <Link to="/activities/upcoming" className="mt-3">
                                        <p className="h5 font-weight-bold">Upcoming Activities</p>
                                      </Link>
                                      <Link to="/navigation" className="mt-3">
                                        <p className="h5 font-weight-bold">Navigation Map</p>
                                      </Link>
                                      <Link to="/disclaimer" className="mt-3">
                                        <p className="h5 font-weight-bold">Disclaimer</p>
                                      </Link> */}
                                    </Row>
                                  </Colxx>
                                </Row>
                              </Card>
                            </Colxx>
                          </Row>
                          <Row className="d-flex justify-content-center p-2 mt-4">
                            <Colxx lg="12">
                              <PublicDashboard {...props} public={true} closeSidebar={() => {
                                this.setState({ showSideMenu: false })
                              }} />
                            </Colxx>
                          </Row>
                        </>
                      }}
                    />
                    <Route
                      path="/practices"
                      exact
                      render={props => {
                        return <>
                          <Row>
                            <Colxx>
                              <Card className="d-flex p-1">
                                <Row className="d-flex justify-content-between m-0">
                                  <div>
                                    {/* <img
                                      style={{ width: "75px" }}
                                      src={"/dashboard/assets/img/sdg_logo1.jpg"}
                                      alt=""
                                    /> */}
                                    <img
                                      style={{ width: "300px" }}
                                      className="ml-1"
                                      src={"/dashboard/assets/img/nagalandsdglogo.png"}
                                      alt=""
                                    />
                                  </div>
                                  <div className="my-2 mx-4">
                                    <i
                                      className="fa fa-bars fa-3x cursor-pointer"
                                      onClick={() => {
                                        this.setState({ showSideMenu: true });
                                      }}
                                    ></i>
                                  </div>
                                  <Colxx
                                    lg="3"
                                    className={[
                                      "position-absolute bg-white",
                                      this.state.showSideMenu ? "d-flex flex-column" : "d-none",
                                    ].join(" ")}
                                    style={{ zIndex: "1000", height: "100vh", top: 0, right: 0 }}
                                  >
                                    <Row className="d-flex justify-content-end p-4 w-100">
                                      <i
                                        className="fa fa-close fa-3x cursor-pointer"
                                        onClick={() => {
                                          this.setState({ showSideMenu: false });
                                        }}
                                      ></i>
                                    </Row>
                                    <Row className="w-100 p-4 d-flex flex-column">
                                      <Link to="/user/login">
                                        <p className="h5 font-weight-bold">Login</p>
                                      </Link>
                                      <Link to="/user/register" className="mt-3">
                                        <p className="h5 font-weight-bold">Register</p>
                                      </Link>
                                      <Separator className="my-2" />
                                      <Link to="/faqs" className="mt-3">
                                        <p className="h5 font-weight-bold">FAQs</p>
                                      </Link>
                                      <Link to="/contactus" className="mt-3">
                                        <p className="h5 font-weight-bold">Contact Us</p>
                                      </Link>
                                      <Link to="/downloads" className="mt-3">
                                        <p className="h5 font-weight-bold">Downloads</p>
                                      </Link>
                                      <Link to="/practices" className="mt-3">
                                        <p className="h5 font-weight-bold">Good Practices</p>
                                      </Link>
                                      {/* <Link to="/youtubelinks" className="mt-3">
                                        <p className="h5 font-weight-bold">Youtube Links</p>
                                      </Link> */}
                                      <Link to="/activities/past" className="mt-3">
                                        <p className="h5 font-weight-bold">Past Activities</p>
                                      </Link>
                                      <Link to="/activities/upcoming" className="mt-3">
                                        <p className="h5 font-weight-bold">Upcoming Activities</p>
                                      </Link>
                                      <Link to="/navigation" className="mt-3">
                                        <p className="h5 font-weight-bold">Navigation Map</p>
                                      </Link>
                                      <Link to="/disclaimer" className="mt-3">
                                        <p className="h5 font-weight-bold">Disclaimer</p>
                                      </Link>
                                    </Row>
                                  </Colxx>
                                </Row>
                              </Card>
                            </Colxx>
                          </Row>
                          <Row className="d-flex justify-content-center p-4 mt-4">
                            <Colxx lg="11">
                              <BestPractices {...props} public={true} closeSidebar={() => {
                                this.setState({ showSideMenu: false })
                              }} />
                            </Colxx>
                          </Row>
                        </>
                      }}
                    />
                    <Route
                      path="/youtubelinks"
                      exact
                      render={props => {
                        return <>
                          <Row>
                            <Colxx>
                              <Card className="d-flex p-1">
                                <Row className="d-flex justify-content-between m-0">
                                  <div>
                                    {/* <img
                                      style={{ width: "75px" }}
                                      src={"/dashboard/assets/img/sdg_logo1.jpg"}
                                      alt=""
                                    /> */}
                                    <img
                                      style={{ width: "300px" }}
                                      className="ml-1"
                                      src={"/dashboard/assets/img/nagalandsdglogo.png"}
                                      alt=""
                                    />
                                  </div>
                                  <div className="my-2 mx-4">
                                    <i
                                      className="fa fa-bars fa-3x cursor-pointer"
                                      onClick={() => {
                                        this.setState({ showSideMenu: true });
                                      }}
                                    ></i>
                                  </div>
                                  <Colxx
                                    lg="3"
                                    className={[
                                      "position-absolute bg-white",
                                      this.state.showSideMenu ? "d-flex flex-column" : "d-none",
                                    ].join(" ")}
                                    style={{ zIndex: "1000", height: "100vh", top: 0, right: 0 }}
                                  >
                                    <Row className="d-flex justify-content-end p-4 w-100">
                                      <i
                                        className="fa fa-close fa-3x cursor-pointer"
                                        onClick={() => {
                                          this.setState({ showSideMenu: false });
                                        }}
                                      ></i>
                                    </Row>
                                    <Row className="w-100 p-4 d-flex flex-column">
                                      <Link to="/user/login">
                                        <p className="h5 font-weight-bold">Login</p>
                                      </Link>
                                      <Link to="/user/register" className="mt-3">
                                        <p className="h5 font-weight-bold">Register</p>
                                      </Link>
                                      <Separator className="my-2" />
                                      <Link to="/faqs" className="mt-3">
                                        <p className="h5 font-weight-bold">FAQs</p>
                                      </Link>
                                      <Link to="/contactus" className="mt-3">
                                        <p className="h5 font-weight-bold">Contact Us</p>
                                      </Link>
                                      <Link to="/downloads" className="mt-3">
                                        <p className="h5 font-weight-bold">Downloads</p>
                                      </Link>
                                      <Link to="/practices" className="mt-3">
                                        <p className="h5 font-weight-bold">Good Practices</p>
                                      </Link>
                                      {/* <Link to="/youtubelinks" className="mt-3">
                                        <p className="h5 font-weight-bold">Youtube Links</p>
                                      </Link> */}
                                      <Link to="/activities/past" className="mt-3">
                                        <p className="h5 font-weight-bold">Past Activities</p>
                                      </Link>
                                      <Link to="/activities/upcoming" className="mt-3">
                                        <p className="h5 font-weight-bold">Upcoming Activities</p>
                                      </Link>
                                      <Link to="/navigation" className="mt-3">
                                        <p className="h5 font-weight-bold">Navigation Map</p>
                                      </Link>
                                      <Link to="/disclaimer" className="mt-3">
                                        <p className="h5 font-weight-bold">Disclaimer</p>
                                      </Link>
                                    </Row>
                                  </Colxx>
                                </Row>
                              </Card>
                            </Colxx>
                          </Row>
                          <Row className="d-flex justify-content-center p-4 mt-4">
                            <Colxx lg="11">
                              <YoutubeLinks {...props} public={true} closeSidebar={() => {
                                this.setState({ showSideMenu: false })
                              }} />
                            </Colxx>
                          </Row>
                        </>
                      }}
                    />
                    <Route
                      path="/activities/past"
                      exact
                      render={props => {
                        return <>
                          <Row>
                            <Colxx>
                              <Card className="d-flex p-1">
                                <Row className="d-flex justify-content-between m-0">
                                  <div>
                                    {/* <img
                                      style={{ width: "75px" }}
                                      src={"/dashboard/assets/img/sdg_logo1.jpg"}
                                      alt=""
                                    /> */}
                                    <img
                                      style={{ width: "300px" }}
                                      className="ml-1"
                                      src={"/dashboard/assets/img/nagalandsdglogo.png"}
                                      alt=""
                                    />
                                  </div>
                                  <div className="my-2 mx-4">
                                    <i
                                      className="fa fa-bars fa-3x cursor-pointer"
                                      onClick={() => {
                                        this.setState({ showSideMenu: true });
                                      }}
                                    ></i>
                                  </div>
                                  <Colxx
                                    lg="3"
                                    className={[
                                      "position-absolute bg-white",
                                      this.state.showSideMenu ? "d-flex flex-column" : "d-none",
                                    ].join(" ")}
                                    style={{ zIndex: "1000", height: "100vh", top: 0, right: 0 }}
                                  >
                                    <Row className="d-flex justify-content-end p-4 w-100">
                                      <i
                                        className="fa fa-close fa-3x cursor-pointer"
                                        onClick={() => {
                                          this.setState({ showSideMenu: false });
                                        }}
                                      ></i>
                                    </Row>
                                    <Row className="w-100 p-4 d-flex flex-column">
                                      <Link to="/user/login">
                                        <p className="h5 font-weight-bold">Login</p>
                                      </Link>
                                      <Link to="/user/register" className="mt-3">
                                        <p className="h5 font-weight-bold">Register</p>
                                      </Link>
                                      <Separator className="my-2" />
                                      <Link to="/faqs" className="mt-3">
                                        <p className="h5 font-weight-bold">FAQs</p>
                                      </Link>
                                      <Link to="/contactus" className="mt-3">
                                        <p className="h5 font-weight-bold">Contact Us</p>
                                      </Link>
                                      <Link to="/downloads" className="mt-3">
                                        <p className="h5 font-weight-bold">Downloads</p>
                                      </Link>
                                      <Link to="/practices" className="mt-3">
                                        <p className="h5 font-weight-bold">Good Practices</p>
                                      </Link>
                                      {/* <Link to="/youtubelinks" className="mt-3">
                                        <p className="h5 font-weight-bold">Youtube Links</p>
                                      </Link> */}
                                      <Link to="/activities/past" className="mt-3">
                                        <p className="h5 font-weight-bold">Past Activities</p>
                                      </Link>
                                      <Link to="/activities/upcoming" className="mt-3">
                                        <p className="h5 font-weight-bold">Upcoming Activities</p>
                                      </Link>
                                      <Link to="/navigation" className="mt-3">
                                        <p className="h5 font-weight-bold">Navigation Map</p>
                                      </Link>
                                      <Link to="/disclaimer" className="mt-3">
                                        <p className="h5 font-weight-bold">Disclaimer</p>
                                      </Link>
                                    </Row>
                                  </Colxx>
                                </Row>
                              </Card>
                            </Colxx>
                          </Row>
                          <Row className="d-flex justify-content-center p-4 mt-4">
                            <Colxx lg="11">
                              <PastActivities {...props} public={true} closeSidebar={() => {
                                this.setState({ showSideMenu: false })
                              }} />
                            </Colxx>
                          </Row>
                        </>
                      }}
                    />
                    <Route
                      path="/activities/upcoming"
                      exact
                      render={props => {
                        return <>
                          <Row>
                            <Colxx>
                              <Card className="d-flex p-1">
                                <Row className="d-flex justify-content-between m-0">
                                  <div>
                                    {/* <img
                                      style={{ width: "75px" }}
                                      src={"/dashboard/assets/img/sdg_logo1.jpg"}
                                      alt=""
                                    /> */}
                                    <img
                                      style={{ width: "300px" }}
                                      className="ml-1"
                                      src={"/dashboard/assets/img/nagalandsdglogo.png"}
                                      alt=""
                                    />
                                  </div>
                                  <div className="my-2 mx-4">
                                    <i
                                      className="fa fa-bars fa-3x cursor-pointer"
                                      onClick={() => {
                                        this.setState({ showSideMenu: true });
                                      }}
                                    ></i>
                                  </div>
                                  <Colxx
                                    lg="3"
                                    className={[
                                      "position-absolute bg-white",
                                      this.state.showSideMenu ? "d-flex flex-column" : "d-none",
                                    ].join(" ")}
                                    style={{ zIndex: "1000", height: "100vh", top: 0, right: 0 }}
                                  >
                                    <Row className="d-flex justify-content-end p-4 w-100">
                                      <i
                                        className="fa fa-close fa-3x cursor-pointer"
                                        onClick={() => {
                                          this.setState({ showSideMenu: false });
                                        }}
                                      ></i>
                                    </Row>
                                    <Row className="w-100 p-4 d-flex flex-column">
                                      <Link to="/user/login">
                                        <p className="h5 font-weight-bold">Login</p>
                                      </Link>
                                      <Link to="/user/register" className="mt-3">
                                        <p className="h5 font-weight-bold">Register</p>
                                      </Link>
                                      <Separator className="my-2" />
                                      <Link to="/faqs" className="mt-3">
                                        <p className="h5 font-weight-bold">FAQs</p>
                                      </Link>
                                      <Link to="/contactus" className="mt-3">
                                        <p className="h5 font-weight-bold">Contact Us</p>
                                      </Link>
                                      <Link to="/downloads" className="mt-3">
                                        <p className="h5 font-weight-bold">Downloads</p>
                                      </Link>
                                      <Link to="/practices" className="mt-3">
                                        <p className="h5 font-weight-bold">Good Practices</p>
                                      </Link>
                                      {/* <Link to="/youtubelinks" className="mt-3">
                                        <p className="h5 font-weight-bold">Youtube Links</p>
                                      </Link> */}
                                      <Link to="/activities/past" className="mt-3">
                                        <p className="h5 font-weight-bold">Past Activities</p>
                                      </Link>
                                      <Link to="/activities/upcoming" className="mt-3">
                                        <p className="h5 font-weight-bold">Upcoming Activities</p>
                                      </Link>
                                      <Link to="/navigation" className="mt-3">
                                        <p className="h5 font-weight-bold">Navigation Map</p>
                                      </Link>
                                      <Link to="/disclaimer" className="mt-3">
                                        <p className="h5 font-weight-bold">Disclaimer</p>
                                      </Link>
                                    </Row>
                                  </Colxx>
                                </Row>
                              </Card>
                            </Colxx>
                          </Row>
                          <Row className="d-flex justify-content-center p-4 mt-4">
                            <Colxx lg="11">
                              <UpcomingActivities {...props} public={true} closeSidebar={() => {
                                this.setState({ showSideMenu: false })
                              }} />
                            </Colxx>
                          </Row>
                        </>
                      }}
                    />
                    <Route
                      path="/contactus"
                      exact
                      render={props => {
                        return <>
                          <Row>
                            <Colxx>
                              <Card className="d-flex p-1">
                                <Row className="d-flex justify-content-between m-0">
                                  <div>
                                    {/* <img
                                      style={{ width: "75px" }}
                                      src={"/dashboard/assets/img/sdg_logo1.jpg"}
                                      alt=""
                                    /> */}
                                    <img
                                      style={{ width: "300px" }}
                                      className="ml-1"
                                      src={"/dashboard/assets/img/nagalandsdglogo.png"}
                                      alt=""
                                    />
                                  </div>
                                  <div className="my-2 mx-4">
                                    <i
                                      className="fa fa-bars fa-3x cursor-pointer"
                                      onClick={() => {
                                        this.setState({ showSideMenu: true });
                                      }}
                                    ></i>
                                  </div>
                                  <Colxx
                                    lg="3"
                                    className={[
                                      "position-absolute bg-white",
                                      this.state.showSideMenu ? "d-flex flex-column" : "d-none",
                                    ].join(" ")}
                                    style={{ zIndex: "1000", height: "100vh", top: 0, right: 0 }}
                                  >
                                    <Row className="d-flex justify-content-end p-4 w-100">
                                      <i
                                        className="fa fa-close fa-3x cursor-pointer"
                                        onClick={() => {
                                          this.setState({ showSideMenu: false });
                                        }}
                                      ></i>
                                    </Row>
                                    <Row className="w-100 p-4 d-flex flex-column">
                                      <Link to="/user/login">
                                        <p className="h5 font-weight-bold">Login</p>
                                      </Link>
                                      <Link to="/user/register" className="mt-3">
                                        <p className="h5 font-weight-bold">Register</p>
                                      </Link>
                                      <Separator className="my-2" />
                                      <Link to="/faqs" className="mt-3">
                                        <p className="h5 font-weight-bold">FAQs</p>
                                      </Link>
                                      <Link to="/contactus" className="mt-3">
                                        <p className="h5 font-weight-bold">Contact Us</p>
                                      </Link>
                                      <Link to="/downloads" className="mt-3">
                                        <p className="h5 font-weight-bold">Downloads</p>
                                      </Link>
                                      <Link to="/practices" className="mt-3">
                                        <p className="h5 font-weight-bold">Good Practices</p>
                                      </Link>
                                      {/* <Link to="/youtubelinks" className="mt-3">
                                        <p className="h5 font-weight-bold">Youtube Links</p>
                                      </Link> */}
                                      <Link to="/activities/past" className="mt-3">
                                        <p className="h5 font-weight-bold">Past Activities</p>
                                      </Link>
                                      <Link to="/activities/upcoming" className="mt-3">
                                        <p className="h5 font-weight-bold">Upcoming Activities</p>
                                      </Link>
                                      <Link to="/navigation" className="mt-3">
                                        <p className="h5 font-weight-bold">Navigation Map</p>
                                      </Link>
                                      <Link to="/disclaimer" className="mt-3">
                                        <p className="h5 font-weight-bold">Disclaimer</p>
                                      </Link>
                                    </Row>
                                  </Colxx>
                                </Row>
                              </Card>
                            </Colxx>
                          </Row>
                          <Row className="d-flex justify-content-center p-4 mt-4">
                            <Colxx lg="11">
                              <ContactUs {...props} public={true} closeSidebar={() => {
                                this.setState({ showSideMenu: false })
                              }} />
                            </Colxx>
                          </Row>
                        </>
                      }}
                    />
                    <Route
                      path="/downloads"
                      exact
                      render={props => {
                        return <>
                          <Row>
                            <Colxx>
                              <Card className="d-flex p-1">
                                <Row className="d-flex justify-content-between m-0">
                                  <div>
                                    {/* <img
                                      style={{ width: "75px" }}
                                      src={"/dashboard/assets/img/sdg_logo1.jpg"}
                                      alt=""
                                    /> */}
                                    <img
                                      style={{ width: "300px" }}
                                      className="ml-1"
                                      src={"/dashboard/assets/img/nagalandsdglogo.png"}
                                      alt=""
                                    />
                                  </div>
                                  <div className="my-2 mx-4">
                                    <i
                                      className="fa fa-bars fa-3x cursor-pointer"
                                      onClick={() => {
                                        this.setState({ showSideMenu: true });
                                      }}
                                    ></i>
                                  </div>
                                  <Colxx
                                    lg="3"
                                    className={[
                                      "position-absolute bg-white",
                                      this.state.showSideMenu ? "d-flex flex-column" : "d-none",
                                    ].join(" ")}
                                    style={{ zIndex: "1000", height: "100vh", top: 0, right: 0 }}
                                  >
                                    <Row className="d-flex justify-content-end p-4 w-100">
                                      <i
                                        className="fa fa-close fa-3x cursor-pointer"
                                        onClick={() => {
                                          this.setState({ showSideMenu: false });
                                        }}
                                      ></i>
                                    </Row>
                                    <Row className="w-100 p-4 d-flex flex-column">
                                      <Link to="/user/login">
                                        <p className="h5 font-weight-bold">Login</p>
                                      </Link>
                                      <Link to="/user/register" className="mt-3">
                                        <p className="h5 font-weight-bold">Register</p>
                                      </Link>
                                      <Separator className="my-2" />
                                      <Link to="/faqs" className="mt-3">
                                        <p className="h5 font-weight-bold">FAQs</p>
                                      </Link>
                                      <Link to="/contactus" className="mt-3">
                                        <p className="h5 font-weight-bold">Contact Us</p>
                                      </Link>
                                      <Link to="/downloads" className="mt-3">
                                        <p className="h5 font-weight-bold">Downloads</p>
                                      </Link>
                                      <Link to="/practices" className="mt-3">
                                        <p className="h5 font-weight-bold">Good Practices</p>
                                      </Link>
                                      {/* <Link to="/youtubelinks" className="mt-3">
                                        <p className="h5 font-weight-bold">Youtube Links</p>
                                      </Link> */}
                                      <Link to="/activities/past" className="mt-3">
                                        <p className="h5 font-weight-bold">Past Activities</p>
                                      </Link>
                                      <Link to="/activities/upcoming" className="mt-3">
                                        <p className="h5 font-weight-bold">Upcoming Activities</p>
                                      </Link>
                                      <Link to="/navigation" className="mt-3">
                                        <p className="h5 font-weight-bold">Navigation Map</p>
                                      </Link>
                                      <Link to="/disclaimer" className="mt-3">
                                        <p className="h5 font-weight-bold">Disclaimer</p>
                                      </Link>
                                    </Row>
                                  </Colxx>
                                </Row>
                              </Card>
                            </Colxx>
                          </Row>
                          <Row className="d-flex justify-content-center p-4 mt-4">
                            <Colxx lg="11">
                              <DownloadReports {...props} public={true} closeSidebar={() => {
                                this.setState({ showSideMenu: false })
                              }} />
                            </Colxx>
                          </Row>
                        </>
                      }}
                    />
                    <Route
                      path="/navigation"
                      exact
                      render={props => {
                        return <>
                          <Row>
                            <Colxx>
                              <Card className="d-flex p-1">
                                <Row className="d-flex justify-content-between m-0">
                                  <div>
                                    {/* <img
                                      style={{ width: "75px" }}
                                      src={"/dashboard/assets/img/sdg_logo1.jpg"}
                                      alt=""
                                    /> */}
                                    <img
                                      style={{ width: "300px" }}
                                      className="ml-1"
                                      src={"/dashboard/assets/img/nagalandsdglogo.png"}
                                      alt=""
                                    />
                                  </div>
                                  <div className="my-2 mx-4">
                                    <i
                                      className="fa fa-bars fa-3x cursor-pointer"
                                      onClick={() => {
                                        this.setState({ showSideMenu: true });
                                      }}
                                    ></i>
                                  </div>
                                  <Colxx
                                    lg="3"
                                    className={[
                                      "position-absolute bg-white",
                                      this.state.showSideMenu ? "d-flex flex-column" : "d-none",
                                    ].join(" ")}
                                    style={{ zIndex: "1000", height: "100vh", top: 0, right: 0 }}
                                  >
                                    <Row className="d-flex justify-content-end p-4 w-100">
                                      <i
                                        className="fa fa-close fa-3x cursor-pointer"
                                        onClick={() => {
                                          this.setState({ showSideMenu: false });
                                        }}
                                      ></i>
                                    </Row>
                                    <Row className="w-100 p-4 d-flex flex-column">
                                      <Link to="/user/login">
                                        <p className="h5 font-weight-bold">Login</p>
                                      </Link>
                                      <Link to="/user/register" className="mt-3">
                                        <p className="h5 font-weight-bold">Register</p>
                                      </Link>
                                      <Separator className="my-2" />
                                      <Link to="/faqs" className="mt-3">
                                        <p className="h5 font-weight-bold">FAQs</p>
                                      </Link>
                                      <Link to="/contactus" className="mt-3">
                                        <p className="h5 font-weight-bold">Contact Us</p>
                                      </Link>
                                      <Link to="/downloads" className="mt-3">
                                        <p className="h5 font-weight-bold">Downloads</p>
                                      </Link>
                                      <Link to="/practices" className="mt-3">
                                        <p className="h5 font-weight-bold">Good Practices</p>
                                      </Link>
                                      {/* <Link to="/youtubelinks" className="mt-3">
                                        <p className="h5 font-weight-bold">Youtube Links</p>
                                      </Link> */}
                                      <Link to="/activities/past" className="mt-3">
                                        <p className="h5 font-weight-bold">Past Activities</p>
                                      </Link>
                                      <Link to="/activities/upcoming" className="mt-3">
                                        <p className="h5 font-weight-bold">Upcoming Activities</p>
                                      </Link>
                                      <Link to="/navigation" className="mt-3">
                                        <p className="h5 font-weight-bold">Navigation Map</p>
                                      </Link>
                                      <Link to="/disclaimer" className="mt-3">
                                        <p className="h5 font-weight-bold">Disclaimer</p>
                                      </Link>
                                    </Row>
                                  </Colxx>
                                </Row>
                              </Card>
                            </Colxx>
                          </Row>
                          <Row className="d-flex justify-content-center p-4 mt-4">
                            <Colxx lg="11">
                              <Navigation {...props} public={true} closeSidebar={() => {
                                this.setState({ showSideMenu: false })
                              }} />
                            </Colxx>
                          </Row>
                        </>
                      }}
                    />
                    <Route
                      path="/disclaimer"
                      exact
                      render={props => {
                        return <>
                          <Row>
                            <Colxx>
                              <Card className="d-flex p-1">
                                <Row className="d-flex justify-content-between m-0">
                                  <div>
                                    {/* <img
                                      style={{ width: "75px" }}
                                      src={"/dashboard/assets/img/sdg_logo1.jpg"}
                                      alt=""
                                    /> */}
                                    <img
                                      style={{ width: "300px" }}
                                      className="ml-1"
                                      src={"/dashboard/assets/img/nagalandsdglogo.png"}
                                      alt=""
                                    />
                                  </div>
                                  <div className="my-2 mx-4">
                                    <i
                                      className="fa fa-bars fa-3x cursor-pointer"
                                      onClick={() => {
                                        this.setState({ showSideMenu: true });
                                      }}
                                    ></i>
                                  </div>
                                  <Colxx
                                    lg="3"
                                    className={[
                                      "position-absolute bg-white",
                                      this.state.showSideMenu ? "d-flex flex-column" : "d-none",
                                    ].join(" ")}
                                    style={{ zIndex: "1000", height: "100vh", top: 0, right: 0 }}
                                  >
                                    <Row className="d-flex justify-content-end p-4 w-100">
                                      <i
                                        className="fa fa-close fa-3x cursor-pointer"
                                        onClick={() => {
                                          this.setState({ showSideMenu: false });
                                        }}
                                      ></i>
                                    </Row>
                                    <Row className="w-100 p-4 d-flex flex-column">
                                      <Link to="/user/login">
                                        <p className="h5 font-weight-bold">Login</p>
                                      </Link>
                                      <Link to="/user/register" className="mt-3">
                                        <p className="h5 font-weight-bold">Register</p>
                                      </Link>
                                      <Separator className="my-2" />
                                      <Link to="/faqs" className="mt-3">
                                        <p className="h5 font-weight-bold">FAQs</p>
                                      </Link>
                                      <Link to="/contactus" className="mt-3">
                                        <p className="h5 font-weight-bold">Contact Us</p>
                                      </Link>
                                      <Link to="/downloads" className="mt-3">
                                        <p className="h5 font-weight-bold">Downloads</p>
                                      </Link>
                                      <Link to="/practices" className="mt-3">
                                        <p className="h5 font-weight-bold">Good Practices</p>
                                      </Link>
                                      {/* <Link to="/youtubelinks" className="mt-3">
                                        <p className="h5 font-weight-bold">Youtube Links</p>
                                      </Link> */}
                                      <Link to="/activities/past" className="mt-3">
                                        <p className="h5 font-weight-bold">Past Activities</p>
                                      </Link>
                                      <Link to="/activities/upcoming" className="mt-3">
                                        <p className="h5 font-weight-bold">Upcoming Activities</p>
                                      </Link>
                                      <Link to="/navigation" className="mt-3">
                                        <p className="h5 font-weight-bold">Navigation Map</p>
                                      </Link>
                                      <Link to="/disclaimer" className="mt-3">
                                        <p className="h5 font-weight-bold">Disclaimer</p>
                                      </Link>
                                    </Row>
                                  </Colxx>
                                </Row>
                              </Card>
                            </Colxx>
                          </Row>
                          <Row className="d-flex justify-content-center p-4 mt-4">
                            <Colxx lg="11">
                              <Disclaimer {...props} public={true} closeSidebar={() => {
                                this.setState({ showSideMenu: false })
                              }} />
                            </Colxx>
                          </Row>
                        </>
                      }}
                    />
                    {/* <Route
                      path="/public_dashboard"
                      exact
                      render={props => <ViewIndexDash {...props} />}
                    /> */}
                    <Route
                      path="/dashboard"
                      exact
                      render={props => <ViewIndexDash {...props} />}
                    />
                    <Route
                      path="/"
                      exact
                      render={props => <ViewDash {...props} />}
                    />
                    <Redirect to="/error" />
                  </Switch>
                </Router>
              </Suspense>
            </Fragment>)
            }

          </>
        </IntlProvider>
      </div>

    );
  }
}

const mapStateToProps = ({ authUser, settings }) => {
  const { user: loginUser } = authUser;
  const { locale } = settings;
  return { loginUser, locale };
};
const mapActionsToProps = (dispatch) => {
  return {
  }
};

export default connect(mapStateToProps, mapActionsToProps)(App);
