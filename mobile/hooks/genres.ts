import { Genre } from "@ursula/shared-types/derived.ts";
import { supabase } from "../utils/supabase.ts";

async function fetchBookGenres(bookId: number): Promise<Genre> {
  const { data, error } = await supabase.from("genres");
}
