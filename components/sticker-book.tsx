"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";

type StickerRow = {
  id: number;
  name: string;
  image_path: string;
  rarity: string;
};

type Cell = StickerRow & { quantity: number };

// シール帳。全シール（stickers）と自分の所持（user_sticker_counts）を取得してマージ。
// 所持＝実画像＋枚数バッジ、未所持＝シルエット（grey_bear.png）＋「？？？」。
export function StickerBook() {
  const [cells, setCells] = useState<Cell[] | null>(null);

  useEffect(() => {
    const supabase = createClient();

    const load = async () => {
      const { data: all } = await supabase
        .from("stickers")
        .select("id, name, image_path, rarity")
        .order("id");

      const { data: owned } = await supabase
        .from("user_sticker_counts")
        .select("sticker_id, quantity")
        .gt("quantity", 0);

      const ownedMap = new Map<number, number>(
        (owned ?? []).map((o) => [o.sticker_id as number, o.quantity as number]),
      );

      setCells(
        (all ?? []).map((s) => ({
          ...(s as StickerRow),
          quantity: ownedMap.get((s as StickerRow).id) ?? 0,
        })),
      );
    };

    load();
  }, []);

  return (
    <div className="min-h-screen bg-[url('/background.png')] bg-cover bg-center">
      <div className="flex justify-center">
        <div className="p-6 text-3xl font-bold">
          <Badge>★シールちょう★</Badge>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-6 p-5 pb-28">
          {cells === null
            ? Array.from({ length: 18 }).map((_, i) => (
                <div
                  key={i}
                  className="w-20 h-20 rounded-xl bg-black/30 animate-pulse"
                />
              ))
            : cells.map((c) => {
                const owned = c.quantity > 0;
                return (
                  <div
                    key={c.id}
                    className="relative w-20 h-20 rounded-xl border border-black/10 overflow-hidden shadow-[0_4px_0_rgba(0,0,0,0.2)] bg-white"
                  >
                    <Image
                      src={owned ? c.image_path : "/grey_bear.png"}
                      alt={owned ? c.name : "？？？"}
                      fill
                      sizes="80px"
                      className={owned ? "object-cover" : "object-cover opacity-60"}
                    />
                    {owned && c.quantity > 1 && (
                      <span className="absolute bottom-0 right-0 rounded-tl-md bg-purple-600 px-1.5 text-xs text-white">
                        ×{c.quantity}
                      </span>
                    )}
                    {!owned && (
                      <span className="absolute inset-x-0 bottom-0 bg-black/40 text-center text-xs text-white">
                        ？？？
                      </span>
                    )}
                  </div>
                );
              })}
        </div>
      </div>
    </div>
  );
}
