import { useQuery } from "@tanstack/react-query";
import { SUPABASE_PROJECT_URL } from "../constants";
import { Book } from "../../shared-types/derived";

function fetchSearchBooks({ name }: { name: string }): Promise<Book[]> {}

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
