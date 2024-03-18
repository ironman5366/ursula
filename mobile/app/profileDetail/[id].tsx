import React, { useId } from "react";
import ProfilePage from "../../pages/ProfilePage";
import { useProfile } from "../../hooks/profile.ts";
import LoadingScreen from "../../components/atoms/LoadingScreen.tsx";

export default function ProfileDetail() {
  const id = useId();
  const { data: profile } = useProfile(id);

  if (!profile) {
    return <LoadingScreen />;
  }

  return <ProfilePage profile={profile} />;
}
