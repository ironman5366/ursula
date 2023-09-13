export const FUNCTIONS_API_URL = process.env
  .EXPO_PUBLIC_FUNCTIONS_API_URL as string;

export const GOOGLE_BOOKS_API_URL =
  "https://www.googleapis.com/books/v1/volumes";

// Supabase

// The anon key for an app may be public
export const SUPABASE_ANON_KEY = process.env
  .EXPO_PUBLIC_SUPABASE_ANON_KEY as string;

if (SUPABASE_ANON_KEY === undefined) {
  console.log("Supabase key is undefined!");
  console.log("Env vars", process.env);
}

export const REVIEWS_TABLE = "reviews";

export const SUPABASE_PROJECT_URL = "https://edikpsrgwjfzjzhitgjo.supabase.co";

// Theming
const tintColorLight = "#832232";
const tintColorDark = "#CE8964";

export const Colors = {
  light: {
    text: "#000",
    background: "#fff",
    tint: tintColorLight,
    tabIconDefault: "#370031",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#fff",
    background: "#000",
    tint: tintColorDark,
    tabIconDefault: "#370031",
    tabIconSelected: tintColorDark,
  },
};
