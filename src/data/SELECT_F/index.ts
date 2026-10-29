import { PCC } from './PCC';
import { UCC } from './UCC';
import { CON } from './FCON';
import { OE } from './OE';
import { PCC_ECS } from './PCC_ECS';
import { UCC_ECS } from './UCC_ECS';
import { BEEUCC } from './UCC_BEE';
import { BEEPCC } from './PCC_BEE';
import { BEEOEC } from './OEC_BEE';
import { BEECON } from './FCON_BEE';

export const SELECT_F = {
  UniversityCoreCourses: UCC,
  ProfessionalCoreCourses: PCC,
  ConcentrationCourses: CON,
  OpenElectiveCourses: OE,
  UCC_ECS: UCC_ECS,
  PCC_ECS: PCC_ECS,
  UniversityCoreCoursesBEE: BEEUCC,
  ProfessionalCoreCoursesBEE: BEEPCC,
  ConcentrationCoursesBEE: BEECON,
  OpenElectiveCoursesBEE: BEEOEC,
};
