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

class UnitTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModel: false,
      column_list: [
        {
          Header: "Unit Name",
          accessor: "name",
        },
        {
          Header: "Unit Type",
          accessor: "type",
        },
        {
          Header: "Unit Value",
          accessor: "value",
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
        //                   Edit Unit
        //                 </Link>
        //               </DropdownItem>
        //               <DropdownItem
        //                 className="badge-danger cursor-pointer"
        //                 onClick={() =>
        //                   this.props.deleteColumn(props.cell.value.id)
        //                 }
        //               >
        //                 <i class="far fa-trash-alt mr-1"></i>Delete Unit
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
            data={this.props.units}
            dataUpdateFunction={(data) => this.props.updateMyData(data)}
            tableIndex={"unitsTableIndex"}
            noPagination={this.props.units?.length > 10 ? false : true}
            columnFilter={[
              { name: "Unit Name", dropDown: false },
              { name: "Unit Type", dropDown: false },
              { name: "Unit Value", dropDown: false },
            ]}
          />
        </Card>
      </Row>
    );
  }
}

UnitTable.propTypes = {};

export default UnitTable;
