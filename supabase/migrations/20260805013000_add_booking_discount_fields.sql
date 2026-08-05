alter table public.lesson_bookings
  add column if not exists standard_amount_gbp numeric(10,2),
  add column if not exists marketplace_discount_percent numeric(5,2) not null default 0;

update public.lesson_bookings
set standard_amount_gbp = amount_gbp
where standard_amount_gbp is null;

alter table public.lesson_bookings
  add constraint lesson_bookings_marketplace_discount_percent_check
  check (
    marketplace_discount_percent >= 0
    and marketplace_discount_percent <= 100
  );