"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

// ログイン後の画面に常駐し、30秒ごとに自分の last_seen_at を更新する。
// これがオンライン判定（交換タブのオンラインユーザー一覧）の元になる。
export function Heartbeat() {
  useEffect(() => {
    const supabase = createClient();

    const beat = async () => {
      const { data } = await supabase.auth.getClaims();
      const uid = data?.claims?.sub;
      if (!uid) return;
      await supabase
        .from("profiles")
        .update({ last_seen_at: new Date().toISOString() })
        .eq("id", uid);
    };

    beat();
    const id = setInterval(beat, 30_000);
    return () => clearInterval(id);
  }, []);

  return null;
}
