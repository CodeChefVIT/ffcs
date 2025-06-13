import { NextResponse } from "next/server";

const chennaiSlots: { [key: string]: string[] } = {
  A1: ["L1", "L2", "L14"],
  F1: ["L2", "L15", "L16"],
  D1: ["L3", "L4", "L19", "L20"],
  TB1: ["L4"],
  TG1: ["L5", "L6"],
  A2: ["L31", "L32", "L44"],
  F2: ["L32", "L45", "L46"],
  D2: ["L33", "L34", "L49", "L50"],
  TB2: ["L34"],
  TG2: ["L35", "L36"],
  B1: ["L7", "L8", "L20"],
  G1: ["L8", "L21", "L22"],
  E1: ["L9", "L10", "L25", "L26"],
  TC1: ["L10"],
  TAA1: ["L11", "L12"],
  B2: ["L37", "L38", "L50"],
  G2: ["L38", "L51", "L52"],
  E2: ["L39", "L40", "L55", "L56"],
  TC2: ["L40"],
  TAA2: ["L41", "L42"],
  C1: ["L13", "L14", "L26"],
  TD1: ["L16"],
  TBB1: ["L17", "L18"],
  C2: ["L43", "L44", "L56"],
  TD2: ["L46"],
  TBB2: ["L47", "L48"],
  TE1: ["L22"],
  TCC1: ["L23", "L24"],
  TE2: ["L52"],
  TCC2: ["L53", "L54"],
  TA1: ["L27", "L28"],
  TF1: ["L28"],
  TDD1: ["L29", "L30"],
  TA2: ["L57", "L58"],
  TF2: ["L58"],
  TDD2: ["L59", "L60"],
  L1: ["A1", "F1"],
  L2: ["A1", "F1"],
  L3: ["D1", "TB1"],
  L4: ["D1", "TB1"],
  L5: ["TG1", "S11"],
  L6: ["TG1"],
  L31: ["A2", "F2"],
  L32: ["A2", "F2"],
  L33: ["D2", "TB2"],
  L34: ["D2", "TB2"],
  L35: ["TG2"],
  L36: ["TG2", "S3"],
  L7: ["B1", "G1"],
  L8: ["B1", "G1"],
  L9: ["E1", "TC1"],
  L10: ["E1", "TC1"],
  L11: ["TAA1"],
  L12: ["TAA1"],
  L37: ["B2", "G2"],
  L38: ["B2", "G2"],
  L39: ["E2", "TC2"],
  L40: ["E2", "TC2"],
  L41: ["TAA2"],
  L42: ["TAA2", "S1"],
  L13: ["C1", "A1"],
  L14: ["C1", "A1"],
  L15: ["F1", "TD1"],
  L16: ["F1", "TD1"],
  L17: ["TBB1"],
  L18: ["TBB1"],
  L43: ["C2", "A2"],
  L44: ["C2", "A2"],
  L45: ["F2", "TD2"],
  L46: ["F2", "TD2"],
  L47: ["TBB2"],
  L48: ["TBB2", "S4"],
  L19: ["D1", "B1"],
  L20: ["D1", "B1"],
  L21: ["G1", "TE1"],
  L22: ["G1", "TE1"],
  L23: ["TCC1"],
  L24: ["TCC1"],
  L49: ["D2", "B2"],
  L50: ["D2", "B2"],
  L51: ["G2", "TE2"],
  L52: ["G2", "TE2"],
  L53: ["TCC2"],
  L54: ["TCC2", "S1"],
  L25: ["E1", "C1"],
  L26: ["E1", "C1"],
  L27: ["TA1", "TF1"],
  L28: ["TA1", "TF1"],
  L29: ["TDD1"],
  L30: ["TDD1", "S15"],
  L55: ["E2", "C2"],
  L56: ["E2", "C2"],
  L57: ["TA2", "TF2"],
  L58: ["TA2", "TF2"],
  L59: ["TDD2"],
  L60: ["TDD2"],
};

