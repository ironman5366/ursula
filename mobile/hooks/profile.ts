import { Profile } from "@ursula/shared-types/derived.ts";
import { supabase } from "../utils/supabase.ts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

export function useProfile(userId: string) {
  return useQuery({
    queryFn: () => fetchProfile(userId),
    queryKey: ["PROFILE", userId],
  });
}

export function useCurrentProfile() {
  const { session } = useSession();
  return useProfile(session.user.id);
}

export async function updateProfile(
  profileId: string,
  profile: Partial<Profile>
) {
  const { data, error } = await supabase
    .from("profiles")
    .update(profile)
    .eq("id", profileId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  // The user can only update their current profile, so we don't need to pass in a profileId
  const { session } = useSession();
  return useMutation({
    onMutate: (profile: Partial<Profile>) => {
      // Optimistic update
      queryClient.setQueryData(
        ["PROFILE", session.user.id],
        (oldProfile: Profile) => ({
          ...oldProfile,
          ...profile,
        })
      );
    },
    mutationFn: (profile: Partial<Profile>) =>
      updateProfile(session.user.id, profile),
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(["PROFILE", session.user.id], updatedProfile);
    },
  });
}
