import React from "react";
import { useStringIdParam } from "../../../hooks/useIdParam.ts";
import { useFollowers } from "../../../hooks/follows.ts";
import LoadingScreen from "../../../components/atoms/loaders/LoadingScreen.tsx";
import ProfilesList from "../../../components/molecules/ProfilesList.tsx";

export default function Followers() {
  const id = useStringIdParam();
  const { data: followers, isLoading } = useFollowers(id);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return <ProfilesList profiles={followers} />;
}
