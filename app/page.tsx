import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/bottom-nav";

export default function ButtonUsage() {
  return (
    <div
      className="min-h-screen bg-[url('/opening.png')] bg-cover bg-center relative"
    >
     
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ transform: "translateY(40px)" }}>
          <Button>きょうのシールをゲットしよう</Button>
        </div>
      </div>

     
      <div className="absolute inset-x-0 bottom-0">
        <BottomNav />
      </div>
    </div>
  );
}