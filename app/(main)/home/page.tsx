import { DailySticker } from "@/components/daily-sticker";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[url('/background.png')] bg-cover bg-center">
      <div className="flex flex-col items-center justify-center min-h-screen gap-8 pb-28">
        <h1 className="title">
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
        <DailySticker />
      </div>
    </div>
  );
}
