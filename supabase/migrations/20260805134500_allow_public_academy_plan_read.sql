grant select
on public.academy_subscription_plans
to anon, authenticated;

drop policy if exists
  "Anyone can view active academy plans"
on public.academy_subscription_plans;

create policy
  "Anyone can view active academy plans"
on public.academy_subscription_plans
for select
to anon, authenticated
using (
  is_active
  or public.is_admin()
);
