import { CivilFoundationCore } from "./FoundationCore";
import { CivilDisciplineCore } from "./DisciplineCore";
import { CivilDisciplineElective } from "./DisciplineElective";
import { CivilDisciplineLinked } from "./DisciplineLinked";
import { CivilOpenElective } from "./OpenElective";

export const SCE_LIST = {
  FoundationCore: CivilFoundationCore,
  DisciplineCore: CivilDisciplineCore,
  DisciplineElective: CivilDisciplineElective,
  DisciplineLinked: CivilDisciplineLinked,
  OpenElective: CivilOpenElective
};
