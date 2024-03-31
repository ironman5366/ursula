import { supabase } from "../utils/supabase.ts";
import { useQuery } from "@tanstack/react-query";

async function fetchRecentlyJoined(): Promise<{ id: string }[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    throw error;
  }

  return data;
}

export default function useRecentlyJoined() {
  return useQuery({
    queryFn: fetchRecentlyJoined,
    queryKey: ["RECENTLY_JOINED"],
  });
}
