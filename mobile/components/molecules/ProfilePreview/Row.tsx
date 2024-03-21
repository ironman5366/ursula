import React, { ComponentProps, forwardRef } from "react";
import { Profile } from "@ursula/shared-types/derived.ts";
import { ListItem, Text } from "tamagui";
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
      icon={<ProfileImage profile={profile} size={30} />}
      justifyContent="flex-start"
    >
      <Text>@{profile.username}</Text>
    </ListItem>
  );
}

export default forwardRef(ProfilePreviewRow);
