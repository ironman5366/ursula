import { supabase } from "../utils/supabase";
import { Book } from "../../shared-types/derived";
import { useQuery } from "@tanstack/react-query";

export async function fetchBook(id: number): Promise<Book> {
  const { data, error } = await supabase
    .from("books")
    .select()
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export default function useBook(id: number) {
  return useQuery({
    queryKey: ["BOOK", id],
    queryFn: () => fetchBook(id),
  });
}
