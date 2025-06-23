import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getGlobalCourses } from "./globalCourses";
import { clashMap } from "./slots";
import { fullCourseData } from "./type";

export const exportToPDF = async () => {
  const courses: fullCourseData[] = getGlobalCourses();

  if (!courses || courses.length === 0) {
    throw new Error("No course data available to export.");
  }

  const doc = new jsPDF({ orientation: "landscape" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  const dateTime = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
    now.getDate()
  )} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

  const tableBody: string[][] = [];

  for (const course of courses) {
    const courseLabel =
      course.courseType === "both"
        ? `${course.courseName} & Lab`
        : course.courseName;

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
          for (const row of tableBody) {
            const rowTheory = row[2] || "";
            const rowLab = row[3] || "";
            const existingSlots = [
              ...rowTheory.split("+"),
              ...rowLab.split("+"),
            ];

            const occupiedSlots: string[] = [];
            for (const s of existingSlots) {
              if (clashMap[s]) {
                occupiedSlots.push(...clashMap[s]);
              }
            }

            if (
              clashKey.some((slot) => occupiedSlots.includes(slot)) ||
              clashKey.some((slot) => existingSlots.includes(slot))
            ) {
              notes.push(row[1] || "");
            }
          }

          tableBody.push([
            courseLabel,
            faculty.facultyName,
            theorySlot,
            lab,
            notes.join(", "),
          ]);
        }
      }
    }

    tableBody.push(["", "", "", "", ""]);
  }

  autoTable(doc, {
    head: [
      ["Course Name", "Faculty", "Theory Slot", "Lab Slot", "Clashes With"],
    ],
    body: tableBody,
    startY: 30,
    theme: "striped",
    styles: {
      font: "helvetica",
      fontSize: 8,
      textColor: [0, 0, 0],
      cellPadding: 2,
      lineWidth: 0.2, // Add border width
      lineColor: [0, 0, 0], // Add border color (black)
    },
    headStyles: {
      fillColor: [166, 213, 215],
      textColor: [0, 0, 0],
      fontStyle: "bold",
      lineWidth: 0.4, // Thicker border for header
      lineColor: [0, 0, 0],
    },
    columnStyles: {
      0: { cellWidth: 60 },
      1: { cellWidth: 40 },
      2: { halign: "center", cellWidth: 30 },
      3: { halign: "center", cellWidth: 30 },
      4: { cellWidth: 90 },
    },
    margin: { top: 30, left: 14, right: 14 },
    didDrawPage: () => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text("Faculty Slot Allocation", 14, 16);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Exported on: ${dateTime}`, 14, 22);

      const pageNumber = (
        doc as jsPDF & { internal: { getNumberOfPages: () => number } }
      ).internal.getNumberOfPages();
      doc.setFontSize(9);
      doc.setFont("helvetica", "italic");
      doc.text("FFCS-inator by CodeChefVIT", 14, pageHeight - 10);
      doc.text(`Page ${pageNumber}`, pageWidth - 14, pageHeight - 10, {
        align: "right",
      });
    },
  });

  doc.save(`timetable_${dateTime.replace(/[: ]/g, "_")}.pdf`);
};
