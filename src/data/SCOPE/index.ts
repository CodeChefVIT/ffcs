import { ScopeDisciplineElective } from './DisciplineElective';
import { ScopeDisciplineLinked } from './DisciplineLinked';
import { ScopeDisciplineCore } from './DiscliplineCore';
import { ScopeFoundationCore } from './FoundationCore';
import { ScopeOpenElective } from './OpenElective';
import { SE_AIML } from './SE_AIML';
import { SE_Blockchain } from './SE_Blockchain';
import { SE_DS } from './SE_DS';
import { SE_IOT } from './SE_IOT';
import { SE_IS } from './SE_IS';

export const SCOPE_LIST = {
  FoundationCore: ScopeFoundationCore,
  OpenElective: ScopeOpenElective,
  DisciplineElective: ScopeDisciplineElective,
  DisciplineCore: ScopeDisciplineCore,
  DisciplineLinkedEngineeringSciences: ScopeDisciplineLinked,
  'SpecializationElective - BCI': SE_IS,
  'SpecializationElective - BAI': SE_AIML,
  'SpecializationElective - BDS': SE_DS,
  'SpecializationElective - BCT': SE_IOT,
 'SpecializationElective - BKT': SE_Blockchain,
};
