import { getGlobalCourses } from "./globalCourses";
import { clashMap } from "./slots";
import { fullCourseData } from "./type";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import type { TDocumentDefinitions } from "pdfmake/interfaces";
import { getCurrentDateTime } from "./utils";

(pdfMake as typeof pdfMake & { vfs: Record<string, string> }).vfs =
  pdfFonts.vfs;

interface TableCell {
  text: string;
  alignment: "left" | "center" | "right";
  margin: [number, number];
  valign: "top";
}

export const exportToPDF = async (): Promise<void> => {
  const colors = {
    pageBg: "#FFFFFF",
    headerBg: "#7AC1C2",
    cellBg: "#CDE8EA",
    emptyBg: "#FFFFFF",
    border: "#000000",
    text: "#000000"
  };

  const courses: fullCourseData[] = getGlobalCourses();
  if (!courses || courses.length === 0) {
    throw new Error("No course data available to export.");
  }

  const dateTime = getCurrentDateTime();

  const makeCell = (text: string, color?: string, align: "left" | "center" | "right" = "left"): TableCell => ({
    text,
    alignment: align,
    margin: [0, 5],
    valign: "top",
    ...(color ? { color } : {}),
  });

  const tableBody: TableCell[][] = [
    [
      makeCell("SNo.", colors.text, "center"),
      makeCell("Course Name", colors.text, "center"),
      makeCell("Faculty", colors.text, "center"),
      makeCell("Theory Slot", colors.text, "center"),
      makeCell("Lab Slot", colors.text, "center"),
      makeCell("Clashes With", colors.text, "center"),
    ].map(cell => ({ ...cell, bold: true })) as TableCell[],
  ];

  let subjectCount = 1;
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

        labSlots.forEach((lab) => {
          const notes: string[] = [];

          var clashKey = [...theorySlot.split("+"), ...lab.split("+")];
          clashKey = clashKey.filter((slot) => slot.trim() !== "");

          for (const row of tableBody.slice(1)) {
            const rowTheory = row[3].text;
            const rowLab = row[4].text;
            const prevCourseLabel = row[1].text;

            var existingSlots: string[] = [];

            if (courseLabel !== prevCourseLabel) {
              existingSlots = [
                ...rowTheory.split("+"),
                ...rowLab.split("+"),
              ];
            }

            existingSlots = existingSlots.filter((slot) => slot.trim() !== "");

            var occupiedSlots: string[] = [];
            for (const s of existingSlots) {
              if (clashMap[s]) occupiedSlots.push(...clashMap[s]);
            }

            occupiedSlots = occupiedSlots.filter((slot) => slot.trim() !== "");

            if (
              clashKey.some((slot) => occupiedSlots.includes(slot)) ||
              clashKey.some((slot) => existingSlots.includes(slot))
            ) {
              notes.push(row[2].text);
            }
            console.log("existingSlots", existingSlots);
            console.log("clashKey", clashKey);
          }


          if (
            courseLabel.trim() !== "" ||
            faculty.facultyName.trim() !== "" ||
            theorySlot.trim() !== "" ||
            lab.trim() !== "" ||
            notes.filter((n) => n.trim() !== "").length > 0
          ) {
            tableBody.push([
              makeCell(
                subjectCount.toString() + ".",
                isFirstEntry
                  ? colors.text
                  : colors.cellBg,
                "center"
              ),
              makeCell(
                courseLabel,
                isFirstEntry
                  ? colors.text
                  : colors.cellBg
              ),
              makeCell(faculty.facultyName),
              makeCell(theorySlot, colors.text, "center"),
              makeCell(lab, colors.text, "center"),
              makeCell(notes.filter((n) => n.trim() !== "").join(", "), "#BB0000"),
            ]);
          }

          isFirstEntry = false;
        });
      }
    }

    subjectCount++;

    if (subjectCount !== courses.length + 1) {
      tableBody.push([
        makeCell(""),
        makeCell(""),
        makeCell(""),
        makeCell(""),
        makeCell(""),
        makeCell(""),
      ]);
    }
  }

  const docDefinition: TDocumentDefinitions = {
    pageOrientation: "landscape",
    pageMargins: [20, 20, 20, 20],

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
          margin: [20, 0, 0, 0],
          italics: true,
          fontSize: 8,
          color: colors.text,
        },
        {
          text: `Page ${currentPage} of ${pageCount}`,
          alignment: "right",
          margin: [0, 0, 20, 0],
          italics: true,
          fontSize: 8,
          color: colors.text,
        },
      ],
    }),

    content: [
      {
        text: "FFCS - Subjects and Faculties Report",
        style: "header",
        color: colors.text,
        alignment: "center",
      },
      {
        text: `Exported on: ${dateTime}`,
        style: "subheader",
        color: colors.text,
        alignment: "center",
      },
      {
        style: "tableStyle",
        table: {
          headerRows: 1,
          widths: [25, 150, 120, 75, 95, "*"],
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

            return colors.cellBg;
          },
          hLineWidth: () => 0.5,
          vLineWidth: () => 0.5,
          hLineColor: () => colors.border,
          vLineColor: () => colors.border,
        },
        alignment: "center",
      },
    ],

    styles: {
      header: { fontSize: 20, bold: true, margin: [0, 0, 0, 6] },
      subheader: { fontSize: 12, margin: [0, 0, 0, 12] },
      tableStyle: { fontSize: 10 },
    },
  };

  pdfMake
    .createPdf(docDefinition)
    .download(`timetable_${dateTime.replace("-", "_").replace("-", "_").replace(" ", "_")}.pdf`);
};
