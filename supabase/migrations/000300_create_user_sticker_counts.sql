create table user_sticker_counts (
  user_id    uuid    not null references auth.users(id) on delete cascade,
  sticker_id bigint  not null references stickers(id) on delete cascade,
  quantity   integer not null default 0,
  updated_at timestamptz not null default now(),

  primary key (user_id, sticker_id),
  constraint quantity_non_negative check (quantity >= 0)
);
