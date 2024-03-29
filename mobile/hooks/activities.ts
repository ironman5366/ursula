import { Activity } from "@ursula/shared-types/derived.ts";
import { ActivityData } from "@ursula/shared-types/Activity.ts";
import { supabase } from "../utils/supabase.ts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "../contexts/SessionContext.ts";

async function recordActivity(
  userId: string,
  data: ActivityData
): Promise<Activity> {
  console.log("recording activity", userId, data);
  const { data: activity, error } = await supabase
    .from("activities")
    .insert({
      user_id: userId,
      ...data,
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return activity as Activity;
}

export function useRecordActivity() {
  const { session } = useSession();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ActivityData) => recordActivity(session?.user.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["ACTIVITIES", session?.user.id]);
    },
  });
}

async function fetchUserActivities(userId: string): Promise<Activity[]> {
  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  // We have to cast here to narrow to our activity data enum
  return data as Activity[];
}

export function useActivities(userId: string) {
  return useQuery({
    queryKey: ["ACTIVITIES", userId],
    queryFn: () => fetchUserActivities(userId),
  });
}

async function fetchSocialFeed(userId: string): Promise<Activity[]> {
  const { data, error } = await supabase
    .rpc("social_feed", {
      for_user_id: userId,
    })
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    throw error;
  }

  return data as Activity[];
}

export function useSocialFeed() {
  const { session } = useSession();
  return useQuery({
    queryFn: () => fetchSocialFeed(session.user.id),
    queryKey: ["SOCIAL_FEED"],
    enabled: !!session?.user.id,
  });
}
