"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { usernameToInternalEmail } from "@/lib/auth";

const AVATARS = ["avatar-1", "avatar-2", "avatar-3", "avatar-4", "avatar-5"];
const USERNAME_RE = /^[a-z0-9_]{3,20}$/;

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [avatarKey, setAvatarKey] = useState("avatar-1");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const normalizedUsername = username.trim().toLowerCase();
    if (!USERNAME_RE.test(normalizedUsername)) {
      setError("ユーザーめいは はんかくの えいすうじ で 3〜20もじ にしてね");
      return;
    }
    if (password !== repeatPassword) {
      setError("パスワードが あっていないよ");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: normalizedUsername,
          display_name: displayName.trim() || normalizedUsername,
          avatar_key: avatarKey,
          password,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        if (typeof body.error === "string" && body.error.includes("already")) {
          throw new Error("そのユーザーめいは つかわれているよ");
        }
        throw new Error("アカウントを つくれなかったよ");
      }

      // 作成したアカウントでそのままログインしてホームへ
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: usernameToInternalEmail(normalizedUsername),
        password,
      });
      if (signInError) {
        router.push("/auth/login");
        return;
      }
      router.push("/home");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "エラーが おきたよ");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn("flex flex-col gap-6 [-webkit-text-stroke:0]", className)}
      {...props}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">アカウントをつくる</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="username">ユーザーめい（はんかくえいすうじ）</Label>
                <Input
                  id="username"
                  type="text"
                  required
                  placeholder="taro123"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="display-name">なまえ（ひょうじめい）</Label>
                <Input
                  id="display-name"
                  type="text"
                  required
                  placeholder="たろう"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>アイコンをえらぶ</Label>
                <div className="flex flex-wrap gap-2">
                  {AVATARS.map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setAvatarKey(key)}
                      className={cn(
                        "rounded-full p-0.5",
                        avatarKey === key
                          ? "ring-4 ring-purple-500"
                          : "ring-2 ring-transparent",
                      )}
                    >
                      <Image
                        src={`/avatars/${key}.png`}
                        alt={key}
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">パスワード</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="repeat-password">パスワードかくにん</Label>
                <Input
                  id="repeat-password"
                  type="password"
                  required
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-red-500">{error}</p>}
              <Button
                type="submit"
                className="w-full text-2xl"
                disabled={isLoading}
              >
                {isLoading ? "よみこみちゅう..." : "アカウントをつくる"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              アカウントがすでにもっている？{" "}
              <Link href="/auth/login" className="underline underline-offset-4">
                ログイン
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
