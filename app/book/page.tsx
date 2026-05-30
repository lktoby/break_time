import { BottomNav } from "@/components/bottom-nav"
import Link from "next/link"

export default function Book() {
    return (
        <div>
            <div>hello book</div>
            <div className="absolute inset-x-0 bottom-0">
                <BottomNav></BottomNav>
            </div>
        </div>
    )
}