import { FoundationCore } from './FoundationCore';
import { ScoreDisciplineLinked } from './DiscipledLinked';
import { ScoreDisciplineCore } from './DisciplineCore';
import { ScoreDisciplinedElective } from './DisciplineElective';
import { ScoreOpenElective } from './OpenElective';
import { FC_SPEC } from './FC_SPEC';
import { DC_SPEC } from './DC_SPEC';
import { DLES_SPEC } from './DLES_SPEC';
import { OE_SPEC } from './OE_SPEC';

export const SCORE_LIST = {
  FoundationCore: FoundationCore,
  DisciplineLinkedEngineeringSciences: ScoreDisciplineLinked,
  DisciplineCore: ScoreDisciplineCore,
  DisciplineElective: ScoreDisciplinedElective,
  OpenElective: ScoreOpenElective,
  'FC (Specialization)': FC_SPEC,
  'DC (Specialization)': DC_SPEC,
  'DLES (Specialization)': DLES_SPEC,
  'OE (Specialization)': OE_SPEC,
};
