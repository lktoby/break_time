import Link from "next/link";
import Image from "next/image";

export function BottomNav() {
    return (
        <div>
            <nav className="flex justify-around items-end text-center">
                <ul className="flex flex-col items-center">
                    <li><Link href='/' passHref><Image src='/bear.png' alt='home page' height={100} width={100}></Image></Link></li>
                    <li><Link href='/' className="">ホーム</Link></li>
                </ul>
                <ul className="flex flex-col items-center">
                    <li><Link href='/exchange'><Image src='/dog1.png' alt='exchange' height={100} width={100}></Image></Link></li>
                    <li><Link href='/exchange'>こうかん</Link></li>
                </ul>
                <ul className="flex flex-col items-center">
                    <li><Link href='/book'><Image src='/cat1.png' alt='collection' height={100} width={100}></Image></Link></li>
                    <li><Link href='/book'>シールちょう</Link></li>
                </ul>
            </nav>
        </div>
    )
}