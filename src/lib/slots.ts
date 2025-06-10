import { slot } from "@/lib/type";

const slotMap: Record<string, slot[]> = {
  A1: [{ rowStart: 4, rowEnd: 5, colStart: 2, colEnd: 7, slotName: 'A1' }, { rowStart: 10, rowEnd: 11, colStart: 8, colEnd: 13, slotName: 'A1' }],
  TA1: [{ rowStart: 16, rowEnd: 17, colStart: 14, colEnd: 19, slotName: 'TA1' }],
  TAA1: [{ rowStart: 7, rowEnd: 8, colStart: 26, colEnd: 31, slotName: 'TAA1' }],
  B1: [{ rowStart: 7, rowEnd: 8, colStart: 2, colEnd: 7, slotName: 'B1' }, { rowStart: 13, rowEnd: 14, colStart: 8, colEnd: 13, slotName: 'B1' }],
  TB1: [{ rowStart: 4, rowEnd: 5, colStart: 20, colEnd: 25, slotName: 'TB1' }],
  C1: [{ rowStart: 10, rowEnd: 11, colStart: 2, colEnd: 7, slotName: 'C1' }, { rowStart: 16, rowEnd: 17, colStart: 8, colEnd: 13, slotName: 'C1' }],
  TC1: [{ rowStart: 7, rowEnd: 8, colStart: 20, colEnd: 25, slotName: 'TC1' }],
  TCC1: [{ rowStart: 13, rowEnd: 14, colStart: 26, colEnd: 31, slotName: 'TCC1' }],
  D1: [{ rowStart: 13, rowEnd: 14, colStart: 2, colEnd: 7, slotName: 'D1' }, { rowStart: 4, rowEnd: 5, colStart: 14, colEnd: 19, slotName: 'D1' }],
  TD1: [{ rowStart: 16, rowEnd: 17, colStart: 26, colEnd: 31, slotName: 'TD1' }],
  E1: [{ rowStart: 16, rowEnd: 17, colStart: 2, colEnd: 7, slotName: 'E1' }, { rowStart: 7, rowEnd: 8, colStart: 14, colEnd: 19, slotName: 'E1' }],
  TE1: [{ rowStart: 13, rowEnd: 14, colStart: 20, colEnd: 25, slotName: 'TE1' }],
  F1: [{ rowStart: 4, rowEnd: 5, colStart: 8, colEnd: 13, slotName: 'F1' }, { rowStart: 10, rowEnd: 11, colStart: 14, colEnd: 19, slotName: 'F1' }],
  TF1: [{ rowStart: 16, rowEnd: 17, colStart: 20, colEnd: 25, slotName: 'TF1' }],
  G1: [{ rowStart: 7, rowEnd: 8, colStart: 8, colEnd: 13, slotName: 'G1' }, { rowStart: 13, rowEnd: 14, colStart: 14, colEnd: 19, slotName: 'G1' }],
  TG1: [{ rowStart: 4, rowEnd: 5, colStart: 26, colEnd: 31, slotName: 'TG1' }],

  A2: [{ rowStart: 4, rowEnd: 5, colStart: 38, colEnd: 43, slotName: 'A2' }, { rowStart: 10, rowEnd: 11, colStart: 44, colEnd: 49, slotName: 'A2' }],
  TA2: [{ rowStart: 16, rowEnd: 17, colStart: 50, colEnd: 55, slotName: 'TA2' }],
  TAA2: [{ rowStart: 7, rowEnd: 8, colStart: 62, colEnd: 67, slotName: 'TAA2' }],
  B2: [{ rowStart: 7, rowEnd: 8, colStart: 38, colEnd: 43, slotName: 'B2' }, { rowStart: 13, rowEnd: 14, colStart: 44, colEnd: 49, slotName: 'B2' }],
  TB2: [{ rowStart: 4, rowEnd: 5, colStart: 56, colEnd: 61, slotName: 'TB2' }],
  TBB2: [{ rowStart: 10, rowEnd: 11, colStart: 62, colEnd: 67, slotName: 'TBB2' }],
  C2: [{ rowStart: 10, rowEnd: 11, colStart: 38, colEnd: 43, slotName: 'C2' }, { rowStart: 16, rowEnd: 17, colStart: 44, colEnd: 49, slotName: 'C2' }],
  TC2: [{ rowStart: 7, rowEnd: 8, colStart: 56, colEnd: 61, slotName: 'TC2' }],
  TCC2: [{ rowStart: 13, rowEnd: 14, colStart: 62, colEnd: 67, slotName: 'TCC2' }],
  D2: [{ rowStart: 13, rowEnd: 14, colStart: 38, colEnd: 43, slotName: 'D2' }, { rowStart: 4, rowEnd: 5, colStart: 50, colEnd: 55, slotName: 'D2' }],
  TD2: [{ rowStart: 10, rowEnd: 11, colStart: 56, colEnd: 61, slotName: 'TD2' }],
  TDD2: [{ rowStart: 16, rowEnd: 17, colStart: 62, colEnd: 67, slotName: 'TDD2' }],
  E2: [{ rowStart: 16, rowEnd: 17, colStart: 38, colEnd: 43, slotName: 'E2' }, { rowStart: 7, rowEnd: 8, colStart: 50, colEnd: 55, slotName: 'E2' }],
  TE2: [{ rowStart: 13, rowEnd: 14, colStart: 56, colEnd: 61, slotName: 'TE2' }],
  F2: [{ rowStart: 4, rowEnd: 5, colStart: 44, colEnd: 49, slotName: 'F2' }, { rowStart: 10, rowEnd: 11, colStart: 50, colEnd: 55, slotName: 'F2' }],
  TF2: [{ rowStart: 16, rowEnd: 17, colStart: 56, colEnd: 61, slotName: 'TF2' }],
  G2: [{ rowStart: 7, rowEnd: 8, colStart: 44, colEnd: 49, slotName: 'G2' }, { rowStart: 13, rowEnd: 14, colStart: 50, colEnd: 55, slotName: 'G2' }],
  TG2: [{ rowStart: 4, rowEnd: 5, colStart: 62, colEnd: 67, slotName: 'TG2' }],

  L1: [{ rowStart: 5, rowEnd: 6, colStart: 2, colEnd: 12, slotName: 'L1+L2' }],
  L3: [{ rowStart: 5, rowEnd: 6, colStart: 13, colEnd: 23, slotName: 'L3+L4' }],
  L5: [{ rowStart: 5, rowEnd: 6, colStart: 24, colEnd: 34, slotName: 'L5+L6' }],
  L7: [{ rowStart: 8, rowEnd: 9, colStart: 2, colEnd: 12, slotName: 'L7+L8' }],
  L9: [{ rowStart: 8, rowEnd: 9, colStart: 13, colEnd: 23, slotName: 'L9+L10' }],
  L11: [{ rowStart: 8, rowEnd: 9, colStart: 24, colEnd: 34, slotName: 'L11+L12' }],
  L13: [{ rowStart: 11, rowEnd: 12, colStart: 2, colEnd: 12, slotName: 'L13+L14' }],
  L15: [{ rowStart: 11, rowEnd: 12, colStart: 13, colEnd: 23, slotName: 'L15+L16' }],
  L17: [{ rowStart: 11, rowEnd: 12, colStart: 24, colEnd: 34, slotName: 'L17+L18' }],
  L19: [{ rowStart: 14, rowEnd: 15, colStart: 2, colEnd: 12, slotName: 'L19+L20' }],
  L21: [{ rowStart: 14, rowEnd: 15, colStart: 13, colEnd: 23, slotName: 'L21+L22' }],
  L23: [{ rowStart: 14, rowEnd: 15, colStart: 24, colEnd: 34, slotName: 'L23+L24' }],
  L25: [{ rowStart: 17, rowEnd: 18, colStart: 2, colEnd: 12, slotName: 'L25+L26' }],
  L27: [{ rowStart: 17, rowEnd: 18, colStart: 13, colEnd: 23, slotName: 'L27+L28' }],
  L29: [{ rowStart: 17, rowEnd: 18, colStart: 24, colEnd: 34, slotName: 'L29+L30' }],

  L31: [{ rowStart: 5, rowEnd: 6, colStart: 38, colEnd: 48, slotName: 'L31+L32' }],
  L33: [{ rowStart: 5, rowEnd: 6, colStart: 49, colEnd: 59, slotName: 'L33+L34' }],
  L35: [{ rowStart: 5, rowEnd: 6, colStart: 60, colEnd: 70, slotName: 'L35+L36' }],
  L37: [{ rowStart: 8, rowEnd: 9, colStart: 38, colEnd: 48, slotName: 'L37+L38' }],
  L39: [{ rowStart: 8, rowEnd: 9, colStart: 49, colEnd: 59, slotName: 'L39+L40' }],
  L41: [{ rowStart: 8, rowEnd: 9, colStart: 60, colEnd: 70, slotName: 'L41+L42' }],
  L43: [{ rowStart: 11, rowEnd: 12, colStart: 38, colEnd: 48, slotName: 'L43+L44' }],
  L45: [{ rowStart: 11, rowEnd: 12, colStart: 49, colEnd: 59, slotName: 'L45+L46' }],
  L47: [{ rowStart: 11, rowEnd: 12, colStart: 60, colEnd: 70, slotName: 'L47+L48' }],
  L49: [{ rowStart: 14, rowEnd: 15, colStart: 38, colEnd: 48, slotName: 'L49+L50' }],
  L51: [{ rowStart: 14, rowEnd: 15, colStart: 49, colEnd: 59, slotName: 'L51+L52' }],
  L53: [{ rowStart: 14, rowEnd: 15, colStart: 60, colEnd: 70, slotName: 'L53+L54' }],
  L55: [{ rowStart: 17, rowEnd: 18, colStart: 38, colEnd: 48, slotName: 'L55+L56' }],
  L57: [{ rowStart: 17, rowEnd: 18, colStart: 49, colEnd: 59, slotName: 'L57+L58' }],
  L59: [{ rowStart: 17, rowEnd: 18, colStart: 60, colEnd: 70, slotName: 'L59+L60' }],
};

