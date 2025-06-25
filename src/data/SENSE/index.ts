import { FoundationCore } from './FoundationCore';
import { SenseDisciplineCore } from './DisciplineCore';
import { SenseDisciplineLinked } from './DisciplineLinked';
import { SenseDisciplineElective } from './DisciplineElective';

export const SENSE_LIST = {
  FoundationCore: FoundationCore,
  DisciplineCore: SenseDisciplineCore,
  DisciplineLinked: SenseDisciplineLinked,
  DisciplineElective: SenseDisciplineElective
};
