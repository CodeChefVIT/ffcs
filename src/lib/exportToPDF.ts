import { getGlobalCourses } from "./globalCourses";
import { clashMap } from "./slots";
import { fullCourseData } from "./type";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import type { TDocumentDefinitions } from "pdfmake/interfaces";

(pdfMake as typeof pdfMake & { vfs: Record<string, string> }).vfs =
  pdfFonts.vfs;

interface TableCell {
  text: string;
  alignment: "center";
  margin: [number, number];
  valign: "middle";
}

export const exportToPDF = async (): Promise<void> => {
  const colors = {
    pageBg: "#a6d5d7",
    headerBg: "#77d3d7",
    cellBg: "#b8e0e2",
    altCellBg: "#cae6e7",
    emptyBg: "#e0eff0",
    border: "#000000",
    text: "#000000",
  };

  const courses: fullCourseData[] = getGlobalCourses();
  if (!courses || courses.length === 0) {
    throw new Error("No course data available to export.");
  }

  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  const getAmPmTime = (date: Date) => {
    let hours = date.getHours();
    const minutes = pad(date.getMinutes());
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${pad(hours)}:${minutes} ${ampm}`;
  };
  const dateTime = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
    now.getDate()
  )} ${getAmPmTime(now)}`;

  const makeCell = (text: string): TableCell => ({
    text,
    alignment: "center",
    margin: [0, 5],
    valign: "middle",
  });

  const tableBody: TableCell[][] = [
    [
      makeCell("Course Name"),
      makeCell("Faculty"),
      makeCell("Theory Slot"),
      makeCell("Lab Slot"),
      makeCell("Clashes With"),
    ],
  ];

  for (const course of courses) {
    const courseLabel =
      course.courseType === "both"
        ? `${course.courseName} & Lab`
        : course.courseName;

    let isFirstEntry = true;

    for (const slot of course.courseSlots) {
      for (const faculty of slot.slotFaculties) {
        const theorySlot =
          course.courseType === "th" || course.courseType === "both"
            ? slot.slotName
            : "";
        const labSlot =
          course.courseType === "lab"
            ? slot.slotName
            : faculty.facultyLabSlot ?? "";
        const labSlots = labSlot.split(", ");

        for (const lab of labSlots) {
          const notes: string[] = [];

          const clashKey = [...theorySlot.split("+"), ...lab.split("+")];
          for (const row of tableBody.slice(1)) {
            const rowTheory = row[2].text;
            const rowLab = row[3].text;
            const existingSlots = [
              ...rowTheory.split("+"),
              ...rowLab.split("+"),
            ];

            const occupiedSlots: string[] = [];
            for (const s of existingSlots) {
              if (clashMap[s]) occupiedSlots.push(...clashMap[s]);
            }

            if (
              clashKey.some((slot) => occupiedSlots.includes(slot)) ||
              clashKey.some((slot) => existingSlots.includes(slot))
            ) {
              notes.push(row[1].text);
            }
          }

          tableBody.push([
            makeCell(isFirstEntry ? courseLabel : ""),
            makeCell(faculty.facultyName),
            makeCell(theorySlot),
            makeCell(lab),
            makeCell(notes.filter(Boolean).join(", ")), // fix: remove empty strings and trailing commas
          ]);

          isFirstEntry = false;
        }
      }
    }

    tableBody.push([
      makeCell(""),
      makeCell(""),
      makeCell(""),
      makeCell(""),
      makeCell(""),
    ]);
  }

  const docDefinition: TDocumentDefinitions = {
    pageOrientation: "landscape",
    pageMargins: [40, 60, 40, 40],

    background: (_currentPage, pageSize) => ({
      canvas: [
        {
          type: "rect",
          x: 0,
          y: 0,
          w: pageSize.width,
          h: pageSize.height,
          color: colors.pageBg,
        },
      ],
    }),

    footer: (currentPage, pageCount) => ({
      columns: [
        {
          text: "FFCS-inator by CodeChefVIT",
          alignment: "left",
          margin: [40, 0, 0, 0],
          italics: true,
          fontSize: 9,
          color: colors.text,
        },
        {
          text: `Page ${currentPage} of ${pageCount}`,
          alignment: "right",
          margin: [0, 0, 40, 0],
          italics: true,
          fontSize: 9,
          color: colors.text,
        },
      ],
    }),

    content: [
      {
        text: "FFCS - Subjects and Faculties Report",
        style: "header",
        color: colors.text,
      },
      {
        text: `Exported on: ${dateTime}`,
        style: "subheader",
        color: colors.text,
      },
      {
        style: "tableStyle",
        table: {
          headerRows: 1,
          widths: [120, 100, 80, 80, "*"],
          body: tableBody,
        },
        layout: {
          fillColor: (rowIndex, node) => {
            if (rowIndex === 0) return colors.headerBg;

            const row = node.table.body[rowIndex];
            const isTableCell = (cell: unknown): cell is TableCell =>
              typeof cell === "object" && cell !== null && "text" in cell;
            const isEmptyRow = row.every(
              (cell: unknown) => isTableCell(cell) && cell.text === ""
            );
            if (isEmptyRow) return colors.emptyBg;

            return rowIndex % 2 === 0 ? colors.cellBg : colors.altCellBg;
          },
          hLineWidth: () => 0.5,
          vLineWidth: () => 0.5,
          hLineColor: () => colors.border,
          vLineColor: () => colors.border,
        },
      },
    ],

    styles: {
      header: { fontSize: 18, bold: true, margin: [0, 0, 0, 6] },
      subheader: { fontSize: 10, margin: [0, 0, 0, 12] },
      tableStyle: { fontSize: 9 },
    },
  };

  pdfMake
    .createPdf(docDefinition)
    .download(`timetable_${dateTime.replace(/[: ]/g, "_")}.pdf`);
};
