import { SchemeFoundationCore } from './FoundationCore';
import { SchemeDisciplineCore } from './DisciplineCore';
import { SchemeDisciplineElective } from './DisciplineElective';
import { SchemeDisciplineLinked } from './DisciplineLinked';
import { SchemeOpenElective } from './OpenElective';

export const SCHEME_LIST = {
  FoundationCore: SchemeFoundationCore,
  DisciplineCore: SchemeDisciplineCore,
  DisciplineElective: SchemeDisciplineElective,
  DisciplineLinkedEngineeringSciences: SchemeDisciplineLinked,
  OpenElective: SchemeOpenElective
};
