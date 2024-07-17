import React from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
} from "reactstrap";
import SVG1 from "../assets/1.svg";
import SVG2 from "../assets/2.svg";
import SVG3 from "../assets/3.svg";
import SVG4 from "../assets/4.svg";
import SVG5 from "../assets/5.svg";
import SVG6 from "../assets/6.svg";
import SVG7 from "../assets/7.svg";
import SVG8 from "../assets/8.svg";
import SVG9 from "../assets/9.svg";
import SVG10 from "../assets/10.svg";
import SVG11 from "../assets/11.svg";
import SVG12 from "../assets/12.svg";
import SVG13 from "../assets/13.svg";
import SVG14 from "../assets/14.svg";
import SVG15 from "../assets/15.svg";
import SVG16 from "../assets/16.svg";
import SVG17 from "../assets/17.svg";
import SVG18 from "../assets/18.svg";
import Logo from "../assets/logo.svg";

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
      <div>
        <Navbar color="light" light expand="md">
          <NavbarBrand href="/">
            <img style={{ width: "120px" }} src={Logo} alt="" />
          </NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav
              className="w-100 d-flex justify-content-center align-items-center"
              navbar
            >
              <NavItem>
                <img
                  onClick={() => this.props.setFilter("SDG Index")}
                  className={
                    this.props.filter === "SDG Index"
                      ? "border border-light"
                      : ""
                  }
                  style={{
                    width: this.props.filter === "SDG Index" ? "48px" : "42px",
                    cursor: "pointer",
                  }}
                  src={SVG1}
                  alt=""
                  data-toggle="tooltip"
                  data-placement="bottom"
                  title="SDG Index"
                />
              </NavItem>
              <NavItem>
                <img
                  onClick={() => this.props.setFilter("No Poverty")}
                  className={
                    this.props.filter === "No Poverty"
                      ? "border border-light"
                      : ""
                  }
                  style={{
                    width: this.props.filter === "No Poverty" ? "48px" : "42px",
                    cursor: "pointer",
                  }}
                  src={SVG2}
                  alt=""
                  data-toggle="tooltip"
                  data-placement="bottom"
                  title="No Poverty"
                />
              </NavItem>
              <NavItem>
                <img
                  onClick={() => this.props.setFilter("Zero Hunger")}
                  className={
                    this.props.filter === "Zero Hunger"
                      ? "border border-light"
                      : ""
                  }
                  style={{
                    width:
                      this.props.filter === "Zero Hunger" ? "48px" : "42px",
                    cursor: "pointer",
                  }}
                  src={SVG3}
                  alt=""
                  data-toggle="tooltip"
                  data-placement="bottom"
                  title="Zero Hunger"
                />
              </NavItem>
              <NavItem>
                <img
                  onClick={() =>
                    this.props.setFilter("Good Health and Well-being")
                  }
                  className={
                    this.props.filter === "Good Health and Well-being"
                      ? "border border-light"
                      : ""
                  }
                  style={{
                    width:
                      this.props.filter === "Good Health and Well-being"
                        ? "48px"
                        : "42px",
                    cursor: "pointer",
                  }}
                  src={SVG4}
                  alt=""
                  data-toggle="tooltip"
                  data-placement="bottom"
                  title="Good Health and Well-being"
                />
              </NavItem>
              <NavItem>
                <img
                  onClick={() => this.props.setFilter("Quality Education")}
                  className={
                    this.props.filter === "Quality Education"
                      ? "border border-light"
                      : ""
                  }
                  style={{
                    width:
                      this.props.filter === "Quality Education"
                        ? "48px"
                        : "42px",
                    cursor: "pointer",
                  }}
                  src={SVG5}
                  alt=""
                  data-toggle="tooltip"
                  data-placement="bottom"
                  title="Quality Education"
                />
              </NavItem>
              <NavItem>
                <img
                  onClick={() => this.props.setFilter("Gender Equality")}
                  className={
                    this.props.filter === "Gender Equality"
                      ? "border border-light"
                      : ""
                  }
                  style={{
                    width:
                      this.props.filter === "Gender Equality" ? "48px" : "42px",
                    cursor: "pointer",
                  }}
                  src={SVG6}
                  alt=""
                  data-toggle="tooltip"
                  data-placement="bottom"
                  title="Gender Equality"
                />
              </NavItem>
              <NavItem>
                <img
                  onClick={() =>
                    this.props.setFilter("Clean Water and Sanitation")
                  }
                  className={
                    this.props.filter === "Clean Water and Sanitation"
                      ? "border border-light"
                      : ""
                  }
                  style={{
                    width:
                      this.props.filter === "Clean Water and Sanitation"
                        ? "48px"
                        : "42px",
                    cursor: "pointer",
                  }}
                  src={SVG7}
                  alt=""
                  data-toggle="tooltip"
                  data-placement="bottom"
                  title="Clean Water and Sanitation"
                />
              </NavItem>
              <NavItem>
                <img
                  onClick={() =>
                    this.props.setFilter("Affordable and Clean Energy")
                  }
                  className={
                    this.props.filter === "Affordable and Clean Energy"
                      ? "border border-light"
                      : ""
                  }
                  style={{
                    width:
                      this.props.filter === "Affordable and Clean Energy"
                        ? "48px"
                        : "42px",
                    cursor: "pointer",
                  }}
                  src={SVG8}
                  alt=""
                  data-toggle="tooltip"
                  data-placement="bottom"
                  title="Affordable and Clean Energy"
                />
              </NavItem>
              <NavItem>
                <img
                  onClick={() =>
                    this.props.setFilter("Decent Work and Economic Growth")
                  }
                  className={
                    this.props.filter === "Decent Work and Economic Growth"
                      ? "border border-light"
                      : ""
                  }
                  style={{
                    width:
                      this.props.filter === "Decent Work and Economic Growth"
                        ? "48px"
                        : "42px",
                    cursor: "pointer",
                  }}
                  src={SVG9}
                  alt=""
                  data-toggle="tooltip"
                  data-placement="bottom"
                  title="Decent Work and Economic Growth"
                />
              </NavItem>
              <NavItem>
                <img
                  onClick={() =>
                    this.props.setFilter(
                      "Industry, Innovation and Infrastructure"
                    )
                  }
                  className={
                    this.props.filter ===
                    "Industry, Innovation and Infrastructure"
                      ? "border border-light"
                      : ""
                  }
                  style={{
                    width:
                      this.props.filter ===
                      "Industry, Innovation and Infrastructure"
                        ? "48px"
                        : "42px",
                    cursor: "pointer",
                  }}
                  src={SVG10}
                  alt=""
                  data-toggle="tooltip"
                  data-placement="bottom"
                  title="Industry, Innovation and Infrastructure"
                />
              </NavItem>
              <NavItem>
                <img
                  onClick={() => this.props.setFilter("Reduced Inequality")}
                  className={
                    this.props.filter === "Reduced Inequality"
                      ? "border border-light"
                      : ""
                  }
                  style={{
                    width:
                      this.props.filter === "Reduced Inequality"
                        ? "48px"
                        : "42px",
                    cursor: "pointer",
                  }}
                  src={SVG11}
                  alt=""
                  data-toggle="tooltip"
                  data-placement="bottom"
                  title="Reduced Inequality"
                />
              </NavItem>
              <NavItem>
                <img
                  onClick={() =>
                    this.props.setFilter("Sustainable Cities and Communities")
                  }
                  className={
                    this.props.filter === "Sustainable Cities and Communities"
                      ? "border border-light"
                      : ""
                  }
                  style={{
                    width:
                      this.props.filter === "Sustainable Cities and Communities"
                        ? "48px"
                        : "42px",
                    cursor: "pointer",
                  }}
                  src={SVG12}
                  alt=""
                  data-toggle="tooltip"
                  data-placement="bottom"
                  title="Sustainable Cities and Communities"
                />
              </NavItem>
              <NavItem>
                <img
                  onClick={() =>
                    this.props.setFilter(
                      "Sustainable Consumption and Production"
                    )
                  }
                  className={
                    this.props.filter ===
                    "Sustainable Consumption and Production"
                      ? "border border-light"
                      : ""
                  }
                  style={{
                    width:
                      this.props.filter ===
                      "Sustainable Consumption and Production"
                        ? "48px"
                        : "42px",
                    cursor: "pointer",
                  }}
                  src={SVG13}
                  alt=""
                  data-toggle="tooltip"
                  data-placement="bottom"
                  title="Sustainable Consumption and Production"
                />
              </NavItem>
              <NavItem>
                <img
                  onClick={() => this.props.setFilter("Climate Action")}
                  style={{
                    width:
                      this.props.filter === "Climate Action" ? "48px" : "42px",
                    cursor: "pointer",
                  }}
                  className={
                    this.props.filter === "Climate Action"
                      ? "border border-light"
                      : ""
                  }
                  src={SVG14}
                  alt=""
                  data-toggle="tooltip"
                  data-placement="bottom"
                  title="Climate Action"
                />
              </NavItem>
              <NavItem>
                <img
                  onClick={() => this.props.setFilter("Life Below Water")}
                  style={{
                    width:
                      this.props.filter === "Life Below Water"
                        ? "48px"
                        : "42px",
                    cursor: "pointer",
                  }}
                  className={
                    this.props.filter === "Life Below Water"
                      ? "border border-light"
                      : ""
                  }
                  src={SVG15}
                  alt=""
                  data-toggle="tooltip"
                  data-placement="bottom"
                  title="Life Below Water"
                />
              </NavItem>
              <NavItem>
                <img
                  onClick={() => this.props.setFilter("Life on Land")}
                  style={{
                    width:
                      this.props.filter === "Life on Land" ? "48px" : "42px",
                    cursor: "pointer",
                  }}
                  className={
                    this.props.filter === "Life on Land"
                      ? "border border-light"
                      : ""
                  }
                  src={SVG16}
                  alt=""
                  data-toggle="tooltip"
                  data-placement="bottom"
                  title="Life on Land"
                />
              </NavItem>
              <NavItem>
                <img
                  onClick={() =>
                    this.props.setFilter(
                      "Peace, Justice and Strong Institutions"
                    )
                  }
                  className={
                    this.props.filter ===
                    "Peace, Justice and Strong Institutions"
                      ? "border border-light"
                      : ""
                  }
                  style={{
                    width:
                      this.props.filter ===
                      "Peace, Justice and Strong Institutions"
                        ? "48px"
                        : "42px",
                    cursor: "pointer",
                  }}
                  src={SVG17}
                  alt=""
                  data-toggle="tooltip"
                  data-placement="bottom"
                  title="Peace, Justice and Strong Institutions"
                />
              </NavItem>
              <NavItem>
                <img
                  onClick={() =>
                    this.props.setFilter("Partnership for the Goals")
                  }
                  className={
                    this.props.filter === "Partnership for the Goals"
                      ? "border border-light"
                      : ""
                  }
                  style={{
                    width:
                      this.props.filter === "Partnership for the Goals"
                        ? "48px"
                        : "42px",
                    cursor: "pointer",
                  }}
                  src={SVG18}
                  alt=""
                  data-toggle="tooltip"
                  data-placement="bottom"
                  title="Partnership for the Goals"
                />
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}
