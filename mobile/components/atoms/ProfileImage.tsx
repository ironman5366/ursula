import React from "react";
import { Profile } from "@ursula/shared-types/derived.ts";
import { useProfileImage } from "../../hooks/profile.ts";
import { ActivityIndicator, Image } from "react-native";

interface Props {
  profile: Profile;
}

export default function ProfileImage({ profile }: Props) {
  const { data: imageURL, isLoading } = useProfileImage(profile);
  if (isLoading) {
    return <ActivityIndicator size={"small"} />;
  } else {
    return (
      <Image
        style={{
          width: 150,
          height: 150,
          borderRadius: 50,
        }}
        source={
          imageURL
            ? { uri: imageURL }
            : require("../../assets/images/profile-placeholder.png")
        }
      />
    );
  }
}
