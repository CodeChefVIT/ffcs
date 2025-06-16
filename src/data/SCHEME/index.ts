import { FoundationCore } from '../FoundationCore';
import { SchemeDisciplineCore } from './DisciplineCore';
import { SchemeDisciplineElective } from './DisciplineElective';
import { SchemeDisciplineLinked } from './DisciplineLinked';
import { SchemeMultidisciplinaryElective } from './MultidisciplinaryElective';
import { SchemeOpenElective } from './OpenElective';

export const SCHEME_LIST = {
  FoundationCore: FoundationCore,
  DisciplineCore: SchemeDisciplineCore,
  DisciplineElective: SchemeDisciplineElective,
  DisciplineLinked: SchemeDisciplineLinked,
  MultidisciplinaryElective: SchemeMultidisciplinaryElective,
  OpenElective: SchemeOpenElective,
};
