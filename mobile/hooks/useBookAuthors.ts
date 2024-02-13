import { supabase } from "../utils/supabase";
import { Author, Book } from "../../shared-types/derived";
import { useQuery } from "@tanstack/react-query";

async function queryBookAuthors({ book }: { book: Book }): Promise<Author[]> {
  const { data, error } = await supabase
    .from("book_authors")
    .select("authors(*)")
    .eq("book_id", book.id);

  if (error) {
    throw error;
  }

  return data.map((d: any) => d.authors);
}

export default function useBookAuthors({ book }: { book: Book | undefined }) {
  return useQuery({
    queryKey: ["BOOK_AUTHORS", book?.id],
    queryFn: () => book && queryBookAuthors({ book }),
    enabled: !!book,
  });
}
