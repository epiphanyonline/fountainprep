import {
  registerAcademy,
} from "@/features/academy-content";

import { aiAcademy } from "./ai";
import { codingAcademy } from "./coding";
import { biographyAcademy } from "./biography";
import { dataAnalyticsAcademy } from "./data-analytics";
import { digitalSkillsAcademy } from "./digital-skills";
import { englishAcademy } from "./english";
import { ieltsAcademy } from "./ielts";
import { mathematicsAcademy } from "./mathematics";
import { personalFinanceAcademy } from "./personal-finance";
import { scienceAcademy } from "./science";

let registered = false;

export function registerMvpAcademies(): void {
  if (registered) {
    return;
  }

  registerAcademy(aiAcademy);
  registerAcademy(codingAcademy);
  registerAcademy(biographyAcademy);
  registerAcademy(ieltsAcademy);
  registerAcademy(dataAnalyticsAcademy);
  registerAcademy(personalFinanceAcademy);
  registerAcademy(digitalSkillsAcademy);
  registerAcademy(mathematicsAcademy);
  registerAcademy(englishAcademy);
  registerAcademy(scienceAcademy);

  registered = true;
}

export {
  aiAcademy,
  codingAcademy,
  biographyAcademy,
  dataAnalyticsAcademy,
  digitalSkillsAcademy,
  englishAcademy,
  ieltsAcademy,
  mathematicsAcademy,
  personalFinanceAcademy,
  scienceAcademy,
};
