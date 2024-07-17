import React, { Component, Fragment } from "react";
import { Modal } from "react-bootstrap";
import ResetUserPassword from "./reset-user-password";
import PageHeader from "../common/PageHeader";
import apiAuth from "../../helpers/ApiAuth";
import UserTable from "./UserTable";
import UserCard from "./UserCard";
import { connect } from "react-redux";
import { NotificationManager } from "../../components/common/react-notifications";

class UserManagement extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // users: [
      //   {
      //     profile_picture: "/dashboard/assets/img/profile-pic-2.jpg",
      //     first_name: "Vamshi",
      //     middle_name: "Kumar",
      //     last_name: "Krishna",
      //     mobile: "6377803337",
      //     email: "vamshi@darsa.ai",
      //     groups: ["Data Entry Operator"],
      //     department: "Information Technology",
      //   },
      //   {
      //     profile_picture: "/dashboard/assets/img/profile-pic-1.jpg",
      //     first_name: "Manish",
      //     middle_name: "Kumar",
      //     last_name: "Kumawat",
      //     mobile: "6377803337",
      //     email: "manish@darsa.ai",
      //     groups: ["Data Entry Operator"],
      //     department: "Information Technology",
      //   },
      // ],
      users: [],
      companies: [],
      filter: "",
      display: "table",
      is_show_model: false,
      selectedRow: {},
    };

    this.getUsers = this.getUsers.bind(this);
    // this.getCompanies = this.getCompanies.bind(this);
    this.deactivateUser = this.deactivateUser.bind(this);
  }

  getUsers() {
    let url = "/api/admin/users/";
    apiAuth
      .get(url)
      .then((response) => {
        let usrs;

        usrs = response.data.map((user) => {
          user["departments"] = user.department?.join(",");
          return user;
        });

        this.setState({ users: usrs });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  //   getCompanies() {
  //     if (
  //       this.props.role === "company_admin" ||
  //       this.props.role === "trip_odo_admin"
  //     ) {
  //       let comp = [];
  //       comp.push(this.props.company);
  //       this.setState({ companies: comp }, () => {
  //         this.getUsers();
  //       });
  //     } else {
  //       apiAuth
  //         .get("/api/admin/company/")
  //         .then((response) => {
  //           this.setState({ companies: response.data }, () => {
  //             this.getUsers();
  //           });
  //         })
  //         .catch(function (error) {
  //           console.log(error?.response?.data);
  //           console.log(error?.response?.status);
  //           console.log(error?.response?.headers);
  //         });
  //     }
  //   }

  componentDidMount() {
    // this.getCompanies();
    this.getUsers();
  }

  updateMyData = (data) => {
    data["groups"] =
      typeof data["groups"] === "string" ? [data["groups"]] : data["groups"];
    data["company"] =
      typeof data["company"] === "string" ? [data["company"]] : data["company"];

    this.setState({ isLoading: true });

    apiAuth
      .put(`/api/admin/users/${data["id"]}`, data)
      .then((response) => {
        NotificationManager.success(
          "",
          "User Updated Successfully",
          3000,
          null,
          null,
          ""
        );
        this.getUsers();
        this.setState({ isLoading: false });
      })
      .catch(function (error) {
        console.log(error?.response?.data);
        console.log(error?.response?.status);
        console.log(error?.response?.headers);
        NotificationManager.error(
          error?.response?.data?.detail,
          `User Management Error ${error?.response?.status}`,
          3000,
          null,
          null,
          ""
        );
        this.setState({ isLoading: false });
      });
  };

  deactivateUser(id) {
    this.setState({ isLoading: true });
    let url =
      this.props.role === "company_admin" ||
      this.props.role === "trip_odo_admin"
        ? `/api/company_admin/users/${id}/`
        : `/api/admin/users/${id}/`;
    apiAuth
      .delete(url)
      .then((response) => {
        NotificationManager.success(
          "",
          "User Deactivated Successfully",
          3000,
          null,
          null,
          ""
        );
        this.getUsers();
        this.setState({ isLoading: false });
      })
      .catch(function (error) {
        console.log(error);
        console.log(error.response?.data);
        console.log(error.response?.status);
        console.log(error.response?.headers);
      });
  }

  render() {
    return (
      <Fragment>
        {" "}
        <PageHeader
          heading={"User Management"}
          is_filter={true}
          filter_func={(text) => this.setState({ filter: text, activePage: 0 })}
          history={this.props.history}
          match={this.props.match}
          add_new={this.props.permission.edit}
          add_new_url={"/app/usermanagement/add"}
          // add_upload={this.props.permission.edit}
          // add_upload_url={"/app/userupload"}
          back_button={false}
          displaySelector={false}
          changeDisplay={(val) => {
            this.setState({ display: val });
          }}
        ></PageHeader>
        {this.state.display === "card" ? (
          <UserCard
            history={this.props.history}
            users={this.state.users.filter((user) =>
              user.email.toLowerCase().includes(this.state.filter.toLowerCase())
            )}
          ></UserCard>
        ) : (
          <Fragment>
            {this.state.users?.length ? (
              <UserTable
                users={this.state.users.filter((user) =>
                  user.email
                    .toLowerCase()
                    .includes(this.state.filter.toLowerCase())
                )}
                updateMyData={(data) => this.updateMyData(data)}
                resetAction={(data) => {
                  this.setState({ selectedRow: data, is_show_model: true });
                }}
                deactivateUser={(data) => this.deactivateUser(data)}
              />
            ) : (
              <>
                <div className="loading"></div>
              </>
            )}
          </Fragment>
        )}
        <Modal
          show={this.state.is_show_model}
          onHide={() => this.setState({ is_show_model: false })}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header>
            <Modal.Title>Reset Password</Modal.Title>
            <i
              className="fa fa-close fa-2x cursor-pointer"
              onClick={() => {
                this.setState({ is_show_model: false });
              }}
            />
          </Modal.Header>
          <Modal.Body>
            <ResetUserPassword
              selectedRow={this.state.selectedRow}
              closeResetPopup={() => this.setState({ is_show_model: false })}
            />
          </Modal.Body>
        </Modal>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ authUser }) => {
  let flag = {
    write: true,
    edit: true,
  };
  let rol = "superadmin";

  return {
    permission: flag,
    role: rol,
  };
};

const mapActionsToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapActionsToProps)(UserManagement);
