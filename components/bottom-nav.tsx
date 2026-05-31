import Link from "next/link";
import Image from "next/image";
import styles from '../components/styles/botton-nav.module.css';

export function BottomNav() {
    return (
        <div>
            <nav className={styles.nav}>
                <div className="flex justify-around items-end text-center flex-stretch">
                    <button className="grow focus:opacity-60 focus:bg-purple-200 focus:rounded-xl hover:opacity-60">
                        <ul className="flex flex-col items-center">
                            <li>
                                <Link href='/home'>
                                    <div className="w-20 h-20 rounded-full bg-white overflow-hidden relative">
                                        <Image src='/stickers/bear.png' alt='home page' fill className="object-cover"></Image>
                                    </div>
                                </Link>
                            </li>
                            <li><Link href='/home' className="">ホーム</Link></li>
                        </ul>
                    </button>
                    <button className="grow focus:opacity-60 focus:bg-purple-200 focus:rounded-xl hover:opacity-60">
                        <ul className="flex flex-col grow items-center">
                            <li>
                                <Link href='/exchange'>
                                    <div className="w-20 h-20 rounded-full bg-white overflow-hidden relative">
                                        <Image src='/stickers/dog3.png' alt='exchange' fill className="object-cover"></Image>
                                    </div>
                                </Link>
                            </li>
                            <li><Link href='/exchange'>こうかん</Link></li>
                        </ul>
                    </button>
                    <button className="grow focus:opacity-60 focus:bg-purple-200 focus:rounded-xl hover:opacity-60">
                        <ul className="flex flex-col grow items-center">
                            <li>
                                <Link href='/book'>
                                    <div className="w-20 h-20 rounded-full bg-white overflow-hidden relative">
                                        <Image src='/stickers/cat1.png' alt='collection' fill className="object-cover"></Image>
                                    </div>
                                </Link>
                            </li>
                            <li><Link href='/book'>シールちょう</Link></li>
                        </ul>
                    </button>
                    
                </div>
                
            </nav>
        </div>
    )
}