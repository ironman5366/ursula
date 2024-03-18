import { supabase } from "../utils/supabase";
import { Author } from "../../shared-types/derived";
import { useQuery } from "@tanstack/react-query";

async function fetchBookAuthors(bookId: number): Promise<Author[]> {
  const { data, error } = await supabase
    .from("book_authors")
    .select("authors(*)")
    .eq("book_id", bookId);

  if (error) {
    throw error;
  }

  return data.map((d: any) => d.authors);
}

export function useBookAuthors(bookId: number | undefined | null) {
  return useQuery({
    queryKey: ["BOOK_AUTHORS", bookId],
    queryFn: () => fetchBookAuthors(bookId),
    enabled: typeof bookId === "number",
  });
}
