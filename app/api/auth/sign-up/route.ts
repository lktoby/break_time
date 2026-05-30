import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { usernameToInternalEmail } from "@/lib/auth";

export async function POST(request: Request) {
  const { username, display_name, avatar_key, password } = await request.json();

  const supabase = await createClient();
  const email = usernameToInternalEmail(username);

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signUpError || !signUpData.user) {
    return NextResponse.json(
      { error: signUpError?.message ?? "sign-up failed" },
      { status: 400 },
    );
  }

  const { error: profileError } = await supabase.from("profiles").insert({
    id: signUpData.user.id,
    username,
    display_name,
    avatar_key,
  });

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
