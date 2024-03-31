import { supabase } from "../utils/supabase.ts";
import { useQuery } from "@tanstack/react-query";

async function fetchUsernameTaken(username: string): Promise<string | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .ilike("username", username)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? data.id : null;
}

export default function useUsernameTaken(username: string) {
  return useQuery({
    enabled: !!username,
    queryKey: ["USERNAME_TAKEN", username],
    queryFn: () => fetchUsernameTaken(username),
  });
}
