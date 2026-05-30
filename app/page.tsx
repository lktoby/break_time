import Link from "next/link";
import { BottomNav } from "@/components/bottom-nav";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div>
      <div className="text-center bg-white">hello world</div>
      <Button>button</Button>
      <div className="absolute inset-x-0 bottom-0">
        <BottomNav></BottomNav>
      </div>
    </div>
  );
}
