import { Activity } from "@ursula/shared-types/derived.ts";
import { ActivityData, ActivityType } from "@ursula/shared-types/Activity.ts";
import { supabase } from "../utils/supabase.ts";
import { useQuery } from "@tanstack/react-query";

async function recordActivity(
  userId: string,
  data: ActivityData
): Promise<Activity> {
  const { data: activity, error } = await supabase
    .from("activites")
    .insert({
      user_id: userId,
      ...data,
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return activity;
}

async function fetchUserActivities(userId: string): Promise<Activity[]> {
  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .eq("user_id", userId);

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

async function fetchFollowerActivities(userId: string): Promise<Activity[]> {}
