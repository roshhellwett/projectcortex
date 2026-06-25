-- ProjectCortex / Zenith license operations schema helpers.
-- Run this in the Supabase SQL editor before using custom license durations.

alter table public.licenses
  add column if not exists duration_days integer not null default 7;

alter table public.licenses
  add constraint licenses_duration_days_range
  check (duration_days between 1 and 3650)
  not valid;

alter table public.licenses
  validate constraint licenses_duration_days_range;

create index if not exists licenses_status_idx on public.licenses (status);
create index if not exists licenses_install_id_idx on public.licenses (install_id);
create unique index if not exists licenses_license_key_uidx on public.licenses (license_key);
