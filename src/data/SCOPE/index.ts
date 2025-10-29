import { ScopeDisciplineElective } from './DisciplineElective';
import { ScopeDisciplineLinked } from './DisciplineLinked';
import { ScopeDisciplineCore } from './DiscliplineCore';
import { ScopeFoundationCore } from './FoundationCore';
import { ScopeOpenElective } from './OpenElective';
import { SE_AIML } from './SE_AIML';
import { SE_BKT } from './SE_Blockchain';
import { SE_DS } from './SE_DS';
import { SE_IOT } from './SE_IOT';
import { SE_IS } from './SE_IS';
import { SE_BCB } from './SE_BCB';

export const SCOPE_LIST = {
  FoundationCore: ScopeFoundationCore,
  DisciplineLinkedEngineeringSciences: ScopeDisciplineLinked,
  DisciplineElective: ScopeDisciplineElective,
  DisciplineCore: ScopeDisciplineCore,
  OpenElective: ScopeOpenElective,
  'Specialization Elective - BCI': SE_IS,
  'Specialization Elective - BAI': SE_AIML,
  'Specialization Elective - BDS': SE_DS,
  'Specialization Elective - BCT': SE_IOT,
  'Specialization Elective - BKT': SE_BKT,
  'Specialization Elective - BCB': SE_BCB,
};
