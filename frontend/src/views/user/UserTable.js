import React, { Component } from "react";
import { Card, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ExportToExcel } from "../common/ExportToExcel";
// import columns from "./UserTableColumn";
import Table from "../common/Table";
import { Colxx } from "../../components/common/CustomBootstrap";

class UserTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      column_list: [
        {
          Header: "Image",
          accessor: "profile_picture",
          Cell: ({ cell: { value } }) => (
            <>
              {value ? (
                <img
                  alt="Thumbnail"
                  src={value}
                  className="img-thumbnail list-thumbnail align-self-center rounded-circle ml-4"
                ></img>
              ) : (
                <></>
              )}
            </>
          ),
        },
        {
          Header: "First Name",
          accessor: "first_name",
        },
        {
          Header: "Last Name",
          accessor: "last_name",
        },
        {
          Header: "Mobile",
          accessor: "mobile",
        },
        {
          Header: "Email",
          accessor: "email",
        },
        {
          Header: "Department",
          accessor: "departments",
        },
        {
          Header: "Roles",
          accessor: (row, rowIndex) => row,
          Cell: ({ cell: { value }, row }) => <>{value?.groups[0]}</>,
        },
        {
          Header: "Actions",
          accessor: (row, rowIndex) => row,
          Cell: ({ cell: { value }, row }) => (
            <>
              {value ? (
                <div className="">
                  <Link to={`/app/usermanagement/edituser/${value?.id}`}>
                    <i
                      class="fas fa-edit cursor-pointer mr-1"
                      title={"Edit User"}
                    ></i>
                  </Link>
                  <i
                    className="iconsminds-reset cursor-pointer mr-1"
                    title={"Reset password"}
                    onClick={() => this.props.resetAction(row)}
                  >
                    {" "}
                  </i>
                  <i
                    class="fa fa-ban cursor-pointer"
                    title={"De active"}
                    onClick={() => this.props.deactivateUser(value.id)}
                  ></i>
                </div>
              ) : (
                <></>
              )}
            </>
          ),
        },
      ],
    };
  }
  shouldComponentUpdate(nextProps) {
    return this.props.users.length !== nextProps.users.length;
  }
  render() {
    return (
      <Row className="rounded mt-4">
        <Colxx lg="12">
          <Row className="d-flex justify-content-end mr-4 mb-2">
            <ExportToExcel
              apiData={this.props.users.map((user) => {
                const {
                  first_name,
                  last_name,
                  mobile,
                  email,
                  departments,
                  groups,
                } = user;
                return {
                  First_Name: first_name,
                  Last_Name: last_name,
                  Mobile: mobile,
                  Email: email,
                  Department: departments,
                  Roles: groups ? groups.join(",") : "",
                };
              })}
              fileName={"UsersData"}
            />
          </Row>
          <Card>
            <Table
              columns={this.state.column_list}
              data={this.props.users}
              noPagination={this.props.users?.length > 10 ? false : true}
              dataUpdateFunction={(data) => this.props.updateMyData(data)}
              tableIndex="userMangementTableIndex"
              columnFilter={[
                { name: "First Name", dropDown: false },
                { name: "Last Name", dropDown: false },
                { name: "Email", dropDown: false },
                { name: "Mobile", dropDown: false },
                { name: "Department", dropDown: false },
                { name: "Address", dropDown: false },
                { name: "Roles", dropDown: false, arrFilter: "groupfilter" },
              ]}
            />
          </Card>
        </Colxx>
      </Row>
    );
  }
}

UserTable.propTypes = {};

export default UserTable;
