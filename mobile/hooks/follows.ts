import { supabase } from "../utils/supabase.ts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "../contexts/SessionContext.ts";
import { Profile } from "@ursula/shared-types/derived.ts";
import { ProfileWithFollowTime } from "../types/ProfileWithFollowTime.ts";

async function followUser(profile_id: string, followee_id: string) {
  const { error } = await supabase.from("follows").upsert(
    {
      follower_id: profile_id,
      followee_id,
    },
    { onConflict: "follower_id, followee_id" }
  );

  if (error) {
    throw error;
  }
}

export function useFollow() {
  const queryClient = useQueryClient();
  const { session } = useSession();

  return useMutation({
    mutationFn: (followee_id: string) =>
      followUser(session.user.id, followee_id),
    onSuccess: (_data, followee_id) => {
      queryClient.setQueryData(
        ["FOLLOWING", session.user.id, followee_id],
        true
      );
      queryClient.invalidateQueries(["SOCIAL_FEED"]);
    },
  });
}

async function bulkFollowUsers(profile_id: string, followee_ids: string[]) {
  const { error } = await supabase.from("follows").upsert(
    followee_ids.map((followee_id) => ({
      follower_id: profile_id,
      followee_id,
    })),
    { onConflict: "follower_id, followee_id" }
  );

  if (error) {
    throw error;
  }
}

export function useBulkFollow() {
  const queryClient = useQueryClient();
  const { session } = useSession();

  return useMutation({
    mutationFn: (followee_ids: string[]) =>
      bulkFollowUsers(session.user.id, followee_ids),
    onSuccess: (_data, followee_ids) => {
      followee_ids.forEach((followee_id) => {
        queryClient.setQueryData(
          ["FOLLOWING", session.user.id, followee_id],
          true
        );
        queryClient.invalidateQueries(["SOCIAL_FEED"]);
      });
    },
  });
}

async function fetchFollowing(profileId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("follows")
    .select("followee_id")
    .eq("follower_id", profileId);

  if (error) {
    throw error;
  }

  return data.map((f) => f.followee_id);
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

async function fetchFollowers(
  profileId: string
): Promise<ProfileWithFollowTime[]> {
  const { data, error } = await supabase
    .from("follows")
    .select("created_at,profiles:follower_id(*)")
    .eq("followee_id", profileId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  console.log("follow data is ", data);

  return data.map(({ created_at, profiles: profile }) => ({
    created_at,
    ...profile,
  }));
}

export function useFollowers(profileId: string) {
  return useQuery({
    queryKey: ["FOLLOWERS", profileId],
    queryFn: () => fetchFollowers(profileId),
  });
}

interface IsFollowingProps {
  follower_id: string;
  followee_id: string;
}

async function fetchIsFollowing({
  follower_id,
  followee_id,
}: IsFollowingProps) {
  const { data, error } = await supabase
    .from("follows")
    .select()
    .eq("follower_id", follower_id)
    .eq("followee_id", followee_id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return !!data;
}

export function useIsFollowing(props: IsFollowingProps) {
  return useQuery({
    queryFn: () => fetchIsFollowing(props),
    queryKey: ["FOLLOWING", props.follower_id, props.followee_id],
  });
}

async function unfollow(user_id: string, followee_id: string) {
  const { error } = await supabase
    .from("follows")
    .delete()
    .eq("follower_id", user_id)
    .eq("followee_id", followee_id);

  if (error) {
    throw error;
  }
}

export function useUnfollow() {
  const { session } = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (followee_id: string) => unfollow(session.user.id, followee_id),
    onSuccess: (_data, followee_id: string) => {
      queryClient.invalidateQueries(["FOLLOWING", session.user.id]);
      queryClient.setQueryData(
        ["FOLLOWING", session.user.id, followee_id],
        false
      );
    },
  });
}
