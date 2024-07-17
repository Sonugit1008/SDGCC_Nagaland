import React, { Component } from "react";
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import { Card, Row, CardBody, Label } from "reactstrap";
import DashImg from "../assets/maindash.jpg";
import SDG_index_logo from "../assets/sdg_index_logo.svg";
import SDG_Explore from "../assets/sdg_explore.svg";
import NITI_Logo from "../assets/niti_logo.svg";
import NITI_Logo_Text from "../assets/niti_logo_text1.svg";
import { Link } from "react-router-dom";

class DashBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <>
        {this.props.isDash ? (
          <>
            <Link onClick={() => this.props.closeDash()}>
              <div
                className=""
                style={{
                  height: "100vh",
                  backgroundImage: "url('/dashboard/assets/img/mainsdg4.jpg')",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <Row className="d-flex justify-content-center align-items-center m-0 h-100">
                  <Colxx
                    lg="10"
                    className="d-flex flex-column align-items-center justify-content-center text-center"
                  >
                    <img
                      src={SDG_Explore}
                      alt=""
                      className="d-flex justify-content-center cursor-pointer"
                      width={"300px"}
                    />
                    <h1
                      className="text-light font-weight-bold mt-3"
                      style={{
                        fontSize: "50px",
                      }}
                    >
                      NAGALAND SDG DASHBOARD
                    </h1>
                  </Colxx>
                </Row>
              </div>
            </Link>
          </>
        ) : (
          <>
            <Link to="/public_dashboard">
              {" "}
              <div
                className=""
                style={{
                  height: "100vh",
                  backgroundImage: "url('/dashboard/assets/img/mainsdg4.jpg')",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <Row className="d-flex justify-content-center align-items-center m-0 h-100">
                  <Colxx
                    lg="10"
                    className="d-flex flex-column align-items-center justify-content-center text-center"
                  >
                    <Link to="/public_dashboard">
                      <img
                        src={SDG_Explore}
                        alt=""
                        className="d-flex justify-content-center cursor-pointer"
                        width={"300px"}
                      />
                    </Link>
                    <h1
                      className="text-light font-weight-bold mt-3"
                      style={{
                        fontSize: "50px",
                      }}
                    >
                      NAGALAND SDG DASHBOARD
                    </h1>
                  </Colxx>
                </Row>
                {/* <Row className="m-0 d-flex flex-md-row-reverse">
        <Colxx lg="6" className="p-0">
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
              lg="5"
              className={[
                "position-absolute h-100 bg-white",
                this.state.showSideMenu ? "d-flex flex-column" : "d-none",
              ].join(" ")}
              style={{ zIndex: "1000" }}
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
                <Link to="/dashboard">
                  <p className="h4 font-weight-bold">Explore Index</p>
                </Link>
                <Separator className="my-2" />
                <Link to="/downloads" className="mt-3">
                  <p className="h4 font-weight-bold">Downloads</p>
                </Link>
              </Row>
            </Colxx>
          </Row>
          <Row className="d-flex justify-content-center my-4 mx-0">
            <Colxx lg="10" className="d-flex justify-content-between">
              <img src={NITI_Logo} alt="" className="img-fluid" />
              <img src={NITI_Logo_Text} alt="" className="img-fluid" />
            </Colxx>
          </Row>
          <Row className="d-flex justify-content-center my-4 mx-0">
            <Colxx lg="8" className="d-flex justify-content-center">
              <img src={SDG_index_logo} alt="" className="img-fluid" />
            </Colxx>
          </Row>
          <Row className="d-flex justify-content-center my-4 mx-0">
            <Colxx lg="10" className="d-flex justify-content-center">
              <Link to="/dashboard">
                <img
                  src={SDG_Explore}
                  alt=""
                  className="img-fluid d-flex justify-content-center cursor-pointer"
                />
              </Link>
            </Colxx>
          </Row>
        </Colxx>
        <Colxx lg="6" className="p-0">
          <img
            src={DashImg}
            alt=""
            className="img-fluid"
            style={{ height: "100vh" }}
          />
        </Colxx>
      </Row> */}
              </div>
            </Link>
          </>
        )}
      </>
    );
  }
}

export default DashBoard;
