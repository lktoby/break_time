import { BottomNav } from "@/components/bottom-nav";
import { SignUpForm } from "@/components/sign-up-form";

export default function Page() {
  return (
    <div className="flex min-h-svh bg-[url('/background.png')] bg-cover w-full items-center justify-center pb-28">
      <div className="w-full max-w-sm">
        <SignUpForm />
      </div>
      <div className="absolute inset-x-0 bottom-0">
        <BottomNav />
      </div>
    </div>
  );
}
