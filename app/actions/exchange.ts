"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

type OkResult = { ok: true };
type ErrResult = { error: string };

// 交換申請を送る
export async function sendExchangeRequest(
  receiverId: string,
  offeredStickerId: number,
): Promise<OkResult | ErrResult> {
  const supabase = await createClient();

  const { data, error: authError } = await supabase.auth.getClaims();
  if (authError || !data?.claims) {
    return { error: "not authenticated" };
  }

  const { error } = await supabase.rpc("create_exchange_request", {
    p_receiver_id: receiverId,
    p_offered_sticker_id: offeredStickerId,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/exchange");
  return { ok: true };
}

// 交換申請を承認する
export async function acceptExchange(
  requestId: number,
  myStickerId: number,
): Promise<OkResult | ErrResult> {
  const supabase = await createClient();

  const { data, error: authError } = await supabase.auth.getClaims();
  if (authError || !data?.claims) {
    return { error: "not authenticated" };
  }

  const { error } = await supabase.rpc("accept_exchange_request", {
    p_request_id: requestId,
    p_receiver_sticker_id: myStickerId,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/exchange");
  revalidatePath("/my-stickers");
  return { ok: true };
}

// 交換申請を拒否する
export async function rejectExchange(
  requestId: number,
): Promise<OkResult | ErrResult> {
  const supabase = await createClient();

  const { data, error: authError } = await supabase.auth.getClaims();
  if (authError || !data?.claims) {
    return { error: "not authenticated" };
  }

  const { error } = await supabase
    .from("exchange_requests")
    .update({ status: "rejected", responded_at: new Date().toISOString() })
    .eq("id", requestId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/exchange");
  return { ok: true };
}
