create or replace function accept_exchange_request(
  p_request_id          bigint,
  p_receiver_sticker_id bigint
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_requester_id       uuid;
  v_receiver_id        uuid;
  v_offered_sticker_id bigint;
begin
  -- リクエストを SELECT FOR UPDATE（二重承認防止）
  select requester_id, receiver_id, offered_sticker_id
  into v_requester_id, v_receiver_id, v_offered_sticker_id
  from exchange_requests
  where id = p_request_id
    and status = 'pending'
    and expires_at > now()
  for update;

  if not found then
    raise exception 'request not found or not pending or expired';
  end if;

  -- 呼び出し元が receiver 本人であることを確認
  if v_receiver_id <> auth.uid() then
    raise exception 'not authorized';
  end if;

  -- requester が offered_sticker を持っているか確認
  if not exists (
    select 1 from user_sticker_counts
    where user_id = v_requester_id
      and sticker_id = v_offered_sticker_id
      and quantity >= 1
  ) then
    raise exception 'requester does not have offered sticker';
  end if;

  -- receiver が p_receiver_sticker を持っているか確認
  if not exists (
    select 1 from user_sticker_counts
    where user_id = v_receiver_id
      and sticker_id = p_receiver_sticker_id
      and quantity >= 1
  ) then
    raise exception 'receiver does not have the selected sticker';
  end if;

  -- 在庫を移動（4ステップ）
  -- requester: offered を -1
  update user_sticker_counts
  set quantity = quantity - 1, updated_at = now()
  where user_id = v_requester_id and sticker_id = v_offered_sticker_id;

  -- receiver: offered を +1
  insert into user_sticker_counts (user_id, sticker_id, quantity, updated_at)
  values (v_receiver_id, v_offered_sticker_id, 1, now())
  on conflict (user_id, sticker_id)
  do update set quantity = user_sticker_counts.quantity + 1, updated_at = now();

  -- receiver: receiver_sticker を -1
  update user_sticker_counts
  set quantity = quantity - 1, updated_at = now()
  where user_id = v_receiver_id and sticker_id = p_receiver_sticker_id;

  -- requester: receiver_sticker を +1
  insert into user_sticker_counts (user_id, sticker_id, quantity, updated_at)
  values (v_requester_id, p_receiver_sticker_id, 1, now())
  on conflict (user_id, sticker_id)
  do update set quantity = user_sticker_counts.quantity + 1, updated_at = now();

  -- リクエストを accepted に更新
  update exchange_requests
  set status              = 'accepted',
      receiver_sticker_id = p_receiver_sticker_id,
      responded_at        = now()
  where id = p_request_id;
end;
$$;
