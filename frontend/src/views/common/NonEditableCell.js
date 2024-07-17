import React from "react";

function NonEditableCell({
  value: initialValue,
  row: { index },
  column: { id },
  updateMyData,
}) { 
  return <span style={{fontSize: '16px'}}>{initialValue === undefined || initialValue === '' || initialValue === null ? "NA" : initialValue}</span>
}

export default NonEditableCell;
