import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogMedia, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { Button } from "./ui/button";
import Image from "next/image";

export default function DailySticker(buttonText: string) {
    return (
        <AlertDialog>
            <AlertDialogTrigger>
                <Button>{buttonText}</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogTitle>きょうのシールゲット！</AlertDialogTitle>
                <AlertDialogMedia className="flex justify-center">
                    <div className="shadow-[0_4px_4px_rgba(0,0,0,0.2)]">
                        <Image src="/stickers/dog3.png" alt="sticker" width={160} height={160}></Image>
                    </div>
                </AlertDialogMedia>
                <AlertDialogAction>うけとる</AlertDialogAction>
            </AlertDialogContent>
        </AlertDialog>
    )
}