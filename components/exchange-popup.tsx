import { Button } from "./ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogMedia, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import Image from "next/image";

export default function Exchange(buttonText: string) {
    return (
        <div>
            <AlertDialog>
                <AlertDialogTrigger>
                    <Button>{buttonText}</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogTitle>ぱんだとこうかんするよ！</AlertDialogTitle>
                    <AlertDialogDescription>わたすシールをえらんでね</AlertDialogDescription>
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