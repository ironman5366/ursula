import { useQuery } from "@tanstack/react-query";
import { FUNCTIONS_API_URL, SUPABASE_ANON_KEY } from "../constants";
import { Book } from "../../shared-types/derived";

function fetchSearchBooks({ name }: { name: string }): Promise<Book[]> {
  return new Promise((resolve, reject) => {
    fetch(`${FUNCTIONS_API_URL}/functions/v1/book-search/`, {
      headers: {
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ name }),
    })
      .then((resp) => {
        console.log("Resp data is ", resp.status, resp.body);
        resp
          .json()
          .then((data) => {
            resolve(data);
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
