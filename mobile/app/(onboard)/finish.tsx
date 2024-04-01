import { useEffect } from "react";
import { useCurrentProfile, useUpdateProfile } from "../../hooks/profile.ts";
import LoadingScreen from "../../components/atoms/loaders/LoadingScreen.tsx";
import { router } from "expo-router";

export default function FinishOnboarding() {
  // This should always be the last onboarding screen, we can put any cleanup here
  const { data: profile } = useCurrentProfile();
  const { mutate: updateProfile, isSuccess } = useUpdateProfile();

  const finish = () => router.replace("/(app)/(tabs)");

  useEffect(() => {
    if (profile) {
      if (profile.has_onboarded) {
        finish();
      } else {
        updateProfile({
          has_onboarded: true,
        });
      }
    }
  }, [profile]);

  useEffect(() => {
    if (isSuccess) {
      finish();
    }
  }, [isSuccess]);

  return <LoadingScreen />;
}
