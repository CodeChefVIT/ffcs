import { FoundationCore } from '../FoundationCore';
import { disciplineElective } from './DisciplineElective';
import { ScopeDisclipineCore } from './DiscliplineCore';
import { dsd } from './dles/dsd';
import { dsdLab } from './dles/dsd-lab';
import { mpmc } from './dles/mpmc';
import { mpmcLab } from './dles/mpmc-lab';
import { arabic } from './foundation-core/arabic';
import { basicElectrical } from './foundation-core/beee';
import { basicElectricalLab } from './foundation-core/beee-lab';
import { calculus } from './foundation-core/calculus';
import { calculusLab } from './foundation-core/calculus-lab';
import { chemistryLab } from './foundation-core/chemistry-lab';
import { chemistryTheory } from './foundation-core/chemistry-theory';
import { chineese } from './foundation-core/chineese';
import { differentialEquations } from './foundation-core/differential';
import { french } from './foundation-core/french';
import { german } from './foundation-core/german';
import { globalWarming } from './foundation-core/global-warming';
import { indianClassical } from './foundation-core/indian-classical';
import { japanese } from './foundation-core/japaneese';
import { macroEconomics } from './foundation-core/macroeconomics';
import { microEconomics } from './foundation-core/microeconomics';
import { naturalDisaster } from './foundation-core/natural-disaster';
import { structuredProgramming } from './foundation-core/oops';
import { structuredProgrammingLab } from './foundation-core/oops-lab';
import { physicsLab } from './foundation-core/physics-lab';
import { physicsTheory } from './foundation-core/physicsTheory';
import { principlesOfManagement } from './foundation-core/principles-of-management';
import { probabilityAndStatistics } from './foundation-core/probability';
import { probabilityAndStatisticsLab } from './foundation-core/probability-lab';
import { publicPolicy } from './foundation-core/public-policy';
import { quantitativeSkillsPractice } from './foundation-core/quantitativeSkillsPractice';
import { quantitativeSkillsPractice2 } from './foundation-core/quantitativeSkillsPractice2';
import { socialWork } from './foundation-core/socialwork';
import { sociology } from './foundation-core/sociology';
import { spanish } from './foundation-core/spanish';
import { sustainibility } from './foundation-core/sustainibility';
import { technicalEnglishCommunication } from './foundation-core/technical-english';
import { technicalEnglishCommunicationLab } from './foundation-core/technical-english-lab';
import { urbanCommunityDevelopment } from './foundation-core/urban';
import { wasteManagement } from './foundation-core/waste-management';
import { waterResourceManagement } from './foundation-core/water-management';
import { compiCoding } from './oe/adv-cc';
import { behavioralEconomics } from './oe/behavioral-economics';
import { circuitTheory } from './oe/circuit.theory';
import { contempIndia } from './oe/contemp-india';
import { emd } from './oe/emd';
import { financialMarkets } from './oe/financial-markets';
import { indianHeritage } from './oe/indian-herritage';
import { intellectualProperty } from './oe/intellectual-property';
import { internationRelations } from './oe/international-relations';
import { introToPsychology } from './oe/intro-psychology';
import { massCommunication } from './oe/mass-communication';
import { optics } from './oe/optics';
import { personalFinance } from './oe/personal-finance';
import { politicalScience } from './oe/political-science';
import { principlesOfAccounting } from './oe/principles-of-accounting';

export const SCOPE_LIST = {
  FoundationCore: {
    'BARB101L - Arabic': arabic,
    'BCHI101L - Chinese I': chineese,
    'BCHY101L - Engineering Chemistry': chemistryTheory,
    'BCHY101P - Engineering Chemistry Lab': chemistryLab,
    'BCLE212L - Natural Disaster Mitigation and Management': naturalDisaster,
    'BCLE214L - Global Warming': globalWarming,
    'BCLE215L - Waste Management': wasteManagement,
    'BCLE216L - Water Resource Management': waterResourceManagement,
    'BCSE102L - Structured and Object-Oriented Programming':
      structuredProgramming,
    'BCSE102P - Structured and Object-Oriented Programming Lab':
      structuredProgrammingLab,
    'BEEE102L - Basic Electrical and Electronics Engineering': basicElectrical,
    'BEEE102P - Basic Electrical and Electronics Engineering Lab':
      basicElectricalLab,
    'BENG101L - Technical English Communication': technicalEnglishCommunication,
    'BENG101P - Technical English Communication Lab':
      technicalEnglishCommunicationLab,
    'BESP101L - Spanish I': spanish,
    'BFRE101L - French I': french,
    'BGER101L - German I': german,
    'BHUM102E - Indian Classical Music': indianClassical,
    'BHUM103L - Micro Economics': microEconomics,
    'BHUM104L - Macro Economics': macroEconomics,
    'BHUM105L - Public Policy and Administration': publicPolicy,
    'BHUM106L - Principles of Sociology': sociology,
    'BHUM107L - Sustainability and Society': sustainibility,
    'BHUM108L - Urban Community Development': urbanCommunityDevelopment,
    'BHUM109L - Social Work and Sustainability': socialWork,
    'BJAP101L - Japanese I': japanese,
    'BMAT101L - Calculus': calculus,
    'BMAT101P - Calculus Lab': calculusLab,
    'BMAT102L - Differential Equations and Transforms': differentialEquations,
    'BMAT202L - Probability and Statistics': probabilityAndStatistics,
    'BMAT202P - Probability and Statistics Lab': probabilityAndStatisticsLab,
    'BMGT101L - Principles of Management': principlesOfManagement,
    'BPHY101L - Engineering Physics': physicsTheory,
    'BPHY101P - Engineering Physics Lab': physicsLab,
    'BSTS101P - Quantitative Skills Practice I': quantitativeSkillsPractice,
    'BSTS102P - Quantitative Skills Practice II': quantitativeSkillsPractice2,
  },
  OpenElective: {
    'BECE201L - Electronic Materials and Devices': emd,
    'BECE203L - Circuit Theory': circuitTheory,
    'BHUM201L - Mass Communication': massCommunication,
    'BHUM203L - Introduction to Psychology': introToPsychology,
    'BHUM211L - Behavioral Economics': behavioralEconomics,
    'BHUM214L - Political Science': politicalScience,
    'BHUM215L - International Relations': internationRelations,
    'BHUM216L - Indian Culture and Heritage': indianHeritage,
    'BHUM217L - Contemporary India': contempIndia,
    'BHUM219L - Principles of Accounting': principlesOfAccounting,
    'BHUM220L - Financial Markets and Institutions': financialMarkets,
    'BHUM225L - Personal Finance': personalFinance,
    'BMGT109L - Introduction to Intellectual Property': intellectualProperty,
    'BPHY201L - Optics': optics,
    'BSTS302P - Advanced Competitive Coding - II': compiCoding,
  },
  DisciplineElective: disciplineElective,
  DisciplineCore: ScopeDisclipineCore,
  DisciplineLinked: {
    'BECE102L - Digital Systems Design': dsd,
    'BECE102P - Digital Systems Design Lab': dsdLab,
    'BECE204L - Microprocessors and Microcontrollers': mpmc,
    'BECE204P - Microprocessors and Microcontrollers Lab': mpmcLab,
  },
};
