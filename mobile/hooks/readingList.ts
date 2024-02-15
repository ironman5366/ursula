import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../utils/supabase.ts";
import { Book, ReadingListItem } from "@ursula/shared-types/derived.ts";
import { useSession } from "../contexts/SessionContext.ts";

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

export function useReadingList(userId: string) {
  return useQuery({
    queryFn: () => fetchReadingList(userId),
    queryKey: ["READING_LIST", userId],
  });
}

async function doAddToReadingList(userId: string, bookId: number) {
  console.log("adding to reading list", userId, bookId);
  const { data, error } = await supabase
    .from("reading_list_items")
    .upsert(
      {
        user_id: userId,
        book_id: bookId,
      },
      { onConflict: "user_id,book_id" }
    )
    .select();

  console.log("data", data, "error", error);
}

export function useAddToReadingList(bookId: number) {
  const { session } = useSession();
  const client = useQueryClient();

  return useMutation({
    mutationFn: (bookId: number) => doAddToReadingList(session.user.id, bookId),
    onSuccess: () =>
      client.invalidateQueries(["READING_LIST", session.user.id]),
  });
}

async function doRemoveFromReadingList(userId: string, bookId: number) {
  return supabase
    .from("reading_list_items")
    .delete()
    .eq("user_id", userId)
    .eq("book_id", bookId);
}

export function useRemoveFromReadingList(bookId: number) {
  const { session } = useSession();
  const client = useQueryClient();

  return useMutation({
    mutationFn: (bookId: number) =>
      doRemoveFromReadingList(session.user.id, bookId),
    onSuccess: () =>
      client.invalidateQueries(["READING_LIST", session.user.id]),
  });
}

export async function fetchBookInReadingList(
  userId: string,
  bookId: number
): Promise<boolean> {
  const { data } = await supabase
    .from("reading_list_items")
    .select("book_id")
    .eq("user_id", userId)
    .eq("book_id", bookId)
    .maybeSingle();

  return !!data;
}

export function useBookInReadingList(bookId: number) {
  const { session } = useSession();

  return useQuery({
    queryFn: () => fetchBookInReadingList(session.user.id, bookId),
    queryKey: ["BOOK_IN_READING_LIST", session.user.id, bookId],
  });
}
