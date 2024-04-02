import { useEffect } from "react";
import { useCurrentProfile } from "../../hooks/profile.ts";
import LoadingScreen from "../../components/atoms/loaders/LoadingScreen.tsx";
import { router } from "expo-router";
import useFinishOnboarding from "../../hooks/useFinishOnboarding.ts";

export default function FinishOnboarding() {
  // This should always be the last onboarding screen, we can put any cleanup here
  const { data: profile } = useCurrentProfile();
  const { mutate: setFinished, isSuccess } = useFinishOnboarding();

  const finish = () => router.replace("/(app)/(tabs)");

  useEffect(() => {
    if (profile) {
      if (profile.has_onboarded) {
        finish();
      } else {
        setFinished(profile);
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
