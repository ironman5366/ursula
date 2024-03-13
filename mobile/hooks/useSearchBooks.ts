import { useQuery } from "@tanstack/react-query";
import { Book } from "../../shared-types/derived";
import { supabase } from "../utils/supabase.ts";

async function fetchSearchBooks({ name }: { name: string }): Promise<Book[]> {
  console.log("SEarching", name);
  const { data, error } = await supabase.rpc("search_book_titles", {
    search_text: name,
  });

  if (error) {
    throw error;
  }
  console.log("Got results", data);

  return data.map((d: { book: Book; rank: number }) => d.book);
}

export default function useSearchBooks({
  name,
  enabled,
}: {
  name: string;
  enabled: boolean;
}) {
  return useQuery({
    queryKey: ["SEARCH_BOOKS", name],
    queryFn: () => fetchSearchBooks({ name }),
    enabled,
  });
}