export const clashMap: Record<string, string[]> = {
  A1: ["L1", "L13"],
  TA1: ["L27"],
  TAA1: ["L11"],
  B1: ["L7", "L19"],
  TB1: ["L3", "L5"],
  C1: ["L13", "L25"],
  TC1: ["L9", "L11"],
  TCC1: ["L23"],
  D1: ["L3", "L19"],
  TD1: ["L29"],
  E1: ["L9", "L25"],
  TE1: ["L21", "L23"],
  F1: ["L1", "L15"],
  TF1: ["L27", "L29"],
  G1: ["L7", "L21"],
  TG1: ["L5"],

  A2: ["L31", "L43"],
  TA2: ["L57"],
  TAA2: ["L41"],
  B2: ["L37", "L49"],
  TB2: ["L33", "L35"],
  TBB2: ["L47"],
  C2: ["L43", "L55"],
  TC2: ["L39", "L41"],
  TCC2: ["L53"],
  D2: ["L33", "L49"],
  TD2: ["L45", "L47"],
  TDD2: ["L59"],
  E2: ["L39", "L55"],
  TE2: ["L51", "L53"],
  F2: ["L31", "L45"],
  TF2: ["L57", "L59"],
  G2: ["L37", "L51"],
  TG2: ["L35"],

  L1: ["A1", "F1"],
  L3: ["D1", "TB1"],
  L5: ["TB1", "TG1"],
  L7: ["B1", "G1"],
  L9: ["TC1", "E1"],
  L11: ["TAA1", "TC1"],
  L13: ["A1", "C1"],
  L15: ["F1"],
  L19: ["B1", "D1"],
  L21: ["TE1", "G1"],
  L23: ["TCC1", "TE1"],
  L25: ["C1", "E1"],
  L27: ["TA1", "TF1"],
  L29: ["TD1", "TF1"],

  L31: ["A2", "F2"],
  L33: ["D2", "TB2"],
  L35: ["TB2", "TG2"],
  L37: ["B2", "G2"],
  L39: ["TC2", "E2"],
  L41: ["TAA2", "TC2"],
  L43: ["A2", "C2"],
  L45: ["TD2", "F2"],
  L47: ["TBB2", "TD2"],
  L49: ["B2", "D2"],
  L51: ["TE2", "G2"],
  L53: ["TCC2", "TE2"],
  L55: ["C2", "E2"],
  L57: ["TA2", "TF2"],
  L59: ["TDD2", "TF2"]
};

export function getSlot(slot: string, withName: boolean = true): slot[] {
  const slotNames = slot.split("+").map(s => s.trim());
  let slots: slot[] = [];
  for (const name of slotNames) {
    slots = slots.concat(slotMap[name] || []);
  }
  if (withName) return slots;
  return slots.map(s => ({ ...s, slotName: '' }));
}

export function getAllSlots(): string[] {
  return Object.values(slotMap).map(slots => slots[0].slotName);
}

export function getCollisions(slot: slot): slot[] {
  return (clashMap[slot.slotName] || []).flatMap(name => slotMap[name] || []);
}
