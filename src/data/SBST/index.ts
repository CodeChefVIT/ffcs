import { foundationCore } from "./FoundationCore";
import { disciplineCore } from "./DisciplineCore";
import { disciplineElective } from "./DisciplineElective";
import { disciplineLinked } from "./DisciplineLinked";
import { openElective } from "./OpenElective";
import { multidisciplinaryElective } from "./MultidisciplinaryElective";

export const SBST_LIST = {
  FoundationCore: foundationCore,
  DisciplineCore: disciplineCore,
  DisciplineElective: disciplineElective,
  DisciplineLinkedEngineeringSciences: disciplineLinked,
  OpenElective: openElective,
  MultidisciplinaryElective: multidisciplinaryElective
};
