import { slot } from "@/lib/type";

const slotMap: Record<string, slot[]> = {
    'A1': [{ rowStart: 4, rowEnd: 5, colStart: 2, colEnd: 7, slotName: 'A1' }, { rowStart: 10, rowEnd: 11, colStart: 8, colEnd: 13, slotName: 'A1' }],
    'TA1': [{ rowStart: 16, rowEnd: 17, colStart: 14, colEnd: 19, slotName: 'TA1' }],
    'TAA1': [{ rowStart: 7, rowEnd: 8, colStart: 26, colEnd: 31, slotName: 'TAA1' }],
    'B1': [{ rowStart: 7, rowEnd: 8, colStart: 2, colEnd: 7, slotName: 'B1' }, { rowStart: 13, rowEnd: 14, colStart: 8, colEnd: 13, slotName: 'B1' }],
    'TB1': [{ rowStart: 4, rowEnd: 5, colStart: 20, colEnd: 25, slotName: 'TB1' }],
    'C1': [{ rowStart: 10, rowEnd: 11, colStart: 2, colEnd: 7, slotName: 'C1' }, { rowStart: 16, rowEnd: 17, colStart: 8, colEnd: 13, slotName: 'C1' }],
    'TC1': [{ rowStart: 7, rowEnd: 8, colStart: 20, colEnd: 25, slotName: 'TC1' }],
    'TCC1': [{ rowStart: 13, rowEnd: 14, colStart: 26, colEnd: 31, slotName: 'TCC1' }],
    'D1': [{ rowStart: 13, rowEnd: 14, colStart: 2, colEnd: 7, slotName: 'D1' }, { rowStart: 4, rowEnd: 5, colStart: 14, colEnd: 19, slotName: 'D1' }],
    'TD1': [{ rowStart: 16, rowEnd: 17, colStart: 26, colEnd: 31, slotName: 'TD1' }],
    'E1': [{ rowStart: 16, rowEnd: 17, colStart: 2, colEnd: 7, slotName: 'E1' }, { rowStart: 7, rowEnd: 8, colStart: 14, colEnd: 19, slotName: 'E1' }],
    'TE1': [{ rowStart: 13, rowEnd: 14, colStart: 20, colEnd: 25, slotName: 'TE1' }],
    'F1': [{ rowStart: 4, rowEnd: 5, colStart: 8, colEnd: 13, slotName: 'F1' }, { rowStart: 10, rowEnd: 11, colStart: 14, colEnd: 19, slotName: 'F1' }],
    'TF1': [{ rowStart: 16, rowEnd: 17, colStart: 20, colEnd: 25, slotName: 'TF1' }],
    'G1': [{ rowStart: 7, rowEnd: 8, colStart: 8, colEnd: 13, slotName: 'G1' }, { rowStart: 13, rowEnd: 14, colStart: 14, colEnd: 19, slotName: 'G1' }],
    'TG1': [{ rowStart: 4, rowEnd: 5, colStart: 26, colEnd: 31, slotName: 'TG1' }],

    'A2': [{ rowStart: 4, rowEnd: 5, colStart: 38, colEnd: 43, slotName: 'A2' }, { rowStart: 10, rowEnd: 11, colStart: 44, colEnd: 49, slotName: 'A2' }],
    'TA2': [{ rowStart: 16, rowEnd: 17, colStart: 50, colEnd: 55, slotName: 'TA2' }],
    'TAA2': [{ rowStart: 7, rowEnd: 8, colStart: 62, colEnd: 67, slotName: 'TAA2' }],
    'B2': [{ rowStart: 7, rowEnd: 8, colStart: 38, colEnd: 43, slotName: 'B2' }, { rowStart: 13, rowEnd: 14, colStart: 44, colEnd: 49, slotName: 'B2' }],
    'TB2': [{ rowStart: 4, rowEnd: 5, colStart: 56, colEnd: 61, slotName: 'TB2' }],
    'TBB2': [{ rowStart: 10, rowEnd: 11, colStart: 62, colEnd: 67, slotName: 'TBB2' }],
    'C2': [{ rowStart: 10, rowEnd: 11, colStart: 38, colEnd: 43, slotName: 'C2' }, { rowStart: 16, rowEnd: 17, colStart: 44, colEnd: 49, slotName: 'C2' }],
    'TC2': [{ rowStart: 7, rowEnd: 8, colStart: 56, colEnd: 61, slotName: 'TC2' }],
    'TCC2': [{ rowStart: 13, rowEnd: 14, colStart: 62, colEnd: 67, slotName: 'TCC2' }],
    'D2': [{ rowStart: 13, rowEnd: 14, colStart: 38, colEnd: 43, slotName: 'D2' }, { rowStart: 4, rowEnd: 5, colStart: 50, colEnd: 55, slotName: 'D2' }],
    'TD2': [{ rowStart: 10, rowEnd: 11, colStart: 56, colEnd: 61, slotName: 'TD2' }],
    'TDD2': [{ rowStart: 16, rowEnd: 17, colStart: 62, colEnd: 67, slotName: 'TDD2' }],
    'E2': [{ rowStart: 16, rowEnd: 17, colStart: 38, colEnd: 43, slotName: 'E2' }, { rowStart: 7, rowEnd: 8, colStart: 50, colEnd: 55, slotName: 'E2' }],
    'TE2': [{ rowStart: 13, rowEnd: 14, colStart: 56, colEnd: 61, slotName: 'TE2' }],
    'F2': [{ rowStart: 4, rowEnd: 5, colStart: 44, colEnd: 49, slotName: 'F2' }, { rowStart: 10, rowEnd: 11, colStart: 50, colEnd: 55, slotName: 'F2' }],
    'TF2': [{ rowStart: 16, rowEnd: 17, colStart: 56, colEnd: 61, slotName: 'TF2' }],
    'G2': [{ rowStart: 7, rowEnd: 8, colStart: 44, colEnd: 49, slotName: 'G2' }, { rowStart: 13, rowEnd: 14, colStart: 50, colEnd: 55, slotName: 'G2' }],
    'TG2': [{ rowStart: 4, rowEnd: 5, colStart: 62, colEnd: 67, slotName: 'TG2' }],

    'L1': [{ rowStart: 5, rowEnd: 6, colStart: 2, colEnd: 12, slotName: 'L1+L2' }],
    'L3': [{ rowStart: 5, rowEnd: 6, colStart: 13, colEnd: 23, slotName: 'L3+L4' }],
    'L5': [{ rowStart: 5, rowEnd: 6, colStart: 24, colEnd: 34, slotName: 'L5+L6' }],
    'L7': [{ rowStart: 8, rowEnd: 9, colStart: 2, colEnd: 12, slotName: 'L7+L8' }],
    'L9': [{ rowStart: 8, rowEnd: 9, colStart: 13, colEnd: 23, slotName: 'L9+L10' }],
    'L11': [{ rowStart: 8, rowEnd: 9, colStart: 24, colEnd: 34, slotName: 'L11+L12' }],
    'L13': [{ rowStart: 11, rowEnd: 12, colStart: 2, colEnd: 12, slotName: 'L13+L14' }],
    'L15': [{ rowStart: 11, rowEnd: 12, colStart: 13, colEnd: 23, slotName: 'L15+L16' }],
    'L17': [{ rowStart: 11, rowEnd: 12, colStart: 24, colEnd: 34, slotName: 'L17+L18' }],
    'L19': [{ rowStart: 14, rowEnd: 15, colStart: 2, colEnd: 12, slotName: 'L19+L20' }],
    'L21': [{ rowStart: 14, rowEnd: 15, colStart: 13, colEnd: 23, slotName: 'L21+L22' }],
    'L23': [{ rowStart: 14, rowEnd: 15, colStart: 24, colEnd: 34, slotName: 'L23+L24' }],
    'L25': [{ rowStart: 17, rowEnd: 18, colStart: 2, colEnd: 12, slotName: 'L25+L26' }],
    'L27': [{ rowStart: 17, rowEnd: 18, colStart: 13, colEnd: 23, slotName: 'L27+L28' }],
    'L29': [{ rowStart: 17, rowEnd: 18, colStart: 24, colEnd: 34, slotName: 'L29+L30' }],

    'L31': [{ rowStart: 5, rowEnd: 6, colStart: 38, colEnd: 48, slotName: 'L31+L32' }],
    'L33': [{ rowStart: 5, rowEnd: 6, colStart: 49, colEnd: 59, slotName: 'L33+L34' }],
    'L35': [{ rowStart: 5, rowEnd: 6, colStart: 60, colEnd: 70, slotName: 'L35+L36' }],
    'L37': [{ rowStart: 8, rowEnd: 9, colStart: 38, colEnd: 48, slotName: 'L37+L38' }],
    'L39': [{ rowStart: 8, rowEnd: 9, colStart: 49, colEnd: 59, slotName: 'L39+L40' }],
    'L41': [{ rowStart: 8, rowEnd: 9, colStart: 60, colEnd: 70, slotName: 'L41+L42' }],
    'L43': [{ rowStart: 11, rowEnd: 12, colStart: 38, colEnd: 48, slotName: 'L43+L44' }],
    'L45': [{ rowStart: 11, rowEnd: 12, colStart: 49, colEnd: 59, slotName: 'L45+L46' }],
    'L47': [{ rowStart: 11, rowEnd: 12, colStart: 60, colEnd: 70, slotName: 'L47+L48' }],
    'L49': [{ rowStart: 14, rowEnd: 15, colStart: 38, colEnd: 48, slotName: 'L49+L50' }],
    'L51': [{ rowStart: 14, rowEnd: 15, colStart: 49, colEnd: 59, slotName: 'L51+L52' }],
    'L53': [{ rowStart: 14, rowEnd: 15, colStart: 60, colEnd: 70, slotName: 'L53+L54' }],
    'L55': [{ rowStart: 17, rowEnd: 18, colStart: 38, colEnd: 48, slotName: 'L55+L56' }],
    'L57': [{ rowStart: 17, rowEnd: 18, colStart: 49, colEnd: 59, slotName: 'L57+L58' }],
    'L59': [{ rowStart: 17, rowEnd: 18, colStart: 60, colEnd: 70, slotName: 'L59+L60' }],
};

export function getSlot(slot: string, withName: boolean = true): slot[] {
    const slots = slotMap[slot] || [];
    if (withName) return slots;
    return slots.map(s => ({ ...s, slotName: '' }));
}

export function getAllSlots(): string[] {
    return Object.keys(slotMap);
}
