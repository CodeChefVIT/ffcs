import { SelectFoundatioCore } from './FoundationCore';
import { SelectDisciplineLinked } from './DisciplineLinked';
import { SelectDisciplineCore } from './DiscliplineCore';
import { SelectDisciplineElective } from './DiscliplineElective';
import { SelectOpenElective } from './OpenElective';

export const SELECT_LIST = {
  FoundationCore: SelectFoundatioCore,
  DisciplineLinked: SelectDisciplineLinked,
  DisciplineCore: SelectDisciplineCore,
  DisciplineElective: SelectDisciplineElective,
  OpenElective: SelectOpenElective,
};
