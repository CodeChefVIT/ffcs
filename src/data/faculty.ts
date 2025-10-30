import { SBST_LIST } from './SBST';
import { SCHEME_LIST } from './SCHEME';
import { SCOPE_LIST } from './SCOPE';
import { SCORE_LIST } from './SCORE';
import { SELECT_LIST } from './SELECT';
import { SENSE_LIST } from './SENSE';
import { SMEC_LIST } from './SMEC';
import { SCE_LIST } from './SCE';
import { SHINE_LIST } from './SHINE';
import { MTech_SCOPE } from './MTech_SCOPE';
import { MIS_LIST } from './MTech_SCORE';
import { SCOPE_F } from './SCOPE_F';
import { SCORE_F } from './SCORE_F';
import { SELECT_F } from './SELECT_F';
import { SENSE_F } from './SENSE_F';
import { SMEC_F } from './SMEC_F';
import { SHINE_F } from './SHINE_F';
import { SBST_F } from './SBST_F';

type FacultyEntry = {
  slot: string;
  venue: string;
  faculty: string;
};

// Each subject (e.g., "MAT1011") maps to a list of entries
type SubjectGroup = {
  [subjectCode: string]: FacultyEntry[];
};

// Each category (e.g., "FoundationCore", "ScoreOpenElective") maps to a SubjectGroup
type Subjects = {
  [category: string]: SubjectGroup;
};

// Each school (e.g., "SCORE", "SBST") maps to a Subjects map
type Schools = {
  [schoolName: string]: Subjects;
};

export const data: Schools = {
  SCORE: SCORE_LIST,
  SCOPE: SCOPE_LIST,
  SENSE: SENSE_LIST,
  SBST: SBST_LIST,
  SMEC: SMEC_LIST,
  SCHEME: SCHEME_LIST,
  SELECT: SELECT_LIST,
  SCE: SCE_LIST,
  SHINE: SHINE_LIST,
  'MTech (SCOPE)': MTech_SCOPE,
  'MTech (MIS)': MIS_LIST,
  'SCOPE (Fresher)': SCOPE_F,
  'SCORE (Fresher)': SCORE_F,
  'SELECT (Fresher)': SELECT_F,
  'SENSE (Fresher)': SENSE_F,
  'SMEC (Fresher)': SMEC_F,
  'SHINE (Fresher)': SHINE_F,
  'SBST (Fresher)': SBST_F,
};
