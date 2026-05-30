import { BottomNav } from "@/components/bottom-nav"
import Link from "next/link"

export default function Exchange() {
    return (
        <div
      className="min-h-screen bg-[url('/background.png')] bg-cover bg-center relative">
        
        <div>
            <div>こうかんする</div>
            <div className="absolute inset-x-0 bottom-0">
                <BottomNav></BottomNav>
            </div>
        </div>
        </div>
        
    )
}