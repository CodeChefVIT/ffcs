import { FoundationCore } from './FoundationCore';
import { ScoreDisciplineLinked } from './DiscipledLinked';
import { ScoreDisciplineCore } from './DisciplineCore';
import { ScoreDisciplinedElective } from './DisciplineElective';
import { ScoreOpenElective } from './OpenElective';

export const SCORE_LIST = {
  FoundationCore: FoundationCore,
  DisciplineLinked: ScoreDisciplineLinked,
  DisciplineCore: ScoreDisciplineCore,
  DisciplineElective: ScoreDisciplinedElective,
  OpenElective: ScoreOpenElective,
};
