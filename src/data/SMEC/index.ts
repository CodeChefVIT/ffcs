import { SmecDiscplineCore } from './DisciplineCore';
import { SmecDisciplineElective } from './DisciplineElective';
import { SmecDisciplineLinked } from './DisciplineLinked';
import { SmecFoundationCore } from './FoundationCore';
import { SmecOpenElective } from './OpenElective';

export const SMEC_LIST = {
  FoundationCore: SmecFoundationCore,
  DisciplineCore: SmecDiscplineCore,
  DisciplineElective: SmecDisciplineElective,
  DisciplineLinked: SmecDisciplineLinked,
  OpenElective: SmecOpenElective,
};
