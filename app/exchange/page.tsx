import Accept from "@/components/accept-popup"
import { BottomNav } from "@/components/bottom-nav"
import Exchange from "@/components/exchange-popup"
import { Input } from "@/components/ui/input"

export default function ExchangePage() {
    return (
        <div className="min-h-screen bg-[url('/background.png')] bg-cover flex items-center justify-evenly">
            <div className="flex flex-col items-center justify-center h-full pb-[100px] gap-6">
                <div className="flex flex-col m-6">
                    <div className="text-center">こうかんするともだちをえらぶ</div>
                    <div className="flex flex-row items-center justify-evenly gap-6">
                        <Input className="w-xl h-10 bg-white text-purple-700 outline-none rounded-xl" placeholder="ねこ"></Input>
                        {Exchange("シールをえらぶ")}
                    </div>
                </div>
                <div className="flex flex-col m-6">
                    <div className="text-center">うけとったこうかんリクエスト</div>
                    <div className="flex flex-row items-center justify-evenly gap-6">
                        <Input className="w-xl h-10 bg-white text-purple-700 outline-none rounded-xl" placeholder="おともだちのなまえ"></Input>
                        {Accept("うけとる")}
                    </div>
                </div>
                
            </div>
            <div className="absolute inset-x-0 bottom-0">
                    <BottomNav></BottomNav>
                </div>
        </div>
    )
}