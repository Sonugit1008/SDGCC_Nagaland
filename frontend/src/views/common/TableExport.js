import React from "react";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

export const TableExport = ({ fileName }) => {
  const fileExtension = ".xlsx";

  const handleTableExport = (fileName) => {
    try {
      const table = document.querySelector("table");
      if (!table) {
        throw new Error("Table not found");
      }

      // Clone the table to avoid modifying the original table
      const clonedTable = table.cloneNode(true);

      // Remove the second row
      const secondRow = clonedTable.querySelector("tr:nth-child(2)");
      if (secondRow) {
        secondRow.remove();
      }

      // Remove the last and second last columns from each row
      clonedTable.querySelectorAll("tr").forEach((row) => {
        const cells = row.querySelectorAll("td, th");
        if (cells.length > 1) {
          const secondLastCell = cells[cells.length - 2];
          if (secondLastCell) {
            secondLastCell.remove();
          }
        }
        const lastCell = cells[cells.length - 1];
        if (lastCell) {
          lastCell.remove();
        }
      });

      const ws = XLSX.utils.table_to_sheet(clonedTable);

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      XLSX.writeFile(wb, fileName + fileExtension);
    } catch (error) {
      console.error("Error exporting table to Excel:", error);
    }
  };

  return (
    <button
      onClick={() => handleTableExport(fileName)}
      className="btn btn-success mt-2 ml-2"
    >
      <i className="iconsminds-save"> Export</i>
    </button>
  );
};
