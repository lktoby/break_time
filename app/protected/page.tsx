import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/bottom-nav";

export default function ButtonUsage() {
  return (
    <div className="min-h-screen bg-[url('/opening2.png')] bg-cover bg-center relative">      
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="title mb-8">
          {"わくわくシールちょう".split("").map((char, index) => (
            <span key={index} className="letter"
            style={{animationDelay: `${index * 0.2}s`,}}>
              {char}
            </span>
          ))}
        </h1>
        <Button>きょうのシールをゲット★</Button>
      </div>
      <div className="absolute inset-x-0 bottom-0">
        <BottomNav />
      </div>
    </div>
  );
}