// ユーザー名には日本語などの非 ASCII 文字が含まれうるが、メールアドレスの
// ローカル部は ASCII しか許可されない（Supabase/GoTrue の検証で弾かれる）。
// そのため UTF-8 バイト列を 16 進数にエンコードしてローカル部に使う。
// 決定的な変換なので、登録時とログイン時で必ず同じ内部メールになる。
export function usernameToInternalEmail(username: string): string {
  const normalized = username.trim().toLowerCase();
  const bytes = new TextEncoder().encode(normalized);
  const localPart = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `${localPart}@seal-app.invalid`;
}
