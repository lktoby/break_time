import Link from "next/link";
import { BottomNav } from "@/components/bottom-nav";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-cover bg-center" >
      <div className="text-center text-white text-3xl pt-20">
        hello world
      </div>
      <div className="text-center mt-10">
        <Link href="/exchange">click me</Link>
        <br />
        <Link href="/book">book</Link>
        <Button>button</Button>
        <div className="absolute inset-x-0 bottom-0">
          <BottomNav></BottomNav>
        </div>
      </div>
    </div>
  );
}