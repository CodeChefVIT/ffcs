import { FoundationCore } from '../FoundationCore';
import { SelectDisciplineLinked } from './DisciplineLinked';
import { SelectDisciplineCore } from './DiscliplineCore';
import { SelectDisciplineElective } from './DiscliplineElective';
import { SelectMultidisciplinaryElective } from './MultidisciplinaryElective';
import { SelectOpenElective } from './OpenElective';

export const SELECT_LIST = {
  FoundationCore: FoundationCore,
  DisciplineLinked: SelectDisciplineLinked,
  DisciplineCore: SelectDisciplineCore,
  DisciplineElective: SelectDisciplineElective,
  MultidisciplinaryElective: SelectMultidisciplinaryElective,
  OpenElective: SelectOpenElective,
};
