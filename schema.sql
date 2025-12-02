-- PostgreSQL schema for rooms (use "available" instead of "is_active")

create extension if not exists "pgcrypto";

create table rooms (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  capacity integer not null check (capacity > 0),
  available boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function set_updated_at() returns trigger as $$
begin
  new.updated_at := now();
  return new;
end;
$$ language plpgsql;

create trigger trg_rooms_set_updated_at
before update on rooms
for each row
execute function set_updated_at();

create index if not exists idx_rooms_name on rooms (name);

insert into rooms (name, capacity) values
  ('Conference A', 12),
  ('Meeting B', 6),
  ('Focus Room', 2)
on conflict (name) do nothing;

-- Insert statements: 10 available rooms
INSERT INTO rooms (name, capacity, available) VALUES
  ('Boardroom 1', 16, true),
  ('Boardroom 2', 14, true),
  ('Conference 1', 20, true),
  ('Conference 2', 10, true),
  ('Huddle 1', 4, true),
  ('Huddle 2', 4, true),
  ('Training Room', 30, true),
  ('Interview Room', 2, true),
  ('Lounge Room', 8, true),
  ('Lab Room', 6, true)
ON CONFLICT (name) DO NOTHING;

-- Insert statements: 10 booked (available = false)
INSERT INTO rooms (name, capacity, available) VALUES
  ('Booked Room 1', 12, false),
  ('Booked Room 2', 10, false),
  ('Booked Room 3', 6, false),
  ('Booked Room 4', 8, false),
  ('Booked Room 5', 20, false),
  ('Booked Room 6', 3, false),
  ('Booked Room 7', 5, false),
  ('Booked Room 8', 18, false),
  ('Booked Room 9', 2, false),
  ('Booked Room 10', 15, false)
ON CONFLICT (name) DO NOTHING;