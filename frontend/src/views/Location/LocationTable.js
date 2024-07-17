import React, { Component } from "react";
import { Card, Row } from "react-bootstrap";
// import { Link } from "react-router-dom";
import Table from "../common/Table";
// import {
//   UncontrolledButtonDropdown,
//   DropdownToggle,
//   DropdownMenu,
//   DropdownItem,
// } from "reactstrap";

class LocationTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModel: false,
      column_list: [
        {
          Header: "Location Name",
          accessor: "name",
        },
        {
          Header: "Latitude",
          accessor: "latitude",
        },
        {
          Header: "Longitude",
          accessor: "longitude",
        },
        {
          Header: "District",
          accessor: "district",
        },
        {
          Header: "Pincode",
          accessor: "pincode",
        },
        {
          Header: "Location Description",
          accessor: "description",
        },
        // {
        //   Header: "Actions",
        //   accessor: (row, rowIndex) => row,
        //   Cell: (props) => (
        //     <>
        //       {props?.cell?.value ? (
        //         <div className="pl-4">
        //           <UncontrolledButtonDropdown color="link" direction="left">
        //             <DropdownToggle
        //               color="link"
        //               style={{ color: "rgb(50, 50, 50)" }}
        //               className="p-0 font-weight-bold text-center"
        //             >
        //               <i
        //                 className="iconsminds-gear"
        //                 style={{ color: "gray" }}
        //               ></i>
        //             </DropdownToggle>
        //             <DropdownMenu>
        //               <DropdownItem>
        //                 {" "}
        //                 <Link
        //                   to={`/app/company/edit/${props.cell.value.company_id}`}
        //                 >
        //                   <i
        //                     className="fas fa-edit mr-1"
        //                     style={{ color: "gray" }}
        //                   />
        //                   Edit Location
        //                 </Link>
        //               </DropdownItem>
        //               <DropdownItem
        //                 className="badge-danger cursor-pointer"
        //                 onClick={() =>
        //                   this.props.deleteColumn(props.cell.value.id)
        //                 }
        //               >
        //                 <i class="far fa-trash-alt mr-1"></i>Delete Location
        //               </DropdownItem>
        //             </DropdownMenu>
        //           </UncontrolledButtonDropdown>
        //         </div>
        //       ) : (
        //         <></>
        //       )}
        //     </>
        //   ),
        // },
      ],
    };
  }

  render() {
    return (
      <Row className="rounded mt-4 ml-2">
        <Card>
          <Table
            columns={this.state.column_list}
            data={this.props.locations}
            dataUpdateFunction={(data) => this.props.updateMyData(data)}
            tableIndex={"locationsTableIndex"}
            noPagination={this.props.locations?.length > 10 ? false : true}
            columnFilter={[
              { name: "Scheme Name", dropDown: false },
              { name: "Department", dropDown: true },
              { name: "Scheme Description", dropDown: false },
            ]}
          />
        </Card>
      </Row>
    );
  }
}

LocationTable.propTypes = {};

export default LocationTable;
