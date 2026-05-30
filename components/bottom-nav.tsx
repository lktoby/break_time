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
                            <li><Link href='/'><Image src='/bear.png' alt='home page' height={100} width={100}></Image></Link></li>
                            <li><Link href='/' className="">ホーム</Link></li>
                        </ul>
                    </button>
                    <button className="grow focus:opacity-60 focus:bg-purple-200 focus:rounded-xl hover:opacity-60">
                        <ul className="flex flex-col grow items-center">
                        <li><Link href='/exchange'><Image src='/dog1.png' alt='exchange' height={100} width={100}></Image></Link></li>
                        <li><Link href='/exchange'>こうかん</Link></li>
                    </ul>
                    </button>
                    <button className="grow focus:opacity-60 focus:bg-purple-200 focus:rounded-xl hover:opacity-60">
                        <ul className="flex flex-col grow items-center">
                            <li><Link href='/book'><Image src='/cat1.png' alt='collection' height={100} width={100}></Image></Link></li>
                            <li><Link href='/book'>シールちょう</Link></li>
                        </ul>
                    </button>
                    
                </div>
                
            </nav>
        </div>
    )
}