import { FoundationCore } from '../FoundationCore';
import { disciplineCore } from './DisciplineCore';
import { disciplineElective } from './DisciplineElective';
import { disciplineLinked } from './DisciplineLinked';
import { openElective } from './OpenElective';

export const SBST_LIST = {
  FoundationCore: FoundationCore,
  DisciplineCore: disciplineCore,
  DisciplineElective: disciplineElective,
  DisciplineLinked: disciplineLinked,
  OpenElective: openElective,
};
