import { supabase } from "../utils/supabase";
import { Book } from "../types/derived";
import { useQuery } from "@tanstack/react-query";
export function queryBook(id: number): Promise<Book> {
  return new Promise((resolve, reject) => {
    supabase
      .from("books")
      .select("*")
      .eq("id", id)
      .then((resp) => {
        if (resp.error) {
          reject(resp.error);
          return;
        }
        if (resp.data === null) {
          reject();
          return;
        }
        resolve(resp.data[0] as Book);
        return;
      });
  });
}

export default function useBook(id: number) {
  return useQuery({
    queryKey: ["BOOK", id],
    queryFn: () => queryBook(id),
  });
}
