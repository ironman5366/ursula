import { Genre } from "@ursula/shared-types/derived.ts";
import { supabase } from "../utils/supabase.ts";
import { useQuery } from "@tanstack/react-query";

async function fetchBookGenres(bookId: number): Promise<Genre[]> {
  const { data, error } = await supabase.rpc("get_book_genres", {
    q_book_id: bookId,
  });

  if (error) {
    throw error;
  }

  return data;
}

export function useBookGenres(bookId: number) {
  return useQuery({
    queryFn: () => fetchBookGenres(bookId),
    queryKey: ["BOOK_GENRES", bookId],
  });
}
