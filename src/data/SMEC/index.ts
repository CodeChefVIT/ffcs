import { SmecDiscplineCore } from './DisciplineCore';
import { SmecDisciplineElective } from './DisciplineElective';
import { SmecDisciplineLinked } from './DisciplineLinked';
import { SmecFoundationCore } from './FoundationCore';
import { SmecOpenElective } from './OpenElective';
import { SE_BMM } from './SE_BMM';
import { SE_BMA } from './SE_BMA';
import { SE_BMV } from './SE_EV';

export const SMEC_LIST = {
  FoundationCore: SmecFoundationCore,
  DisciplineCore: SmecDiscplineCore,
  DisciplineElective: SmecDisciplineElective,
  DisciplineLinkedEngineeringSciences: SmecDisciplineLinked,
  OpenElective: SmecOpenElective,
  'SpecializationElective - BMM': SE_BMM,
  'SpecializationElective - BMA': SE_BMA,
  'SpecializationElective - BMV': SE_BMV,
};
