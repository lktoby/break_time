-- ============================================================
-- stickers
-- ============================================================
alter table stickers enable row level security;

create policy "stickers_select_authenticated"
  on stickers for select
  to authenticated
  using (true);

-- INSERT / UPDATE / DELETE はポリシーなし = 全拒否

-- ============================================================
-- profiles
-- ============================================================
alter table profiles enable row level security;

create policy "profiles_select_authenticated"
  on profiles for select
  to authenticated
  using (true);

create policy "profiles_insert_own"
  on profiles for insert
  to authenticated
  with check (id = auth.uid());

create policy "profiles_update_own"
  on profiles for update
  to authenticated
  using  (id = auth.uid())
  with check (id = auth.uid());

-- ============================================================
-- user_sticker_counts  ※書き込みポリシーは一切作らない（RPC専用）
-- ============================================================
alter table user_sticker_counts enable row level security;

create policy "user_sticker_counts_select_own"
  on user_sticker_counts for select
  to authenticated
  using (user_id = auth.uid());

-- ============================================================
-- login_bonus_events  ※INSERT は grant_login_bonus RPC のみ
-- ============================================================
alter table login_bonus_events enable row level security;

create policy "login_bonus_events_select_own"
  on login_bonus_events for select
  to authenticated
  using (user_id = auth.uid());

-- ============================================================
-- exchange_requests
-- ============================================================
alter table exchange_requests enable row level security;

-- 当事者（requester / receiver）だけ読める
create policy "exchange_requests_select_participant"
  on exchange_requests for select
  to authenticated
  using (requester_id = auth.uid() or receiver_id = auth.uid());

-- requester 本人のみ作成可
-- （在庫確認・expires_at は create_exchange_request RPC に任せてもよい）
create policy "exchange_requests_insert_requester"
  on exchange_requests for insert
  to authenticated
  with check (requester_id = auth.uid());

-- receiver 本人が pending を rejected に変更できる
create policy "exchange_requests_update_reject"
  on exchange_requests for update
  to authenticated
  using  (receiver_id = auth.uid() and status = 'pending')
  with check (status = 'rejected');

-- accepted への UPDATE は accept_exchange_request RPC (SECURITY DEFINER) のみ
