create table profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  username     text not null unique,
  display_name text not null,
  avatar_key   text not null default 'avatar-1',
  last_seen_at timestamptz,
  created_at   timestamptz not null default now(),

  constraint username_format_check
    check (username ~ '^[a-z0-9_]{3,20}$'),
  constraint username_lowercase_check
    check (username = lower(username))
);
