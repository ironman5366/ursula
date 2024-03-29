import React, {
  ComponentProps,
  forwardRef,
  ReactElement,
  ReactNode,
} from "react";
import { Profile } from "@ursula/shared-types/derived.ts";
import { ListItem, Text } from "tamagui";
import ProfileImage from "../../atoms/profile/ProfileImage.tsx";

interface Props {
  profile: Profile;
  onPress?: ComponentProps<typeof ListItem>["onPress"];
  children?: ReactNode;
}

function ProfilePreviewRow({ profile, onPress, children }: Props, ref) {
  return (
    <ListItem
      ref={ref}
      onPress={onPress}
      icon={<ProfileImage profile={profile} size={30} />}
      justifyContent="flex-start"
    >
      {children}
    </ListItem>
  );
}

export default forwardRef(ProfilePreviewRow);
