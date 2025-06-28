import { FoundationCore } from './FoundationCore';
import { SenseDisciplineCore } from './DisciplineCore';
import { SenseDisciplineLinked } from './DisciplineLinked';
import { SenseDisciplineElective } from './DisciplineElective';
import { SenseOpenElective } from './OpenElective';
import { SE_BVD } from './SE_BVD';
import { SE_BML } from './SE_BML';

export const SENSE_LIST = {
  FoundationCore: FoundationCore,
  DisciplineCore: SenseDisciplineCore,
  DisciplineLinkedEngineeringSciences: SenseDisciplineLinked,
  DisciplineElective: SenseDisciplineElective,
  openElective: SenseOpenElective,
  'SpecializationElective - BML': SE_BML,
  'SpecializationElective - BVD': SE_BVD,
};
