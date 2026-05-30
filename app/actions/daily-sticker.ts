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

  // Supabaseのjoinは配列で返るので最初の要素を取る
  const raw = event.stickers as { name: string; image_path: string }[] | null;
  if (!raw || raw.length === 0) {
    return { error: "sticker not found" };
  }
  const sticker = raw[0];

  return { sticker, eventId };
}
