create table if not exists public.academy_subscription_plans (
  id text primary key,

  name text not null,

  description text,

  billing_interval text not null
    default 'month',

  price_gbp_pence integer not null
    default 0,

  stripe_price_id text,

  included_learner_count integer,

  access_tier text not null
    default 'free',

  academy_access text[] not null
    default array['all']::text[],

  marketplace_discount_percent integer not null
    default 0,

  certificate_access boolean not null
    default false,

  professional_features boolean not null
    default false,

  is_active boolean not null
    default true,

  sort_order integer not null
    default 0,

  created_at timestamptz not null
    default now(),

  updated_at timestamptz not null
    default now(),

  constraint academy_subscription_plans_interval_check
    check (
      billing_interval in (
        'none',
        'month',
        'year'
      )
    ),

  constraint academy_subscription_plans_access_tier_check
    check (
      access_tier in (
        'free',
        'foundation',
        'premium',
        'professional'
      )
    ),

  constraint academy_subscription_plans_price_check
    check (price_gbp_pence >= 0),

  constraint academy_subscription_plans_learner_count_check
    check (
      included_learner_count is null
      or included_learner_count > 0
    ),

  constraint academy_subscription_plans_discount_check
    check (
      marketplace_discount_percent
      between 0 and 100
    )
);

create table if not exists public.academy_subscriptions (
  id uuid primary key
    default gen_random_uuid(),

  user_id uuid not null
    references auth.users(id)
    on delete cascade,

  plan_id text not null
    references public.academy_subscription_plans(id),

  status text not null
    default 'inactive',

  stripe_customer_id text,

  stripe_subscription_id text,

  stripe_checkout_session_id text,

  current_period_start timestamptz,

  current_period_end timestamptz,

  trial_started_at timestamptz,

  trial_ends_at timestamptz,

  cancel_at_period_end boolean not null
    default false,

  cancelled_at timestamptz,

  created_at timestamptz not null
    default now(),

  updated_at timestamptz not null
    default now(),

  constraint academy_subscriptions_status_check
    check (
      status in (
        'inactive',
        'trialing',
        'active',
        'past_due',
        'paused',
        'cancelled',
        'incomplete',
        'expired'
      )
    )
);

create table if not exists public.academy_subscription_learners (
  id uuid primary key
    default gen_random_uuid(),

  subscription_id uuid not null
    references public.academy_subscriptions(id)
    on delete cascade,

  student_id uuid not null
    references public.student_profiles(id)
    on delete cascade,

  added_at timestamptz not null
    default now(),

  constraint academy_subscription_learners_unique
    unique (
      subscription_id,
      student_id
    )
);

create unique index if not exists
  academy_subscriptions_user_active_unique
on public.academy_subscriptions(user_id)
where status in (
  'trialing',
  'active',
  'past_due',
  'paused',
  'incomplete'
);

create unique index if not exists
  academy_subscriptions_stripe_subscription_unique
on public.academy_subscriptions(stripe_subscription_id)
where stripe_subscription_id is not null;

create unique index if not exists
  academy_subscriptions_checkout_session_unique
on public.academy_subscriptions(stripe_checkout_session_id)
where stripe_checkout_session_id is not null;

create index if not exists
  academy_subscriptions_user_id_idx
on public.academy_subscriptions(user_id);

create index if not exists
  academy_subscriptions_status_idx
on public.academy_subscriptions(status);

create index if not exists
  academy_subscription_learners_subscription_idx
on public.academy_subscription_learners(subscription_id);

create index if not exists
  academy_subscription_learners_student_idx
on public.academy_subscription_learners(student_id);

alter table public.academy_subscription_plans
enable row level security;

alter table public.academy_subscriptions
enable row level security;

alter table public.academy_subscription_learners
enable row level security;

grant select
on public.academy_subscription_plans
to authenticated;

grant select
on public.academy_subscriptions
to authenticated;

grant select, insert, delete
on public.academy_subscription_learners
to authenticated;

drop policy if exists
  "Authenticated users can view active academy plans"
on public.academy_subscription_plans;

create policy
  "Authenticated users can view active academy plans"
on public.academy_subscription_plans
for select
to authenticated
using (
  is_active
  or public.is_admin()
);

drop policy if exists
  "Users can view own academy subscription"
on public.academy_subscriptions;

create policy
  "Users can view own academy subscription"
on public.academy_subscriptions
for select
to authenticated
using (
  user_id = auth.uid()
  or public.is_admin()
);

drop policy if exists
  "Users can view learners on own subscription"
on public.academy_subscription_learners;

create policy
  "Users can view learners on own subscription"
on public.academy_subscription_learners
for select
to authenticated
using (
  exists (
    select 1
    from public.academy_subscriptions subscription
    where
      subscription.id =
        academy_subscription_learners.subscription_id
      and subscription.user_id = auth.uid()
  )
  or public.is_admin()
);

drop policy if exists
  "Users can add owned learners to own subscription"
on public.academy_subscription_learners;

create policy
  "Users can add owned learners to own subscription"
on public.academy_subscription_learners
for insert
to authenticated
with check (
  (
    exists (
      select 1
      from public.academy_subscriptions subscription
      where
        subscription.id =
          academy_subscription_learners.subscription_id
        and subscription.user_id = auth.uid()
    )
    and exists (
      select 1
      from public.student_profiles student
      join public.parent_profiles parent
        on parent.id = student.parent_id
      where
        student.id =
          academy_subscription_learners.student_id
        and parent.user_id = auth.uid()
    )
  )
  or public.is_admin()
);

drop policy if exists
  "Users can remove learners from own subscription"
on public.academy_subscription_learners;

create policy
  "Users can remove learners from own subscription"
on public.academy_subscription_learners
for delete
to authenticated
using (
  exists (
    select 1
    from public.academy_subscriptions subscription
    where
      subscription.id =
        academy_subscription_learners.subscription_id
      and subscription.user_id = auth.uid()
  )
  or public.is_admin()
);

insert into public.academy_subscription_plans (
  id,
  name,
  description,
  billing_interval,
  price_gbp_pence,
  included_learner_count,
  access_tier,
  academy_access,
  marketplace_discount_percent,
  certificate_access,
  professional_features,
  sort_order
)
values
  (
    'free',
    'Free',
    'High-quality introductory lessons and basic learner progress.',
    'none',
    0,
    1,
    'free',
    array['all']::text[],
    0,
    false,
    false,
    1
  ),
  (
    'premium_individual',
    'Premium Individual',
    'Full academy access for one learner, including assessments and certificates.',
    'month',
    1999,
    1,
    'premium',
    array['all']::text[],
    5,
    true,
    false,
    2
  ),
  (
    'family',
    'Family',
    'Full academy access for multiple learners under one family account.',
    'month',
    3499,
    5,
    'premium',
    array['all']::text[],
    10,
    true,
    false,
    3
  ),
  (
    'professional',
    'Professional',
    'Advanced career pathways, projects, professional assessments and certificates.',
    'month',
    4999,
    1,
    'professional',
    array['all']::text[],
    15,
    true,
    true,
    4
  )
on conflict (id)
do update set
  name = excluded.name,
  description = excluded.description,
  billing_interval = excluded.billing_interval,
  price_gbp_pence = excluded.price_gbp_pence,
  included_learner_count =
    excluded.included_learner_count,
  access_tier = excluded.access_tier,
  academy_access = excluded.academy_access,
  marketplace_discount_percent =
    excluded.marketplace_discount_percent,
  certificate_access =
    excluded.certificate_access,
  professional_features =
    excluded.professional_features,
  sort_order = excluded.sort_order,
  is_active = true,
  updated_at = now();