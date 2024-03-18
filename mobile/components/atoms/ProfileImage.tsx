import React, { ComponentProps } from "react";
import { Profile } from "@ursula/shared-types/derived.ts";
import { useProfileImage } from "../../hooks/profile.ts";
import { ActivityIndicator, Image, ImageStyle, StyleProp } from "react-native";

interface Props {
  profile: Profile;
  width?: number;
  height?: number;
}

export default function ProfileImage({ profile, width, height }: Props) {
  const { data: imageURL, isLoading } = useProfileImage(profile);
  if (isLoading) {
    return <ActivityIndicator size={"small"} />;
  } else {
    return (
      <Image
        style={[
          {
            width: width || 150,
            height: height || 150,
            borderRadius: 50,
          },
        ]}
        source={
          imageURL
            ? { uri: imageURL }
            : require("../../assets/images/profile-placeholder.png")
        }
      />
    );
  }
}
