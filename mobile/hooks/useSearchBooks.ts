import { useQuery } from "@tanstack/react-query";
import { FUNCTIONS_API_URL } from "../constants";
import { Book } from "../../shared-types/derived";

function fetchSearchBooks({ name }: { name: string }): Promise<Book[]> {
  return new Promise((resolve, reject) => {
    fetch(`${FUNCTIONS_API_URL}/functions/v1/book-search/?q=${name}`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
    })
      .then((resp) => {
        resp
          .json()
          .then((data: { books: Book[] }) => {
            resolve(data.books);
          })
          .catch((err) => reject(err));
      })
      .catch((err) => reject(err));
  });
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
