import { Profile } from "@ursula/shared-types/derived.ts";
import { supabase } from "../utils/supabase.ts";
import { useQuery } from "@tanstack/react-query";

async function fetchRecentlyJoined(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

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
