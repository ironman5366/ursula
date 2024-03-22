import React, { Dispatch, SetStateAction, useState } from "react";
import { SizableText, Text, YStack } from "tamagui";
import SearchPage from "../../pages/Search";
import { WILLS_USER_ID } from "../../constants.ts";
import { useProfile } from "../../hooks/profile.ts";
import Ionicons from "@expo/vector-icons/Ionicons";
import LoaderRow from "../../components/atoms/LoaderRow.tsx";
import ProfilePreviewRow from "../../components/molecules/ProfilePreview/Row.tsx";

interface FollowProfileItemProps {
  profileId: string;
  followers: string[];
  setFollowers: Dispatch<SetStateAction<string[]>>;
}

export function FollowProfileItem({
  profileId,
  followers,
  setFollowers,
}: FollowProfileItemProps) {
  const { data: profile } = useProfile(profileId);
  const isFollowing = followers.includes(profileId);

  return (
    <LoaderRow
      icon={<Ionicons name={"person"} />}
      elem={profile}
      render={(it) => (
        <ProfilePreviewRow profile={it}>
          <Text>@{it.username}</Text>
          <Ionicons
            name={isFollowing ? "checkmark" : "add"}
            onPress={() => {
              if (isFollowing) {
                setFollowers(followers.filter((id) => id !== profileId));
              } else {
                setFollowers([...followers, profileId]);
              }
            }}
          />
        </ProfilePreviewRow>
      )}
    />
  );
}

export function FindFollowers() {
  const [follows, setFollows] = useState<string[]>([WILLS_USER_ID]);
  return (
    <YStack>
      <SizableText>Find people to follow</SizableText>
      <SearchPage
        allowedTypes={["profiles"]}
        renderSearchItem={(it) => {
          return (
            <FollowProfileItem
              profileId={it.entity_id_uuid}
              followers={follows}
              setFollowers={setFollows}
            />
          );
        }}
      />
    </YStack>
  );
}
