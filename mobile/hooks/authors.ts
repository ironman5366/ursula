import { supabase } from "../utils/supabase";
import { Author, Book } from "../../shared-types/derived";
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

async function fetchAuthor(authorId: number): Promise<Author> {
  const { data, error } = await supabase
    .from("authors")
    .select("*")
    .eq("id", authorId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export function useAuthor(authorId: number) {
  return useQuery({
    queryKey: ["AUTHOR", authorId],
    queryFn: () => fetchAuthor(authorId),
  });
}

async function fetchAuthorBooks(authorId: number): Promise<Book[]> {
  const { data, error } = await supabase
    .from("book_authors")
    .select("*, books(*)")
    .eq("author_id", authorId);

  if (error) {
    throw error;
  }

  return data.map((d) => d.books);
}

export function useAuthorBooks(authorId: number) {
  return useQuery({
    queryFn: () => fetchAuthorBooks(authorId),
    queryKey: ["AUTHOR_BOOKS", authorId],
  });
}
