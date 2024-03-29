import React from "react";
import { Profile } from "@ursula/shared-types/derived.ts";
import { FlatList } from "react-native";
import ProfilePreviewLink from "../molecules/ProfilePreview/Link.tsx";

interface Props {
  profiles: Profile[];
}

export default function ProfilesList({ profiles }: Props) {
  return (
    <FlatList
      data={profiles}
      renderItem={({ item: profile }) => (
        <ProfilePreviewLink profile={profile} />
      )}
      scrollEnabled={true}
    />
  );
}
