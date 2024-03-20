import { useQuery } from "@tanstack/react-query";
import { Book } from "../../shared-types/derived";
import { supabase } from "../utils/supabase.ts";
import { SearchResult } from "../../shared-types/SearchResult.ts";

async function fetchSearchResults(query: string): Promise<SearchResult[]> {
  const { data, error } = await supabase
    .rpc("search_all", {
      search_text: query,
    })
    .limit(30);

  if (error) {
    throw error;
  }

  const includesOrderKey = data.some((result) => result.order_key > 0);

  // If we have some results with an order key > 0, we'll filter out the rest
  const filtered = includesOrderKey
    ? data.filter((result) => result.order_key > 0)
    : data;

  return filtered as SearchResult[];
}

export default function useSearch({
  query,
  enabled,
}: {
  query: string;
  enabled: boolean;
}) {
  return useQuery({
    queryKey: ["SEARCH", query],
    queryFn: () => fetchSearchResults(query),
    enabled,
  });
}
