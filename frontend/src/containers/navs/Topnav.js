import React, { Component } from "react";
import {
  UncontrolledDropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  Row,
} from "reactstrap";
import PerfectScrollbar from "react-perfect-scrollbar";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { Modal } from "react-bootstrap";
import {
  setContainerClassnames,
  clickOnMobileMenu,
  logoutUser,
  changeLocale,
} from "../../redux/actions";

import {
  menuHiddenBreakpoint,
  searchPath,
  isDarkSwitchActive,
} from "../../constants/defaultValues";

import { MobileMenuIcon, MenuIcon } from "../../components/svg";
import TopnavNotifications from "./Topnav.Notifications";
import TopnavDarkSwitch from "./Topnav.DarkSwitch";

import { getDirection, setDirection } from "../../helpers/Utils";
import { Colxx } from "../../components/common/CustomBootstrap";

const NotificationItem = ({ img, title, date }) => {
  return (
    <div className="d-flex flex-row mb-3 pb-3 border-bottom">
      <a href="/app/pages/details">
        <img
          src={img}
          alt={title}
          className="img-thumbnail list-thumbnail xsmall border-0 rounded-circle"
        />
      </a>
      <div className="pl-3 pr-2">
        <a href="/app/pages/details">
          <p className="font-weight-medium mb-1">{title}</p>
          <p className="text-muted mb-0 text-small">{date}</p>
        </a>
      </div>
    </div>
  );
};

class TopNav extends Component {
  constructor(props) {
    super(props);
    console.log("TopNavProps");
    console.log(props);
    this.state = {
      isInFullScreen: false,
      searchKeyword: "",
      notificationmodal: false,
    };
  }

