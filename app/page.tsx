import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/bottom-nav";

export default function ButtonUsage() {
  return (
    <div className="min-h-screen bg-[url('/opening2.png')] bg-cover bg-center relative">

      
      
      <div className="absolute top-48 left-1/2 -translate-x-1/2">
      <h1 className="title">
        {"わくわくシールちょう".split("").map((char, index) => (
          <span key={index} className="letter"
          style={{animationDelay: `${index * 0.2}s`,}}>
            {char}
          </span>
        ))}
      </h1>
      </div>

      
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ transform: "translateY(40px)" }}>
          <Button>きょうのシールをゲットしよう★</Button>
        </div>
      </div>

      
      <div className="absolute inset-x-0 bottom-0">
        <BottomNav />
      </div>
    </div>
  );
}