import React from "react";

function CardBodyCell({
  className,
  value,
  name,
  periodicity,
  editPeriodicity,
  deletePeriodicity,
}) {
  return (
    <div className="icon-cards-row rounded">
      <div className="icon-row-item mt-4 mb-4">
        <div className="card" style={{ cursor: "default" }}>
          {periodicity ? (
            <div
              className="d-flex justify-content-end position-absolute"
              style={{ fontSize: "16px", top: "-16px", right: "10px" }}
            >
              <i
                className="fa fa-edit  cursor-pointer"
                style={{ fontSize: "16px" }}
                onClick={() => {
                  editPeriodicity();
                }}
              />
              <i
                className="fa fa-trash cursor-pointer ml-1"
                style={{ fontSize: "16px" }}
                onClick={() => {
                  deletePeriodicity();
                }}
              />
            </div>
          ) : (
            <></>
          )}
          <div className="text-center card-body">
            <i className={className}></i>
            <p className="card-text font-weight-semibold mb-0">{name}</p>
            <p className="lead text-center">{value}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardBodyCell;
