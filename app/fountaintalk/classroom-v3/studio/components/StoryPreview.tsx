import type { StoryJourney } from "../../story/types";
import LivingClassroom from "../../components/LivingClassroom";
import { storyToLivingLesson } from "../../story/toLivingLesson";

export function StoryPreview({ story }: { story: StoryJourney }) {
  return <div className="fs-preview" aria-label="Living Classroom preview"><LivingClassroom lesson={storyToLivingLesson(story)} /></div>;
}
