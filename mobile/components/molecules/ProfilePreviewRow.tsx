import React from "react";
import { Profile } from "@ursula/shared-types/derived.ts";
import { ListItem } from "tamagui";
import ProfileImage from "../atoms/ProfileImage.tsx";

interface Props {
  profile: Profile;
}

export default function ProfilePreviewRow({ profile }: Props) {
  return (
    <ListItem icon={<ProfileImage profile={profile} />}>
      @{profile.username}
    </ListItem>
  );
}
