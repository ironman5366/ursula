import { useQuery } from "@tanstack/react-query";
import { supabase } from "../utils/supabase.ts";
import { Book, ReadingListItem } from "@ursula/shared-types/derived.ts";

export type ReadingListItemWithBook = {
  book: Book;
  readingListItem: ReadingListItem;
};

async function fetchReadingList(
  userId: string
): Promise<ReadingListItemWithBook[]> {
  const { data, error } = await supabase
    .from("reading_list_items")
    .select("*, books(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data.map(({ books, ...item }) => ({
    book: books,
    readingListItem: item,
  }));
}

export default function useReadingList(userId: string) {
  return useQuery({
    queryFn: () => fetchReadingList(userId),
    queryKey: ["READING_LIST", userId],
  });
}
