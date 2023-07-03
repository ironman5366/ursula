import Volume from "../types/Volume";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

const GOOGLE_API_URL = "https://www.googleapis.com/books/v1/volumes";

interface BookSearchResponse {
  kind: string;
  totalItems: number;
  items: Volume[];
}

function searchBooks(name: string): Promise<BookSearchResponse> {
  return new Promise((resolve, reject) => {
    fetch(`${GOOGLE_API_URL}/?q=${name}`)
      .then((resp) => {
        return resp
          .json()
          .then((data) => {
            resolve(data as BookSearchResponse);
          })
          .catch((err) => {
            reject(err);
          });
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export default function useSearchBooks(name: string, enabled: boolean) {
  const queryKey = useMemo(() => ["BOOK_SEARCH", name], [name]);
  return useQuery(queryKey, () => searchBooks(name), { enabled });
}
