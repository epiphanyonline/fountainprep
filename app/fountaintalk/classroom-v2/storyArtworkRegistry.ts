export type StoryArtwork = {
  src: string;
  alt: string;
  caption?: string;
  focalPoint?: string;
  priority?: boolean;
};

const DAVID_GOLIATH_ARTWORK: Record<
  string,
  StoryArtwork
> = {
  "david-03-bethlehem": {
    src:
      "/images/fountaintalk/stories/david-goliath/shepherd-field.png",
    alt:
      "Young David caring for sheep near Bethlehem",
    caption:
      "David's public courage was formed during ordinary shepherd work.",
    focalPoint: "center",
  },

  "david-04-shepherd": {
    src:
      "/images/fountaintalk/stories/david-goliath/shepherd-field.png",
    alt:
      "David protecting sheep in the countryside",
    focalPoint: "center",
  },

  "david-05-overlooked": {
    src:
      "/images/fountaintalk/stories/david-goliath/anointing.png",
    alt:
      "Samuel calling David from the field while his brothers wait",
    caption:
      "The youngest son was called in only after the older brothers were passed over.",
    focalPoint: "center",
  },

  "david-06-anointed": {
    src:
      "/images/fountaintalk/stories/david-goliath/anointing.png",
    alt:
      "Samuel anointing David in the presence of Jesse and his sons",
    focalPoint: "center",
  },

  "david-09-war": {
    src:
      "/images/fountaintalk/stories/david-goliath/israel-fear.png",
    alt:
      "The armies of Israel and the Philistines facing each other across the Valley of Elah",
    focalPoint: "center",
  },

  "david-10-goliath": {
    src:
      "/images/fountaintalk/stories/david-goliath/goliath-challenge.png",
    alt:
      "A towering, heavily armed Goliath challenging the frightened Israelite army",
    caption:
      "Goliath's size, armour and reputation were designed to intimidate before the battle began.",
    focalPoint: "58% center",
    priority: true,
  },

  "david-11-challenge": {
    src:
      "/images/fountaintalk/stories/david-goliath/goliath-challenge.png",
    alt:
      "Goliath shouting his challenge while Israel's soldiers stand afraid",
    focalPoint: "58% center",
  },

  "david-13-arrival": {
    src:
      "/images/fountaintalk/stories/david-goliath/israel-fear.png",
    alt:
      "David arriving at the Israelite camp as soldiers retreat from Goliath",
    focalPoint: "center",
  },

  "david-14-perspective": {
    src:
      "/images/fountaintalk/stories/david-goliath/faceoff.png",
    alt:
      "David facing the huge warrior Goliath while both armies watch",
    caption:
      "The soldiers saw an unbeatable threat. David saw a challenge that did not make God powerless.",
    focalPoint: "52% center",
    priority: true,
  },

  "david-16-reported": {
    src:
      "/images/fountaintalk/stories/david-goliath/david-saul.png",
    alt:
      "Young David speaking with King Saul inside the military camp",
    focalPoint: "center",
  },

  "david-17-doubt": {
    src:
      "/images/fountaintalk/stories/david-goliath/david-saul.png",
    alt:
      "King Saul questioning whether young David can face Goliath",
    focalPoint: "center",
  },

  "david-18-hidden": {
    src:
      "/images/fountaintalk/stories/david-goliath/lion-bear.png",
    alt:
      "David protecting his sheep from a lion and a bear",
    caption:
      "The skills used in the valley were developed while protecting the flock.",
    focalPoint: "center",
  },

  "david-21-armour": {
    src:
      "/images/fountaintalk/stories/david-goliath/david-saul.png",
    alt:
      "David trying Saul's armour before deciding not to wear it",
    focalPoint: "center",
  },

  "david-22-tools": {
    src:
      "/images/fountaintalk/stories/david-goliath/stones-sling.png",
    alt:
      "David selecting smooth stones beside the stream and preparing his sling",
    focalPoint: "center",
  },

  "david-23-approach": {
    src:
      "/images/fountaintalk/stories/david-goliath/faceoff.png",
    alt:
      "Goliath mocking David as the two move toward each other",
    focalPoint: "52% center",
  },

  "david-24-declaration": {
    src:
      "/images/fountaintalk/stories/david-goliath/faceoff.png",
    alt:
      "David standing before Goliath and declaring his confidence in God",
    focalPoint: "52% center",
  },

  "david-25-action": {
    src:
      "/images/fountaintalk/stories/david-goliath/battle.png",
    alt:
      "David running forward and releasing a stone from his sling toward Goliath",
    focalPoint: "55% center",
    priority: true,
  },

  "david-26-aftermath": {
    src:
      "/images/fountaintalk/stories/david-goliath/victory.png",
    alt:
      "Goliath fallen as Israel's army advances and the Philistines retreat",
    focalPoint: "center",
  },
};

export function getStoryArtwork(
  sceneId: string
): StoryArtwork | null {
  return DAVID_GOLIATH_ARTWORK[sceneId] ?? null;
}
