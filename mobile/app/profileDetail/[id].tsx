import React from "react";
import ProfilePage from "../../pages/ProfilePage";
import { useProfile } from "../../hooks/profile.ts";
import LoadingScreen from "../../components/atoms/LoadingScreen.tsx";
import { useStringIdParam } from "../../hooks/useIdParam.ts";

export default function ProfileDetail() {
  const id = useStringIdParam();
  const { data: profile } = useProfile(id);

  if (!profile) {
    return <LoadingScreen />;
  }

  return <ProfilePage profile={profile} />;
}
