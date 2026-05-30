
import { AlertDialogTrigger, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogMedia, AlertDialogAction, AlertDialogCancel, AlertDialog } from "./ui/alert-dialog";
import { Button } from "./ui/button";
import Image from "next/image";

export default function Accept(buttonText: string) {
    return (
        <div>
            <AlertDialog>
                <AlertDialogTrigger>
                    <Button>{buttonText}</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogTitle>ぱんだからのシールだよ</AlertDialogTitle>
                    <AlertDialogMedia className="flex justify-center">
                        <div className="shadow-[0_4px_4px_rgba(0,0,0,0.2)]">
                            <Image src="/dog2.png" alt="sticker" width={160} height={160}></Image>
                        </div>
                    </AlertDialogMedia>
                    <AlertDialogDescription>こうかんするシールをえらんでね</AlertDialogDescription>
                    <AlertDialogMedia className="grid w-full grid-cols-4">
                        <button type="button" className="hover:translate-y-1 focus:border-white focus:border-2 shadow-[0_4px_4px_rgba(0,0,0,0.2)]">
                            <Image src="/cherry.png" alt="sticker" width={160} height={160}></Image>
                        </button>
                        <button type="button" className="hover:translate-y-1 focus:border-white focus:border-2 shadow-[0_4px_4px_rgba(0,0,0,0.2)]">
                            <Image src="/girl.png" alt="sticker" width={160} height={160}></Image>
                        </button>
                        <button type="button" className="hover:translate-y-1 focus:border-white focus:border-2 shadow-[0_4px_4px_rgba(0,0,0,0.2)]">
                            <Image src="/sakura.png" alt="sticker" width={160} height={160}></Image>
                        </button>
                        <button type="button" className="hover:translate-y-1 focus:border-white focus:border-2 shadow-[0_4px_4px_rgba(0,0,0,0.2)]">
                            <Image src="/sumire.png" alt="sticker" width={160} height={160}></Image>
                        </button>
                        <button type="button" className="hover:translate-y-1 focus:border-white focus:border-2 shadow-[0_4px_4px_rgba(0,0,0,0.2)]">
                            <Image src="/star.png" alt="sticker" width={160} height={160}></Image>
                        </button>
                    </AlertDialogMedia>
                    <AlertDialogAction>こうかんする</AlertDialogAction>
                    <AlertDialogCancel>やめる</AlertDialogCancel>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}