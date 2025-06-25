import { FoundationCore } from './FoundationCore';
import { SenseDisciplineCore } from './DisciplineCore';
import { SenseDisciplineLinked } from './DisciplineLinked';
import { SenseDisciplineElective } from './DisciplineElective';
import { SenseOpenElective } from './OpenElective';
import { openElective } from '../SBST/OpenElective';

export const SENSE_LIST = {
  FoundationCore: FoundationCore,
  DisciplineCore: SenseDisciplineCore,
  DisciplineLinkedEngineeringSciences: SenseDisciplineLinked,
  DisciplineElective: SenseDisciplineElective,
  openElective: SenseOpenElective,
};
