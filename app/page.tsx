import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Landing() {
  return (
    <div className="min-h-screen bg-[url('/opening2.png')] bg-cover bg-center relative">
      <div className="flex flex-col items-center justify-center h-screen gap-8">
        <h1 className="title mb-8">
          {"わくわくシールちょう".split("").map((char, index) => (
            <span
              key={index}
              className="letter"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {char}
            </span>
          ))}
        </h1>
        <Button className="text-2xl px-8 py-6" asChild>
          <Link href="/auth/login">ログイン</Link>
        </Button>
      </div>
    </div>
  );
}
