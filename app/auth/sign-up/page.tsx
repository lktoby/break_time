import { SignUpForm } from "@/components/sign-up-form";

export default function Page() {
  return (
    <div className="flex min-h-svh bg-[url('/background.png')] bg-cover w-full items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <SignUpForm />
      </div>
    </div>
  );
}
