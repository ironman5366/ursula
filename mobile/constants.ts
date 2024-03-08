// Supabase

// The anon key for an app may be public
export const SUPABASE_ANON_KEY = process.env
  .EXPO_PUBLIC_SUPABASE_ANON_KEY as string;

export const SUPABASE_PROJECT_URL =
  process.env.EXPO_PUBLIC_SUPABASE_PROJECT_URL;

if (!SUPABASE_ANON_KEY || !SUPABASE_PROJECT_URL) {
  throw new Error("Supabase keys not set");
}

export const ENVIRONMENT = process.env.EXPO_PUBLIC_ENVIRONMENT;

if (!ENVIRONMENT) {
  throw new Error("Environment not set");
}
