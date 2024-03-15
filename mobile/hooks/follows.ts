import { supabase } from "../utils/supabase.ts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "../contexts/SessionContext.ts";

async function followUser(profileId: string) {
  const { error } = await supabase.from("follows").upsert(
    {
      follower_id: profileId,
      followee_id: profileId,
    },
    { onConflict: "follower_id, followee_id" }
  );

  if (error) {
    throw error;
  }
}

export function useFollow() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: followUser,
    onSuccess: (_data, profileId) => {
      queryClient.invalidateQueries(["FOLLOWING", profileId]);
    },
  });
}

async function fetchFollowing(profileId: string) {
  const { data, error } = await supabase
    .from("follows")
    .select("followee_id")
    .eq("follower_id", profileId);

  if (error) {
    throw error;
  }

  return data;
}

export function useFollowing(profileId: string) {
  return useQuery({
    queryKey: ["FOLLOWING", profileId],
    queryFn: () => fetchFollowing(profileId),
  });
}

export function useCurrentUserFollowing() {
  const { session } = useSession();
  return useFollowing(session.user.id);
}

async function fetchFollowers(profileId: string) {
  const { data, error } = await supabase
    .from("follows")
    .select("follower_id")
    .eq("followee_id", profileId);

  if (error) {
    throw error;
  }

  return data;
}

export function useFollowers(profileId: string) {
  return useQuery({
    queryKey: ["FOLLOWERS", profileId],
    queryFn: () => fetchFollowers(profileId),
  });
}
