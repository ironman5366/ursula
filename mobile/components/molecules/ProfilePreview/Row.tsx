import React, { forwardRef } from "react";
import { Profile } from "@ursula/shared-types/derived.ts";
import { ListItem } from "tamagui";
import ProfileImage from "../../atoms/ProfileImage.tsx";

interface Props {
  profile: Profile;
}

function ProfilePreviewRow({ profile }: Props, ref) {
  return (
    <ListItem ref={ref} icon={<ProfileImage profile={profile} />}>
      @{profile.username}
    </ListItem>
  );
}

export default forwardRef(ProfilePreviewRow);
