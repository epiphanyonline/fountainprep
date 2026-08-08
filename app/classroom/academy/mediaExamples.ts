const activityStories: Record<string, string> = {
  "personal-finance:finance-l1-a1":
    "Imagine Maya receives £10 for helping at a family event. The same £10 could buy something today, stay in savings for later, help someone else, or contribute to a small project. Money gives options — and every option has a trade-off.",

  "personal-finance:finance-l2-a2":
    "Tomi has enough money for either a week of school transport or a new game. The game is exciting, but missing transport could stop Tomi getting to school. The case is about priorities when money cannot cover everything.",

  "personal-finance:finance-l3-a1":
    "A savings goal becomes easier when it has a name. If Amara wants a £60 bicycle and can save £5 each week, the goal stops being 'save more' and becomes a plan she can measure.",

  "personal-finance:finance-l4-a1":
    "Two households can earn the same amount and still end the month very differently. A budget does not create extra money; it helps decide where the money should go before it disappears into unplanned spending.",

  "personal-finance:finance-l5-a2":
    "A £100 purchase paid immediately costs £100. Borrowing can make the item available sooner, but interest may make the final amount much higher. The important question is not only 'Can I borrow?' but 'What will this really cost me?'",

  "personal-finance:finance-l6-a2":
    "Madam C. J. Walker built a business around products that answered a real customer need and developed a sales network that created economic opportunity for many women. Her story is useful for discussing enterprise, ownership, reinvestment and productive assets.",

  "personal-finance:finance-l6-a4":
    "Imagine putting every penny you own into one company. If that company struggles, all of your money is exposed to the same problem. Diversification is the idea of not making your entire future depend on one outcome.",
};

const activityVisuals: Record<
  string,
  { title: string; description: string }
> = {
  "finance-l1-a1": {
    title: "One amount. Several choices.",
    description:
      "Spend • Save • Give • Build",
  },
  "finance-l2-a2": {
    title: "Priority decision",
    description:
      "Essential need versus optional want",
  },
  "finance-l3-a1": {
    title: "Turn a wish into a target",
    description:
      "Goal → amount → deadline → weekly saving",
  },
  "finance-l4-a1": {
    title: "Give every pound a job",
    description:
      "Income → essentials → saving → flexible spending",
  },
  "finance-l5-a2": {
    title: "Borrowed price versus cash price",
    description:
      "Principal + interest = total repayment",
  },
  "finance-l6-a2": {
    title: "Productive ownership",
    description:
      "Skills and capital can build assets that create future value",
  },
};

export function storyForActivity(
  academyCode: string,
  activityId: string,
): string | null {
  return (
    activityStories[
      `${academyCode}:${activityId}`
    ] ?? null
  );
}

export function visualForActivity(
  activityId: string,
): {
  title: string;
  description: string;
} | null {
  return (
    activityVisuals[activityId] ??
    null
  );
}
