import { supabase } from "../utils/supabase.ts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "../contexts/SessionContext.ts";
import { Profile } from "@ursula/shared-types/derived.ts";
import { ProfileWithFollowTime } from "../types/ProfileWithFollowTime.ts";
import { PostgrestError } from "@supabase/supabase-js";
import { useRecordActivity } from "./activities.ts";
import { ActivityType } from "@ursula/shared-types/Activity.ts";

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
  const { mutateAsync: recordActivity } = useRecordActivity();

  return useMutation({
    mutationFn: async (profile: Profile) => {
      await Promise.all([
        followUser(session.user.id, profile.id),
        recordActivity({
          type: ActivityType.FOLLOWED,
          data: {
            user_id: profile.id,
            full_name: profile.full_name,
            username: profile.username,
          },
        }),
      ]);
    },
    onSuccess: (_data, profile) => {
      queryClient.setQueryData(
        ["FOLLOWING", session.user.id, profile.id],
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

async function fetchFollowRelation(
  profileId: string,
  fetchCol: "followee_id" | "follower_id",
  eqCol: "followee_id" | "follower_id"
): Promise<ProfileWithFollowTime[]> {
  // We have to type this response because the supabase type integration
  // isn't smart enough to track the join
  const { data, error } = (await supabase
    .from("follows")
    .select(`created_at,profiles:${fetchCol}(*)`)
    .eq(eqCol, profileId)
    .order("created_at", { ascending: false })) as {
    data: { created_at: string; profiles: Profile }[];
    error?: PostgrestError;
  };

  if (error) {
    throw error;
  }

  return data.map(({ created_at, profiles: profile }) => ({
    created_at,
    ...profile,
  }));
}

async function fetchFollowing(
  profileId: string
): Promise<ProfileWithFollowTime[]> {
  // We're finding people this profile is following, so rows where
  // follower_id=profileId
  return fetchFollowRelation(profileId, "followee_id", "follower_id");
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
  // We're finding people who follow profileId, so rows where followee_id=profileId
  return fetchFollowRelation(profileId, "follower_id", "followee_id");
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
    mutationFn: (profile: Profile) => unfollow(session.user.id, profile.id),
    onSuccess: (_data, profile: Profile) => {
      queryClient.invalidateQueries(["FOLLOWING", session.user.id]);
      queryClient.setQueryData(
        ["FOLLOWING", session.user.id, profile.id],
        false
      );
    },
  });
}
