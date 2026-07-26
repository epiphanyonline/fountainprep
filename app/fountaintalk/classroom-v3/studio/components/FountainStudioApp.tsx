import { useEffect, useMemo, useState } from "react";
import { createEmptyStory } from "../core/createStory";
import { createStoryRecord, MemoryStudioRepository, saveDraft, transitionStory } from "../core/store";
import type { StudioActor, StudioStoryRecord } from "../core/types";
import { StoryEditor } from "./StoryEditor";
import { StoryLibrary } from "./StoryLibrary";

const defaultActor: StudioActor = { id: "author-1", displayName: "Curriculum Author" };

export function FountainStudioApp({ seed = [], actor = defaultActor }: { seed?: StudioStoryRecord[]; actor?: StudioActor }) {
  const repository = useMemo(() => new MemoryStudioRepository(seed), [seed]);
  const [stories, setStories] = useState<StudioStoryRecord[]>(seed);
  const [openId, setOpenId] = useState<string | null>(null);
  const [working, setWorking] = useState<StudioStoryRecord | null>(null);

  const refresh = async () => setStories(await repository.list());
  useEffect(() => { void refresh(); }, [repository]);

  const open = async (id: string) => { setOpenId(id); setWorking(await repository.get(id)); };
  const create = async () => {
    const id = `story-${Date.now()}`;
    const record = createStoryRecord(createEmptyStory(id, "bible", "module-1"), actor);
    await repository.save(record); await refresh(); await open(id);
  };
  if (!openId || !working) return <StoryLibrary stories={stories} onOpen={(id) => void open(id)} onCreate={() => void create()} />;

  return <><button className="fs-back" onClick={() => { setOpenId(null); setWorking(null); void refresh(); }}>← Story library</button><StoryEditor story={working.draft} status={working.status} onChange={(draft) => setWorking({ ...working, draft })} onSave={() => void saveDraft(repository, working.id, working.draft, actor).then((record) => { setWorking(record); void refresh(); })} onSubmitReview={() => void saveDraft(repository, working.id, working.draft, actor).then(() => transitionStory(repository, working.id, "review", actor)).then((record) => { setWorking(record); void refresh(); })} /></>;
}
