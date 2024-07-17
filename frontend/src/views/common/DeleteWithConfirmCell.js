import React from "react";
import { Fragment } from "react";

import ConfirmModal from "./ConfirmModal";

function DeleteWithConfirmCell({
  value: initialValue,
  deleteColumn
}) {

  const [isModel, setIsModel] = React.useState(false);

  return (
    <Fragment>
    {console.log("zzzzzzzzz",initialValue.id)}
      <i className="btn btn-primary simple-icon-trash py-2 px-3" onClick={() => setIsModel(true)} style={{zIndex:"1"}}/>
      { isModel ? <ConfirmModal closePopUp={() => setIsModel(false)} finalfunction={() => deleteColumn(initialValue.id)} message={"Are you sure you want to delete this item ?"} /> : null}
    </Fragment>
  );
}

export default DeleteWithConfirmCell;
