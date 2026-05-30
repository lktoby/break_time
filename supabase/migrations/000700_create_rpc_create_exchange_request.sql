create or replace function create_exchange_request(
  p_receiver_id       uuid,
  p_offered_sticker_id bigint
)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  v_requester_id uuid := auth.uid();
  v_request_id   bigint;
begin
  -- 本人確認
  if v_requester_id is null then
    raise exception 'not authenticated';
  end if;

  -- 自分自身への申請禁止
  if v_requester_id = p_receiver_id then
    raise exception 'cannot request exchange with yourself';
  end if;

  -- offered sticker の在庫確認
  if not exists (
    select 1 from user_sticker_counts
    where user_id = v_requester_id
      and sticker_id = p_offered_sticker_id
      and quantity >= 1
  ) then
    raise exception 'you do not have the offered sticker';
  end if;

  -- 同じ相手に pending が既にある場合は重複申請禁止
  if exists (
    select 1 from exchange_requests
    where requester_id = v_requester_id
      and receiver_id  = p_receiver_id
      and status = 'pending'
      and expires_at > now()
  ) then
    raise exception 'pending request to this user already exists';
  end if;

  insert into exchange_requests
    (requester_id, receiver_id, offered_sticker_id, expires_at)
  values
    (v_requester_id, p_receiver_id, p_offered_sticker_id, now() + interval '15 minutes')
  returning id into v_request_id;

  return v_request_id;
end;
$$;
