"use client";

import { useState } from "react";
import Image from "next/image";
import { claimDailySticker } from "@/app/actions/daily-sticker";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Sticker = { name: string; image_path: string };

// ホームの「きょうのシール」取得ボタン。
// claimDailySticker()（Server Action / RPC grant_login_bonus）を呼び、
// 当たったシールをポップアップで見せる。1日2回目以降は専用メッセージ。
export function DailySticker() {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [sticker, setSticker] = useState<Sticker | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleClaim = async () => {
    setLoading(true);
    setMessage(null);
    const res = await claimDailySticker();
    setLoading(false);

    if ("sticker" in res) {
      setSticker(res.sticker);
      setOpen(true);
    } else if (res.error.includes("already received")) {
      setMessage("きょうのシールは もうもらったよ！また あした！");
    } else {
      // デバッグ用：実際のエラー内容を表示
      setMessage(`エラー: ${res.error}`);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Button
        className="text-2xl px-8 py-6"
        onClick={handleClaim}
        disabled={loading}
      >
        {loading ? "あけてるよ..." : "きょうのシールをもらう★"}
      </Button>

      {message && (
        <p className="text-lg text-white drop-shadow [-webkit-text-stroke:0]">
          {message}
        </p>
      )}

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogTitle className="text-2xl">
            あたらしいシールだよ！
          </AlertDialogTitle>
          {sticker && (
            <>
              <AlertDialogMedia className="flex justify-center bg-transparent">
                <Image
                  src={sticker.image_path}
                  alt={sticker.name}
                  width={200}
                  height={200}
                />
              </AlertDialogMedia>
              <AlertDialogDescription className="text-xl">
                「{sticker.name}」を てにいれた！
              </AlertDialogDescription>
            </>
          )}
          <AlertDialogAction>やったー！</AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
