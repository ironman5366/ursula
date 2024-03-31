import React, { Dispatch, SetStateAction } from "react";
import { useProfile } from "../../hooks/profile.ts";
import LoaderRow from "../../components/atoms/loaders/LoaderRow.tsx";
import Ionicons from "@expo/vector-icons/Ionicons";
import ProfilePreviewRow from "../../components/molecules/ProfilePreview/Row.tsx";
import { Text } from "tamagui";

interface FollowProfileItemProps {
  profileId: string;
  follows: string[];
  setFollows: Dispatch<SetStateAction<string[]>>;
}

export default function FollowProfileItem({
  profileId,
  follows,
  setFollows,
}: FollowProfileItemProps) {
  const { data: profile } = useProfile(profileId);
  const isFollowing = follows.includes(profileId);

  return (
    <LoaderRow
      icon={<Ionicons name={"person"} />}
      elem={profile}
      render={(it) => (
        <ProfilePreviewRow profile={it}>
          <Text>@{it.username}</Text>
          {it.bio && <Text>{it.bio}</Text>}
          <Ionicons
            name={isFollowing ? "checkmark" : "add"}
            onPress={() => {
              if (isFollowing) {
                setFollows(follows.filter((id) => id !== profileId));
              } else {
                setFollows([...follows, profileId]);
              }
            }}
          />
        </ProfilePreviewRow>
      )}
    />
  );
}
