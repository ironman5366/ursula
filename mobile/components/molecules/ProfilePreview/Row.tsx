import React, { ComponentProps, forwardRef } from "react";
import { Profile } from "@ursula/shared-types/derived.ts";
import { ListItem } from "tamagui";
import ProfileImage from "../../atoms/ProfileImage.tsx";

interface Props {
  profile: Profile;
  onPress?: ComponentProps<typeof ListItem>["onPress"];
}

function ProfilePreviewRow({ profile, onPress }: Props, ref) {
  return (
    <ListItem
      ref={ref}
      onPress={onPress}
      icon={<ProfileImage profile={profile} width={30} height={30} />}
    >
      @{profile.username}
    </ListItem>
  );
}

export default forwardRef(ProfilePreviewRow);
