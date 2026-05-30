import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createClient();

  const { data, error: authError } = await supabase.auth.getClaims();
  if (authError || !data?.claims) {
    return NextResponse.json({ error: "not authenticated" }, { status: 401 });
  }

  const userId = data.claims.sub;

  const { data: eventId, error: rpcError } = await supabase.rpc(
    "grant_login_bonus",
    { p_user_id: userId },
  );

  if (rpcError) {
    // already received today は正常系（2回目以降のログイン）
    if (rpcError.message.includes("already received today")) {
      return NextResponse.json({ alreadyReceived: true });
    }
    return NextResponse.json({ error: rpcError.message }, { status: 500 });
  }

  return NextResponse.json({ eventId });
}
