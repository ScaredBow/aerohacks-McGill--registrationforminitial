alter table public.registrations
add column team_mode text not null,
add column team_name text,
add column fields_of_study text[] not null,
add column interests text[] not null,
add column other_interest text;

alter table public.registrations
drop column if exists team_join_code;

alter table public.registrations
add column captain_email text;

alter table public.registrations
add column dietary_restrictions text[],
add column other_dietary text,
add column accessibility_needs text;
