import { BottomNav } from "@/components/bottom-nav";
import { Heartbeat } from "@/components/heartbeat";

// ログイン後の共通レイアウト。BottomNav と last_seen_at ハートビートを集約する。
// ルートグループ (main) なので URL には影響しない（/home・/book・/exchange のまま）。
export default function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Heartbeat />
      {children}
      <div className="fixed inset-x-0 bottom-0 z-50">
        <BottomNav />
      </div>
    </>
  );
}
