"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import {
  sendExchangeRequest,
  acceptExchange,
  rejectExchange,
} from "@/app/actions/exchange";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type StickerInfo = { name: string; image_path: string };
type MySticker = { sticker_id: number; quantity: number } & StickerInfo;
type OnlineUser = { id: string; display_name: string; avatar_key: string };
type IncomingRequest = {
  id: number;
  offered_sticker_id: number;
  requester_id: string;
  requester_name: string;
  requester_avatar: string;
  offered: StickerInfo;
};

const ONLINE_WINDOW_MS = 60_000;

export function ExchangeClient() {
  const [myStickers, setMyStickers] = useState<MySticker[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [incoming, setIncoming] = useState<IncomingRequest[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // 申請ダイアログ（送る相手）/ 承認ダイアログ（受け取る申請）
  const [sendTarget, setSendTarget] = useState<OnlineUser | null>(null);
  const [acceptTarget, setAcceptTarget] = useState<IncomingRequest | null>(null);
  const [picked, setPicked] = useState<number | null>(null);

  const load = useCallback(async () => {
    const supabase = createClient();
    const { data: claims } = await supabase.auth.getClaims();
    const uid = claims?.claims?.sub;
    if (!uid) return;

    // シールマスタ（id -> 名前/画像）
    const { data: stickers } = await supabase
      .from("stickers")
      .select("id, name, image_path");
    const stickerMap = new Map<number, StickerInfo>(
      (stickers ?? []).map((s) => [
        s.id as number,
        { name: s.name as string, image_path: s.image_path as string },
      ]),
    );

    // 自分の所持シール
    const { data: owned } = await supabase
      .from("user_sticker_counts")
      .select("sticker_id, quantity")
      .gt("quantity", 0);
    setMyStickers(
      (owned ?? []).map((o) => ({
        sticker_id: o.sticker_id as number,
        quantity: o.quantity as number,
        ...(stickerMap.get(o.sticker_id as number) ?? {
          name: "？",
          image_path: "/grey_bear.png",
        }),
      })),
    );

    // オンラインのともだち
    const since = new Date(Date.now() - ONLINE_WINDOW_MS).toISOString();
    const { data: users } = await supabase
      .from("profiles")
      .select("id, display_name, avatar_key, last_seen_at")
      .gt("last_seen_at", since)
      .neq("id", uid)
      .order("last_seen_at", { ascending: false });
    setOnlineUsers(
      (users ?? []).map((u) => ({
        id: u.id as string,
        display_name: u.display_name as string,
        avatar_key: u.avatar_key as string,
      })),
    );

    // 届いた交換リクエスト（pending・期限内）
    const { data: reqs } = await supabase
      .from("exchange_requests")
      .select("id, offered_sticker_id, requester_id")
      .eq("receiver_id", uid)
      .eq("status", "pending")
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false });

    const requesterIds = [
      ...new Set((reqs ?? []).map((r) => r.requester_id as string)),
    ];
    const profileMap = new Map<string, { display_name: string; avatar_key: string }>();
    if (requesterIds.length > 0) {
      const { data: profs } = await supabase
        .from("profiles")
        .select("id, display_name, avatar_key")
        .in("id", requesterIds);
      for (const p of profs ?? []) {
        profileMap.set(p.id as string, {
          display_name: p.display_name as string,
          avatar_key: p.avatar_key as string,
        });
      }
    }

    setIncoming(
      (reqs ?? []).map((r) => {
        const prof = profileMap.get(r.requester_id as string);
        return {
          id: r.id as number,
          offered_sticker_id: r.offered_sticker_id as number,
          requester_id: r.requester_id as string,
          requester_name: prof?.display_name ?? "ともだち",
          requester_avatar: prof?.avatar_key ?? "avatar-1",
          offered: stickerMap.get(r.offered_sticker_id as number) ?? {
            name: "？",
            image_path: "/grey_bear.png",
          },
        };
      }),
    );
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, 15_000);
    return () => clearInterval(id);
  }, [load]);

  const closeDialogs = () => {
    setSendTarget(null);
    setAcceptTarget(null);
    setPicked(null);
  };

  const handleSend = async () => {
    if (!sendTarget || picked === null) return;
    setBusy(true);
    const res = await sendExchangeRequest(sendTarget.id, picked);
    setBusy(false);
    closeDialogs();
    setMessage("ok" in res ? "こうかんリクエストを おくったよ！" : "おくれなかったよ…");
    load();
  };

  const handleAccept = async () => {
    if (!acceptTarget || picked === null) return;
    setBusy(true);
    const res = await acceptExchange(acceptTarget.id, picked);
    setBusy(false);
    closeDialogs();
    setMessage("ok" in res ? "こうかんできたよ！シールちょうを みてね！" : "こうかんできなかったよ…");
    load();
  };

  const handleReject = async (req: IncomingRequest) => {
    setBusy(true);
    const res = await rejectExchange(req.id);
    setBusy(false);
    setMessage("ok" in res ? "ことわったよ。" : "しっぱいしたよ…");
    load();
  };

  return (
    <div className="min-h-screen bg-[url('/background.png')] bg-cover bg-center">
      <div className="mx-auto flex max-w-md flex-col gap-8 px-4 py-6 pb-28">
        {message && (
          <p className="rounded-xl bg-white/80 p-3 text-center text-purple-700">
            {message}
          </p>
        )}

        {/* オンラインのともだち */}
        <section className="flex flex-col gap-3">
          <h2 className="text-center text-xl text-white drop-shadow [-webkit-text-stroke:0]">
            こうかんするともだちをえらぶ
          </h2>
          {onlineUsers.length === 0 ? (
            <p className="text-center text-white [-webkit-text-stroke:0]">
              いま オンラインの ともだちは いないよ
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {onlineUsers.map((u) => (
                <li
                  key={u.id}
                  className="flex items-center justify-between gap-3 rounded-xl bg-white/85 p-2"
                >
                  <div className="flex items-center gap-3">
                    <Image
                      src={`/avatars/${u.avatar_key}.png`}
                      alt={u.display_name}
                      width={44}
                      height={44}
                      className="rounded-full"
                    />
                    <span className="text-purple-700">{u.display_name}</span>
                  </div>
                  <Button
                    onClick={() => {
                      setPicked(null);
                      setSendTarget(u);
                    }}
                  >
                    シールをおくる
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* 届いた交換リクエスト */}
        <section className="flex flex-col gap-3">
          <h2 className="text-center text-xl text-white drop-shadow [-webkit-text-stroke:0]">
            うけとったこうかんリクエスト
          </h2>
          {incoming.length === 0 ? (
            <p className="text-center text-white [-webkit-text-stroke:0]">
              まだ リクエストは ないよ
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {incoming.map((r) => (
                <li
                  key={r.id}
                  className="flex items-center justify-between gap-3 rounded-xl bg-white/85 p-2"
                >
                  <div className="flex items-center gap-2">
                    <Image
                      src={r.offered.image_path}
                      alt={r.offered.name}
                      width={44}
                      height={44}
                    />
                    <span className="text-sm text-purple-700">
                      {r.requester_name}さんが「{r.offered.name}」を おくったよ
                    </span>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Button
                      onClick={() => {
                        setPicked(null);
                        setAcceptTarget(r);
                      }}
                    >
                      うけとる
                    </Button>
                    <Button
                      variant="outline"
                      disabled={busy}
                      onClick={() => handleReject(r)}
                    >
                      やめる
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* 申請ダイアログ：自分のシールをえらんで送る */}
      <AlertDialog
        open={sendTarget !== null}
        onOpenChange={(o) => !o && closeDialogs()}
      >
        <AlertDialogContent>
          <AlertDialogTitle>
            {sendTarget?.display_name}さんに おくるシールをえらぶ
          </AlertDialogTitle>
          <StickerPicker
            stickers={myStickers}
            picked={picked}
            onPick={setPicked}
          />
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={handleSend}
              disabled={busy || picked === null}
            >
              こうかんする
            </AlertDialogAction>
            <AlertDialogCancel>やめる</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 承認ダイアログ：相手のシールを見て、返すシールをえらぶ */}
      <AlertDialog
        open={acceptTarget !== null}
        onOpenChange={(o) => !o && closeDialogs()}
      >
        <AlertDialogContent>
          <AlertDialogTitle>
            {acceptTarget?.requester_name}さんからのシール
          </AlertDialogTitle>
          {acceptTarget && (
            <AlertDialogMedia className="flex justify-center bg-transparent">
              <Image
                src={acceptTarget.offered.image_path}
                alt={acceptTarget.offered.name}
                width={140}
                height={140}
              />
            </AlertDialogMedia>
          )}
          <AlertDialogDescription>かえすシールをえらんでね</AlertDialogDescription>
          <StickerPicker
            stickers={myStickers}
            picked={picked}
            onPick={setPicked}
          />
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={handleAccept}
              disabled={busy || picked === null}
            >
              こうかんする
            </AlertDialogAction>
            <AlertDialogCancel>やめる</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function StickerPicker({
  stickers,
  picked,
  onPick,
}: {
  stickers: MySticker[];
  picked: number | null;
  onPick: (id: number) => void;
}) {
  if (stickers.length === 0) {
    return (
      <p className="text-center text-muted-foreground">
        おくれるシールが ないよ
      </p>
    );
  }
  return (
    <div className="grid max-h-64 grid-cols-4 gap-2 overflow-y-auto">
      {stickers.map((s) => (
        <button
          key={s.sticker_id}
          type="button"
          onClick={() => onPick(s.sticker_id)}
          className={`relative rounded-md p-1 shadow-[0_4px_4px_rgba(0,0,0,0.2)] ${
            picked === s.sticker_id ? "border-2 border-purple-500 bg-white" : "bg-white/70"
          }`}
        >
          <Image src={s.image_path} alt={s.name} width={80} height={80} />
          {s.quantity > 1 && (
            <span className="absolute bottom-0 right-0 rounded-tl bg-purple-600 px-1 text-xs text-white">
              ×{s.quantity}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
