import React from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Row,
} from "reactstrap";
import "./Header.css";
import { Link } from "react-router-dom";
import { Colxx, Separator } from "../Common/CustomBootstrap";
import SVG14 from "../assets/14.svg";
export default class Header extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false,
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }
  render() {
    return (
      <Navbar color="light" light expand="md">
        <NavbarBrand href="/" className="ml-4">
          {/* <img
            style={{ width: "75px" }}
            src={"/dashboard/assets/img/sdg_logo1.jpg"}
            alt=""
          /> */}
          <img
            style={{ width: "300px" }}
            className="ml-1"
            goal
            src={"/dashboard/assets/img/nagalandsdglogo.png"}
            alt=""
          />
        </NavbarBrand>
        <NavbarToggler onClick={this.toggle} />
        <Collapse
          isOpen={this.state.isOpen}
          navbar
          className="d-flex flex-column justify-content-center"
        >
          <div>
            {this.props.subtab !== "statescore" && (
              <h6
                style={{ color: "#009F84" }}
                className="mt-3 mb-0 font-weight-bold"
              >
                {/* Click the Goal Icons to see the data of the particular goal */}
                Click the Goal Icons to see goal-specific data
              </h6>
            )}
          </div>
          <Nav
            className="w-100 d-flex justify-content-center align-items-center"
            navbar
          >
            {this.props.subtab !== "statescore" &&
              this.props.goalsData.map((goal, index) => {
                return (
                  <>
                    {index === 14 ? (
                      <>
                        <NavItem>
                          <img
                            className={
                              this.props.filter === goal.name
                                ? "border border-light"
                                : ""
                            }
                            style={{
                              width: "48px",
                            }}
                            src={"/dashboard/assets/img/goal14.png"}
                            alt=""
                            data-toggle="tooltip"
                            data-placement="bottom"
                            title={"No data"}
                          />
                        </NavItem>
                        <NavItem>
                          <img
                            onClick={() => this.props.setFilter(goal.name)}
                            className={
                              this.props.filter === goal.name
                                ? "border border-light"
                                : ""
                            }
                            style={{
                              width:
                                this.props.filter === goal.name
                                  ? "64px"
                                  : "48px",
                              cursor: "pointer",
                            }}
                           // src={goal.image.replace('http://192.168.0.121:8005/', 'https://sdg.indevconsultancy.in/')}
                           src={goal.image}
                            alt=""
                            data-toggle="tooltip"
                            data-placement="bottom"
                            title={goal.name}
                          />
                        </NavItem>
                      </>
                    ) : index === 15 ? (
                      <>
                        <NavItem>
                          <img
                            onClick={() => this.props.setFilter(goal.name)}
                            className={
                              this.props.filter === goal.name
                                ? "border border-light"
                                : ""
                            }
                            style={{
                              width:
                                this.props.filter === goal.name
                                  ? "64px"
                                  : "48px",
                              cursor: "pointer",
                            }}
                            //src={goal.image.replace('http://192.168.0.121:8005/', 'https://sdg.indevconsultancy.in/')}
                            src={goal.image}
                            alt=""
                            data-toggle="tooltip"
                            data-placement="bottom"
                            title={goal.name}
                          />
                        </NavItem>
                        <NavItem>
                          <img
                            className={
                              this.props.filter === goal.name
                                ? "border border-light"
                                : ""
                            }
                            style={{
                              width: "48px",
                            }}
                            src={"/dashboard/assets/img/goal17.png"}
                            alt=""
                            data-toggle="tooltip"
                            data-placement="bottom"
                            title={"No data"}
                          />
                        </NavItem>
                      </>
                    ) : (
                      <NavItem>
                        <img
                          onClick={() => this.props.setFilter(goal.name)}
                          className={
                            this.props.filter === goal.name
                              ? "border border-light"
                              : ""
                          }
                          style={{
                            width:
                              this.props.filter === goal.name ? "64px" : "48px",
                            cursor: "pointer",
                          }}
                          // src={goal.image.replace('http://192.168.0.121:8005/', 'https://sdg.indevconsultancy.in/')}
                          src={goal.image}
                          alt=""
                          data-toggle="tooltip"
                          data-placement="bottom"
                          title={goal.name}
                        />
                      </NavItem>
                    )}
                  </>
                );
              })}
          </Nav>
        </Collapse>
        {this.props.isDash ? (
          <></>
        ) : (
          <div className="mr-4">
            {/* <UncontrolledButtonDropdown color="link" direction="left">
              <DropdownToggle
                color="link"
                style={{ color: "rgb(50, 50, 50)" }}
                className="p-0 font-weight-bold text-center"
              >
                <i className="fa-lg fa fa-bars" style={{ color: "black" }}></i>
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem>
                  <Link to={`/user/login`}>Login</Link>
                </DropdownItem>
                <DropdownItem>
                  <Link to={`/user/register`}>Register</Link>
                </DropdownItem>
                <DropdownItem>
                  <Link to={`/faqs`}>FAQs</Link>
                </DropdownItem>
                <DropdownItem>
                  <Link to={`/contactus`}>Contact Us</Link>
                </DropdownItem>
                <DropdownItem>
                  <Link to={`/downloads`}>Downloads</Link>
                </DropdownItem>
                <DropdownItem>
                  <Link to={`/practices`}>Best Practices</Link>
                </DropdownItem>
                <DropdownItem>
                  <Link to={`/youtubelinks`}>Youtube Links</Link>
                </DropdownItem>
                <DropdownItem>
                  <Link to={`/activities/past`}>Past Activities</Link>
                </DropdownItem>
                <DropdownItem>
                  <Link to={`/activities/upcoming`}>Best Practices</Link>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledButtonDropdown> */}
            <Row className="d-flex justify-content-end m-0">
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
                </Row>
              </Colxx>
            </Row>
          </div>
        )}
      </Navbar>
    );
  }
}
