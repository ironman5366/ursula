import { supabase } from "../utils/supabase";
import { Author, Book } from "../../shared-types/derived";
import { useQuery } from "@tanstack/react-query";

export function queryBookAuthors({ book }: { book: Book }): Promise<Author> {
  return new Promise((resolve, reject) => {
    supabase
      .from("authors")
      .select("*")
      .eq("id", book.author_id)
      .then((resp) => {
        if (resp.error) {
          reject(resp.error);
          return;
        }
        if (resp.data === null) {
          reject();
          return;
        }
        resolve(resp.data[0] as Author);
      });
  });
}

export default function useBookAuthors({ book }: { book: Book | undefined }) {
  return useQuery({
    queryKey: ["BOOK_AUTHORS", book?.id],
    queryFn: () => book && queryBookAuthors({ book }),
    enabled: !!book,
  });
}