const velloreSlots: { [key: string]: string[] } = {
  A1: ["L1", "L2", "L14"],
  F1: ["L2", "L15", "L16"],
  D1: ["L3", "L4", "L19", "L20"],
  TB1: ["L4"],
  TG1: ["L5", "L6"],
  A2: ["L31", "L32", "L44"],
  F2: ["L32", "L45", "L46"],
  D2: ["L33", "L34", "L49", "L50"],
  TB2: ["L34"],
  TG2: ["L35", "L36"],
  B1: ["L7", "L8", "L20"],
  G1: ["L8", "L21", "L22"],
  E1: ["L9", "L10", "L25", "L26"],
  TC1: ["L10"],
  TAA1: ["L11", "L12"],
  B2: ["L37", "L38", "L50"],
  G2: ["L38", "L51", "L52"],
  E2: ["L39", "L40", "L55", "L56"],
  TC2: ["L40"],
  TAA2: ["L41", "L42"],
  C1: ["L13", "L14", "L26"],
  V1: ["L16"],
  V2: ["L17", "L18"],
  C2: ["L43", "L44", "L56"],
  TD2: ["L46"],
  TBB2: ["L47", "L48"],
  TE1: ["L22"],
  TCC1: ["L23", "L24"],
  TE2: ["L52"],
  TCC2: ["L53", "L54"],
  TA1: ["L27", "L28"],
  TF1: ["L28"],
  TD1: ["L29", "L30"],
  TA2: ["L57", "L58"],
  TF2: ["L58"],
  TDD2: ["L59", "L60"],
  L1: ["A1", "F1"],
  L2: ["A1", "F1"],
  L3: ["D1", "TB1"],
  L4: ["D1", "TB1"],
  L5: ["TG1"],
  L6: ["TG1"],
  L31: ["A2", "F2"],
  L32: ["A2", "F2"],
  L33: ["D2", "TB2"],
  L34: ["D2", "TB2"],
  L35: ["TG2"],
  L36: ["TG2"],
  L7: ["B1", "G1"],
  L8: ["B1", "G1"],
  L9: ["E1", "TC1"],
  L10: ["E1", "TC1"],
  L11: ["TAA1"],
  L12: ["TAA1"],
  L37: ["B2", "G2"],
  L38: ["B2", "G2"],
  L39: ["E2", "TC2"],
  L40: ["E2", "TC2"],
  L41: ["TAA2"],
  L42: ["TAA2"],
  L13: ["C1", "A1"],
  L14: ["C1", "A1"],
  L15: ["F1", "V1"],
  L16: ["F1", "V1"],
  L17: ["V2"],
  L18: ["V2"],
  L43: ["C2", "A2"],
  L44: ["C2", "A2"],
  L45: ["F2", "TD2"],
  L46: ["F2", "TD2"],
  L47: ["TBB2"],
  L48: ["TBB2"],
  L19: ["D1", "B1"],
  L20: ["D1", "B1"],
  L21: ["G1", "TE1"],
  L22: ["G1", "TE1"],
  L23: ["TCC1"],
  L24: ["TCC1"],
  L49: ["D2", "B2"],
  L50: ["D2", "B2"],
  L51: ["G2", "TE2"],
  L52: ["G2", "TE2"],
  L53: ["TCC2"],
  L54: ["TCC2"],
  L25: ["E1", "C1"],
  L26: ["E1", "C1"],
  L27: ["TA1", "TF1"],
  L28: ["TA1", "TF1"],
  L29: ["TD1"],
  L30: ["TD1"],
  L55: ["E2", "C2"],
  L56: ["E2", "C2"],
  L57: ["TA2", "TF2"],
  L58: ["TA2", "TF2"],
  L59: ["TDD2"],
  L60: ["TDD2"],
};

type FacultyData = {
  faculty: string;
  facultySlot: string[];
  _id?: string;
};

type ResultType = FacultyData[][];
type GenerateData = FacultyData[][];

type Slot = string; // eg 'A1'
type Slots = Slot[];

type Timing = "MT" | "ET" | "Both";

