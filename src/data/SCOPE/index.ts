import { ScopeDisciplineElective } from './DisciplineElective';
import { ScopeDisciplineLinked } from './DisciplineLinked';
import { ScopeDisciplineCore } from './DiscliplineCore';
import { ScopeFoundationCore } from './FoundationCore';
import { ScopeOpenElective } from './OpenElective';

export const SCOPE_LIST = {
  FoundationCore: ScopeFoundationCore,
  OpenElective: ScopeOpenElective,
  DisciplineElective: ScopeDisciplineElective,
  DisciplineCore: ScopeDisciplineCore,
  DisciplineLinked: ScopeDisciplineLinked,
};
