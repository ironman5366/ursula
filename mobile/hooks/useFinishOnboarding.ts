import { useRecordActivity } from "./activities.ts";
import { useUpdateProfile } from "./profile.ts";
import { useMutation } from "@tanstack/react-query";
import { Profile } from "@ursula/shared-types/derived.ts";
import { ActivityType } from "@ursula/shared-types/Activity.ts";

export default function useFinishOnboarding() {
  const { mutate: updateProfile } = useUpdateProfile();
  const { mutateAsync: recordActivity } = useRecordActivity();

  return useMutation({
    mutationFn: async (profile: Profile) => {
      await Promise.all([
        recordActivity({
          type: ActivityType.JOINED,
          data: {
            user_id: profile.id,
            full_name: profile.full_name,
            username: profile.username,
          },
        }),
        updateProfile({
          has_onboarded: true,
        }),
      ]);
    },
  });
}