  handleChangeLocale = (locale, direction) => {
    this.props.changeLocale(locale);

    const currentDirection = getDirection().direction;
    if (direction !== currentDirection) {
      setDirection(direction);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  isInFullScreen = () => {
    return (
      (document.fullscreenElement && document.fullscreenElement !== null) ||
      (document.webkitFullscreenElement &&
        document.webkitFullscreenElement !== null) ||
      (document.mozFullScreenElement &&
        document.mozFullScreenElement !== null) ||
      (document.msFullscreenElement && document.msFullscreenElement !== null)
    );
  };
  handleSearchIconClick = (e) => {
    if (window.innerWidth < menuHiddenBreakpoint) {
      let elem = e.target;
      if (!e.target.classList.contains("search")) {
        if (e.target.parentElement.classList.contains("search")) {
          elem = e.target.parentElement;
        } else if (
          e.target.parentElement.parentElement.classList.contains("search")
        ) {
          elem = e.target.parentElement.parentElement;
        }
      }

      if (elem.classList.contains("mobile-view")) {
        this.search();
        elem.classList.remove("mobile-view");
        this.removeEventsSearch();
      } else {
        elem.classList.add("mobile-view");
        this.addEventsSearch();
      }
    } else {
      this.search();
    }
  };
  addEventsSearch = () => {
    document.addEventListener("click", this.handleDocumentClickSearch, true);
  };
  removeEventsSearch = () => {
    document.removeEventListener("click", this.handleDocumentClickSearch, true);
  };

  handleDocumentClickSearch = (e) => {
    let isSearchClick = false;
    if (
      e.target &&
      e.target.classList &&
      (e.target.classList.contains("navbar") ||
        e.target.classList.contains("simple-icon-magnifier"))
    ) {
      isSearchClick = true;
      if (e.target.classList.contains("simple-icon-magnifier")) {
        this.search();
      }
    } else if (
      e.target.parentElement &&
      e.target.parentElement.classList &&
      e.target.parentElement.classList.contains("search")
    ) {
      isSearchClick = true;
    }

    if (!isSearchClick) {
      const input = document.querySelector(".mobile-view");
      if (input && input.classList) input.classList.remove("mobile-view");
      this.removeEventsSearch();
      this.setState({
        searchKeyword: "",
      });
    }
  };
  handleSearchInputChange = (e) => {
    this.setState({
      searchKeyword: e.target.value,
    });
  };
  handleSearchInputKeyPress = (e) => {
    if (e.key === "Enter") {
      this.search();
    }
  };

  search = () => {
    this.props.history.push(searchPath + "/" + this.state.searchKeyword);
    this.setState({
      searchKeyword: "",
    });
  };

  toggleFullScreen = () => {
    const isInFullScreen = this.isInFullScreen();

    var docElm = document.documentElement;
    if (!isInFullScreen) {
      if (docElm.requestFullscreen) {
        docElm.requestFullscreen();
      } else if (docElm.mozRequestFullScreen) {
        docElm.mozRequestFullScreen();
      } else if (docElm.webkitRequestFullScreen) {
        docElm.webkitRequestFullScreen();
      } else if (docElm.msRequestFullscreen) {
        docElm.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
    this.setState({
      isInFullScreen: !isInFullScreen,
    });
  };

  handleLogout = () => {
    this.props.logoutUser(this.props.history);
  };

  menuButtonClick = (e, menuClickCount, containerClassnames) => {
    e.preventDefault();

    setTimeout(() => {
      var event = document.createEvent("HTMLEvents");
      event.initEvent("resize", false, false);
      window.dispatchEvent(event);
    }, 350);
    this.props.setContainerClassnames(
      ++menuClickCount,
      containerClassnames,
      this.props.selectedMenuHasSubItems
    );
  };
  mobileMenuButtonClick = (e, containerClassnames) => {
    e.preventDefault();
    this.props.clickOnMobileMenu(containerClassnames);
  };

  render() {
    const { containerClassnames, menuClickCount } = this.props;
    return (
      <>
        <nav className="navbar fixed-top">
          <div className="d-flex align-items-center navbar-left">
            <NavLink
              to="#"
              location={{}}
              className="menu-button d-none d-md-block"
              onClick={(e) =>
                this.menuButtonClick(e, menuClickCount, containerClassnames)
              }
            >
              <MenuIcon />
            </NavLink>
            <NavLink
              to="#"
              location={{}}
              className="menu-button-mobile d-xs-block d-sm-block d-md-none"
              onClick={(e) =>
                this.mobileMenuButtonClick(e, containerClassnames)
              }
            >
              <MobileMenuIcon />
            </NavLink>
          </div>
          <a className="navbar-logo w-25" href="/app/sdg/dashboard">
            <span className="logo d-none d-xs-block" />
            <span className="logo-mobile d-block d-xs-none" />
          </a>
          <div className="navbar-right">
            {isDarkSwitchActive && <TopnavDarkSwitch />}

            <div className="header-icons d-inline-block align-middle">
              <TopnavNotifications
                showModal={() => {
                  this.setState({ notificationmodal: true });
                }}
              />
              <button
                className="header-icon btn btn-empty d-none d-sm-inline-block"
                type="button"
                id="fullScreenButton"
                onClick={this.toggleFullScreen}
              >
                {this.state.isInFullScreen ? (
                  <i className="simple-icon-size-actual d-block" />
                ) : (
                  <i className="simple-icon-size-fullscreen d-block" />
                )}
              </button>
            </div>
            <div className="user d-inline-block">
              <UncontrolledDropdown className="dropdown-menu-right">
                <DropdownToggle className="p-0" color="empty">
                  <span className="name mr-1">{this.props.authUser.user}</span>
                  <span>
                    <img
                      alt="Profile"
                      src="/dashboard/assets/img/sdg_logo.jpg"
                    />
                  </span>
                </DropdownToggle>
                <DropdownMenu className="mt-3" right>
                  <DropdownItem
                    onClick={() => this.props.history.push("/app/userprofile")}
                  >
                    Profile
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem onClick={() => this.handleLogout()}>
                    Sign out
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </div>
          </div>
        </nav>
        <Modal
          show={this.state.notificationmodal}
          size="lg"
          backdrop={"static"}
        >
          <Modal.Header className={"font-weight-bold h5"}>
            Notifications
            <i
              class="fa-lg fas fa-times text-dark float-right cursor-pointer"
              onClick={() => this.setState({ notificationmodal: false })}
            ></i>
          </Modal.Header>
          <Modal.Body>
            <Row className="w-100">
              <Colxx lg="12" className="h6">
                <PerfectScrollbar
                  options={{ suppressScrollX: true, wheelPropagation: false }}
                  style={{ height: "500px" }}
                >
                  {[
                    {
                      img: "/dashboard/assets/img/sdg_logo.jpg",
                      title: "New Target value added.",
                      date: "5 July 2022",
                    },
                    {
                      img: "/dashboard/assets/img/sdg_logo.jpg",
                      title: "New Target value added.",
                      date: "5 July 2022",
                    },
                  ].map((notification, index) => {
                    return <NotificationItem key={index} {...notification} />;
                  })}
                </PerfectScrollbar>
              </Colxx>
            </Row>
          </Modal.Body>
          {/* <Modal.Footer className="d-flex justify-content-between">
            <Button
              color="primary"
              onClick={() => {
                // this.setState({ modal: false });
                this.deleteLog();
              }}
            >
              Yes
            </Button>
            <Button
              color="primary"
              onClick={() => {
                this.setState({ modal: false });
              }}
            >
              No
            </Button>
          </Modal.Footer> */}
        </Modal>
      </>
    );
  }
}

const mapStateToProps = ({ menu, settings, authUser }) => {
  const { containerClassnames, menuClickCount, selectedMenuHasSubItems } = menu;
  const { locale } = settings;
  return {
    containerClassnames,
    menuClickCount,
    selectedMenuHasSubItems,
    locale,
    authUser,
  };
};
export default connect(mapStateToProps, {
  setContainerClassnames,
  clickOnMobileMenu,
  logoutUser,
  changeLocale,
})(TopNav);
