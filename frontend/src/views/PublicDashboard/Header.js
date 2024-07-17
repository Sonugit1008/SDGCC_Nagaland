import React from "react";
import "leaflet/dist/leaflet.css";

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
function Header() {
  return (
    <div className="">
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <a
          class="navbar-brand ml-2 font-weight-bold text-info text-xl"
          href="#"
        >
          Niti Aayog
        </a>
        <button
          class="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <img src={SVG1} alt="" />
            </li>
            <li class="nav-item">
              <img src={SVG2} alt="" />
            </li>
            <li class="nav-item">
              <img src={SVG3} alt="" />
            </li>
            <li class="nav-item">
              <img src={SVG4} alt="" />
            </li>
            <li class="nav-item">
              <img src={SVG5} alt="" />
            </li>
            <li class="nav-item">
              <img src={SVG6} alt="" />
            </li>
            <li class="nav-item">
              <img src={SVG7} alt="" />
            </li>
            <li class="nav-item">
              <img src={SVG8} alt="" />
            </li>
            <li class="nav-item">
              <img src={SVG9} alt="" />
            </li>
            <li class="nav-item">
              <img src={SVG10} alt="" />
            </li>
            <li class="nav-item">
              <img src={SVG11} alt="" />
            </li>
            <li class="nav-item">
              <img src={SVG12} alt="" />
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}
export default Header;
