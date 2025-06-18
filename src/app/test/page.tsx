'use client';

import React from 'react';
import ExcelJS from 'exceljs';

export default function Home() {

  const exportToExcel = async () => {
    const data: (number | string)[][] = [
      [1, 2, 3],
      [4, "test download", 6],
      [7, "Please wait for feature implementation", 9],
    ];
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Sheet1');

    data.forEach((row) => {
      const newRow = sheet.addRow(row);
      newRow.eachCell((cell) => {
        cell.font = { bold: true, italic: true, color: { argb: 'FF0000FF' } };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFFF00' }, // Yellow background
        };
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'report.xlsx';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button onClick={exportToExcel}>Download Excel</button>
  );
}
