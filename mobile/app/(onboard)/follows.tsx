import React, { Dispatch, SetStateAction, useState } from "react";
import { Button, SizableText, Text, YStack } from "tamagui";
import SearchPage from "../../pages/Search";
import { WILLS_USER_ID } from "../../constants.ts";
import { useProfile } from "../../hooks/profile.ts";
import Ionicons from "@expo/vector-icons/Ionicons";
import LoaderRow from "../../components/atoms/LoaderRow.tsx";
import ProfilePreviewRow from "../../components/molecules/ProfilePreview/Row.tsx";
import { FloatingActionBar } from "../../components/containers/TabBar.tsx";
import { Link } from "expo-router";
import { MoveRight } from "@tamagui/lucide-icons";

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
      <FloatingActionBar>
        <Link href="/" asChild>
          <Button
            width={300}
            unstyled
            alignSelf="center"
            height={50}
            px={10}
            fontWeight="bold"
            color="white"
            href="/(onboard)/signup"
            flexDirection="row"
            alignItems="center"
            alignContent="space-between"
            justifyContent="space-between"
            iconAfter={<MoveRight size="$1" />}
          >
            Get Started
          </Button>
        </Link>
      </FloatingActionBar>
    </YStack>
  );
}
