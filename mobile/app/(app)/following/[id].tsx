import React from "react";
import { useStringIdParam } from "../../../hooks/useIdParam.ts";
import { useFollowing } from "../../../hooks/follows.ts";
import LoadingScreen from "../../../components/atoms/loaders/LoadingScreen.tsx";
import ProfilesList from "../../../components/molecules/ProfilesList.tsx";

export default function Following() {
  const id = useStringIdParam();
  const { data: followers, isLoading } = useFollowing(id);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return <ProfilesList profiles={followers} />;
}
