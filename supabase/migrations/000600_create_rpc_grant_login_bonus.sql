create or replace function grant_login_bonus(p_user_id uuid)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  v_sticker_id bigint;
  v_event_id   bigint;
begin
  -- 1日1回制限（JST基準）
  if exists (
    select 1 from login_bonus_events
    where user_id = p_user_id
      and (granted_at at time zone 'Asia/Tokyo')::date
          = (now() at time zone 'Asia/Tokyo')::date
  ) then
    raise exception 'already received today';
  end if;

  -- rarity = 'normal' のシールからランダムに1件選ぶ
  select id into v_sticker_id
  from stickers
  where rarity = 'normal'
  order by random()
  limit 1;

  if v_sticker_id is null then
    raise exception 'no normal stickers available';
  end if;

  -- 所持枚数を +1（なければ新規作成）
  insert into user_sticker_counts (user_id, sticker_id, quantity, updated_at)
  values (p_user_id, v_sticker_id, 1, now())
  on conflict (user_id, sticker_id)
  do update set
    quantity   = user_sticker_counts.quantity + 1,
    updated_at = now();

  -- ボーナスイベント記録
  insert into login_bonus_events (user_id, sticker_id)
  values (p_user_id, v_sticker_id)
  returning id into v_event_id;

  return v_event_id;
end;
$$;
