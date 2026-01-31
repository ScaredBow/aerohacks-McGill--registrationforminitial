create table if not exists public.registrations (
  id bigserial primary key,
  created_at timestamptz not null default now(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone_number text not null,
  age_group text not null,
  school text not null,
  school_other text,
  mcgill_email text,
  mcgill_student_id text,
  discord_username text,
  mlh_code_of_conduct boolean not null,
  mlh_privacy_policy boolean not null,
  mlh_emails boolean not null default false
);
