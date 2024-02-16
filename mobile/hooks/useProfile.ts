import { Profile } from "@ursula/shared-types/derived.ts";
import { supabase } from "../utils/supabase.ts";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "../contexts/SessionContext.ts";

async function fetchProfile(userId: string): Promise<Profile> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export default function useProfile(userId: string) {
  return useQuery({
    queryFn: () => fetchProfile(userId),
    queryKey: ["PROFILE"],
  });
}

export function useCurrentProfile() {
  const { session } = useSession();
  return useProfile(session.user.id);
}
