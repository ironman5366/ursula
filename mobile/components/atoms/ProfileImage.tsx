import React, { ComponentProps } from "react";
import { Profile } from "@ursula/shared-types/derived.ts";
import { useProfileImage } from "../../hooks/profile.ts";
import { ActivityIndicator, Image, ImageStyle, StyleProp } from "react-native";
import { Avatar, Circle, SizeTokens } from "tamagui";

interface Props {
  profile?: Profile;
  size?: number | SizeTokens;
}

export default function ProfileImage({ profile, size }: Props) {
  const { data: imageURL, isLoading } = useProfileImage(profile);
  if (isLoading) {
    return <ActivityIndicator size={"small"} />;
  } else {
    return (
      <Avatar circular size={size}>
        <Avatar.Image src={imageURL} />
        <Avatar.Fallback bc="red" />
      </Avatar>
    );
  }
}
