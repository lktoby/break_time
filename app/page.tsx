import Link from "next/link";

export default function Home() {
  return (
    <div>
      <div className="text-center bg-white">hello world</div>
      <Link href='/exchange'>click me</Link><br></br>
      <Link href='/book'>book</Link>
    </div>
  );
}
