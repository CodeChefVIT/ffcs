import { CON } from './FCON';
import { OEC } from './OEC';
import { PCC } from './PCC';
import { UCC } from './UCC';
import { BECCON } from './FCON_BEC';
import { BECOEC } from './OEC_BEC';
import { BECPCC } from './PCC_BEC';
import { BECUCC } from './UCC_BEC';

export const SENSE_F = {
  UniversityCoreCourses: UCC,
  ProfessionalCoreCourses: PCC,
  ConcentrationCourses: CON,
  OpenElectiveCourses: OEC,
  UniversityCoreCoursesBEC: BECUCC,
  ProfessionalCoreCoursesBEC: BECPCC,
  ConcentrationCoursesBEC: BECCON,
  OpenElectiveCoursesBEC: BECOEC,
};
