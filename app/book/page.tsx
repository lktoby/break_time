import { BottomNav } from "@/components/bottom-nav";
import { Badge } from "@/components/ui/badge";

export default function Book() {
  return (
    <div className="min-h-screen bg-[url('/background.png')] bg-cover bg-center relative">

     
      <div className="flex justify-center">
        <div className="p-6 text-3xl font-bold">
        <Badge>★シールちょう★</Badge>
        </div>
      </div>
      

      
      <div className="flex justify-center">
        <div className="grid grid-cols-8 gap-8 p-5 pb-24">
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className="w-16 h-16 bg-white rounded-xl shadow border border-gray-100"
            />
          ))}
        </div>
      </div>

      {/* BottomNav */}
      <div className="absolute inset-x-0 bottom-0">
        <BottomNav />
      </div>

    </div>
  );
}