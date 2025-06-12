"use client";

import CompoundTable from "@/components/timetable/CompoundTable";

const data = [
  { code: "BBRT101L", slot: "TG1", name: "Mansi Sharma" },
  { code: "BBRT101P", slot: "L21+L22", name: "Mansi Sharma" },
  { code: "BBIT101L", slot: "A1", name: "Monami Som Saha" },
  { code: "BBIT101P", slot: "L31+L32", name: "Monami Som Saha" },
  { code: "BERT101L", slot: "B1", name: "Yashita Puri" },
  { code: "BBRT101L", slot: "C1", name: "Kuriak Tom Jacob" },
  { code: "BBRT101P", slot: "L43+L44", name: "Kuriak Tom Jacob" },
  { code: "BBRT101L", slot: "D1", name: "Abhinav Pant" },
  { code: "BBRT101L", slot: "F2", name: "Ishan Jindal" },
  { code: "BBRT101P", slot: "F2", name: "Ishan Jindal" },
  { code: "BBRT191L", slot: "F2", name: "Ishan Jindal" },
];

export default function View() {

  return (
    <div>
      <CompoundTable data={data} />
    </div>
  );
}
