import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import useBook from "./useBook.ts";
import { Book } from "@ursula/shared-types/derived.ts";
import { supabase } from "../utils/supabase.ts";

function getPublicUrlForKey(key: string | null) {
  if (key) {
    const {
      data: { publicUrl },
    } = supabase.storage.from("book_thumbnails").getPublicUrl(key);
    return publicUrl;
  } else {
    return null;
  }
}

export interface BookCovers {
  small_url: string | null;
  medium_url: string | null;
  large_url: string | null;
}

async function loadBookCover(
  book: Book,
  queryClient: QueryClient
): Promise<BookCovers> {
  if (book.last_cover_update) {
    const small_url = getPublicUrlForKey(book.small_cover_key);
    const medium_url = getPublicUrlForKey(book.medium_cover_key);
    const large_url = getPublicUrlForKey(book.large_cover_key);
    return { small_url, medium_url, large_url };
  } else {
    const { data: newBook, error } = await supabase.functions.invoke(
      "load-book-cover",
      {
        method: "POST",
        body: JSON.stringify({ bookId: book.id }),
      }
    );

    if (error) {
      throw error;
    }

    // If this function is successful, it returns an updated book
    queryClient.setQueryData(["BOOK", book.id], newBook);
    return loadBookCover(newBook, queryClient);
  }
}

export function useBookCover(book: Book) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ["BOOK_COVER", book.id],
    queryFn: () => loadBookCover(book, queryClient),
  });
}
