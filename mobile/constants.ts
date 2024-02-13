// Supabase

// The anon key for an app may be public
export const SUPABASE_ANON_KEY = process.env
  .EXPO_PUBLIC_SUPABASE_ANON_KEY as string;

export const SUPABASE_PROJECT_URL =
  process.env.EXPO_PUBLIC_SUPABASE_PROJECT_URL;

if (SUPABASE_ANON_KEY === undefined) {
  console.log("Supabase key is undefined!");
  console.log("Env vars", process.env);
}
