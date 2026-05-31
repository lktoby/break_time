"use server";

import { createClient } from "@/lib/supabase/server";

type ClaimResult =
  | { sticker: { name: string; image_path: string }; eventId: number }
  | { error: string };

export async function claimDailySticker(): Promise<ClaimResult> {
  const supabase = await createClient();

  const { data, error: authError } = await supabase.auth.getClaims();
  if (authError || !data?.claims) {
    return { error: "not authenticated" };
  }

  const userId = data.claims.sub;

  const { data: eventId, error: rpcError } = await supabase.rpc(
    "grant_login_bonus",
    { p_user_id: userId },
  );

  if (rpcError) {
    return { error: rpcError.message };
  }

  // event_id からもらったシール情報を取得してUIに返す
  const { data: event, error: fetchError } = await supabase
    .from("login_bonus_events")
    .select("sticker_id, stickers(name, image_path)")
    .eq("id", eventId)
    .single();

  if (fetchError || !event) {
    return { error: fetchError?.message ?? "failed to fetch sticker info" };
  }

  // 埋め込み（join）は many-to-one なら単一オブジェクト、版によっては配列で返る。
  // どちらでも壊れないよう正規化する。
  type StickerInfo = { name: string; image_path: string };
  const raw = event.stickers as StickerInfo | StickerInfo[] | null;
  const sticker = Array.isArray(raw) ? raw[0] : raw;
  if (!sticker) {
    return { error: "sticker not found" };
  }

  return { sticker, eventId };
}
