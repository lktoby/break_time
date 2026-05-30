import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ButtonUsage() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ transform: "translateY(40px)" }}>
        <Button style={{ fontFamily: "NicoMoji" }}>
        きょうのシールをゲットしよう
        </Button>
      </div>
    </div>
  );
}