const morning = [
  "A1",
  "B1",
  "C1",
  "D1",
  "E1",
  "F1",
  "G1",
  "A1",
  "B1",
  "C1",
  "D1",
  "E1",
  "F1",
  "G1",
  "TA1",
  "TB1",
  "TC1",
  "V1",
  "TE1",
  "TF1",
  "TG1",
  "TAA1",
  "V2",
  "TCC1",
  "TBB1",
  "TDD1",
  "TD1",
  "L31",
  "L37",
  "L43",
  "L49",
  "L55",
  "L32",
  "L38",
  "L44",
  "L50",
  "L56",
  "L33",
  "L39",
  "L45",
  "L51",
  "L57",
  "L34",
  "L40",
  "L46",
  "L52",
  "L58",
  "L35",
  "L41",
  "L47",
  "L53",
  "L59",
  "L36",
  "L42",
  "L48",
  "L54",
  "L60",
];
export async function POST(req: Request) {
  const body = await req.json();
  const selectedTime: Timing = body.slotTime;
  const inputData: GenerateData = body.generateData;
  const courseNames = body.facultyData as string[];

  if (inputData.length * inputData[0].length > 42) {
    return NextResponse.json(
      { message: "too many subjects are being passed", result: [], courseNames: [] },
      { status: 404 }
    );
  }

  const result: ResultType = [];
  let cur_slots: string[] = [];
  const cur: FacultyData[] = [];
  const toRemove: number[] = [];

  
  for (let i = 0; i < inputData.length; i++) {
    if (inputData[i].length === 0) toRemove.push(i);
  }
  toRemove.reverse().forEach(i => {
    inputData.splice(i, 1);
    courseNames.splice(i, 1);
  });

  function clashCheck(existing: string[], toAdd: string[]) {
    for (const s of toAdd) {
      if (selectedTime === "MT" && !morning.includes(s)) return false;
      if (selectedTime === "ET" && morning.includes(s)) return false;
      if (existing.includes(s)) return false;
    }
    return true;
  }

  const selectedCampus = "Vellore Campus";

  function generate(
    cur_slots_arr: Slots,
    cur_arr: FacultyData[],
    data: GenerateData,
    ind: number,
    n: number,
    check: number
  ) {
    if (ind >= n) {
      result.push([...cur_arr]);
      return;
    }

    
    if (cur_arr.length === check) {
      result.push([...cur_arr]);
    }

    for (let i = 0; i < data[ind].length; i++) {
      const candidate = data[ind][i];
      let slotsOfCurFaculty = [...candidate.facultySlot];

      
      const names = new Set(cur_arr.map(f => f.faculty));
      names.add(candidate.faculty);
      if (names.size > check + labs) continue;

      
      let toBeMaskedSlots: string[] = [];
      if (selectedTime === "Both") {
        const slotMap = selectedCampus === "Vellore Campus" ? velloreSlots : chennaiSlots;
        for (const s of slotsOfCurFaculty) {
          toBeMaskedSlots.push(...(slotMap[s] || []));
        }
      }

      
      if (clashCheck(cur_slots_arr, slotsOfCurFaculty)) {
        const combined = [...slotsOfCurFaculty, ...toBeMaskedSlots];
        cur_arr.push(candidate);
        cur_slots_arr.push(...combined);

        generate(cur_slots_arr, cur_arr, data, ind + 1, n, check);

        cur_arr.pop();
        cur_slots_arr.splice(-combined.length, combined.length);
      }
      
      else {
        
        const clashSlot = slotsOfCurFaculty.find(s => cur_slots_arr.includes(s))!;
      
        const culpritIdx = cur_arr.findIndex(f => f.facultySlot.includes(clashSlot));
        const removed = cur_arr.splice(culpritIdx, 1)[0];

        
        for (const s of removed.facultySlot) {
          const idx = cur_slots_arr.indexOf(s);
          if (idx >= 0) cur_slots_arr.splice(idx, 1);
        }

        
        cur_arr.splice(culpritIdx, 0, removed);
        cur_slots_arr.push(...removed.facultySlot);
        generate(cur_slots_arr, cur_arr, data, ind + 1, n, check);
      
        cur_arr.splice(culpritIdx, 1);
        cur_slots_arr.splice(-removed.facultySlot.length, removed.facultySlot.length);

        
        cur_arr.push(candidate);
        cur_slots_arr.push(...slotsOfCurFaculty);
        generate(cur_slots_arr, cur_arr, data, ind + 1, n, check);
        // backtrack branch a
        cur_arr.pop();
        cur_slots_arr.splice(-slotsOfCurFaculty.length, slotsOfCurFaculty.length);
      }
    }
  }

  let labs = 0;
  courseNames.forEach(ele => {
    const code = ele.split("-")[0].trim();
    if (ele.toLowerCase().includes("lab") && code.endsWith("P")) labs++;
  });
  const check = courseNames.length - labs;

  generate(cur_slots, cur, inputData, 0, inputData.length, check);

  if (result.length === 0) {
    return NextResponse.json({ message: "No possible timetable", result: [], courseNames: [] });
  }

  return NextResponse.json({ message: "success", result, courseNames });
}