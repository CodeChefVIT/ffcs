import { SBST_LIST } from "./SBST";
import { SCHEME_LIST } from "./SCHEME";
import { SCOPE_LIST } from "./SCOPE";
import { SCORE_LIST } from "./SCORE";
import { SELECT_LIST } from "./SELECT";
import { SENSE_LIST } from "./SENSE";
import { SMEC_LIST } from "./SMEC";
import { SCE_LIST } from "./SCE";

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
  SCE: SCE_LIST
};
