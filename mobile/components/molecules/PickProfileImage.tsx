import React from "react";
import { Profile } from "@ursula/shared-types/derived.ts";
import { useSession } from "../../contexts/SessionContext.ts";
import usePickProfileImage from "../../hooks/profileImage.ts";
import { TouchableOpacity } from "react-native";
import ProfileImage from "../atoms/profile/ProfileImage.tsx";
import { YStack } from "tamagui";

interface Props {
  profile: Profile;
}

export default function PickProfileImage({ profile }: Props) {
  const { session } = useSession();
  const isOwnProfile = session.user.id === profile.id;
  const pick = usePickProfileImage();

  return (
    <YStack my="$5">
      <TouchableOpacity
        disabled={!isOwnProfile}
        onPress={() => {
          if (isOwnProfile) {
            pick();
          }
        }}
      >
        <ProfileImage profile={profile} size={100} />
      </TouchableOpacity>
    </YStack>
  );
}
