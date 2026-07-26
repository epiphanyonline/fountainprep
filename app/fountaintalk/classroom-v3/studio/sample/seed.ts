import { davidBeforeTheGiant } from "../../content/david-before-the-giant/journey";
import { createStoryRecord } from "../core/store";

export const studioAuthor = { id: "author-ayomide", displayName: "Ayo Curriculum Team" };
export const studioSeed = [createStoryRecord(davidBeforeTheGiant, studioAuthor)];
