"use client";

import CompoundTable from "@/components/timetable/CompoundTable";

const data = [
  { code: "BBRT101L", slot: "TG1", name: "Mansi Sharma" },
  { code: "BBRT101P", slot: "L21+L22", name: "Mansi Sharma" },
  { code: "BBIT101L", slot: "A1+TA1", name: "Samya Mehta" },
  { code: "BBIT101P", slot: "L31+L32", name: "Samya Mehta" },
  { code: "BERT101L", slot: "B1", name: "Yashita Puri" },
  { code: "BERT101P", slot: "L59+L60", name: "Yashita Puri" },
  { code: "BBRT101L", slot: "C1", name: "Kuriak Tom Jacob" },
  { code: "BBRT101P", slot: "L43+L44", name: "Kuriak Tom Jacob" },
  { code: "BBRT101L", slot: "D1", name: "Abhinav Pant" },
  { code: "BBRT101L", slot: "F1+TF1", name: "Ishan Jindal" },
  { code: "BBRT101P", slot: "L47+L48", name: "Ishan Jindal" },
];

export default function View() {

  return (
    <CompoundTable data={data} />
  );
}
