import { Profile } from "@ursula/shared-types/derived.ts";
import React from "react";
import { SafeAreaView } from "react-native";
import { YStack, Text, Button } from "tamagui";
import LoadingScreen from "../../../components/atoms/loaders/LoadingScreen.tsx";
import ProfileImage from "../../../components/atoms/profile/ProfileImage.tsx";
import { useSession } from "../../../contexts/SessionContext.ts";
import FollowersSection from "../Edit/FollowersSection.tsx";
import { Pencil } from "@tamagui/lucide-icons";
import { Link, router } from "expo-router";
import ProfileTabs from "./Tabs.tsx";
import { StyledText } from "../../../components/atoms/StyledText.tsx";
import { StyledView } from "../../../components/organisms/StyledView.tsx";

interface Props {
  profile: Profile;
}

export default function ViewProfile({ profile }: Props) {
  const { session } = useSession();

  if (!profile) {
    return <LoadingScreen />;
  }

  const isOwnProfile = session?.user.id === profile.id;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <YStack py="$6" px="$3" style={{ flex: 1 }}>
        <YStack gap="$3" alignItems="center" width="100%">
          <YStack my="$5" alignItems="center">
            <ProfileImage profile={profile} size={100} />
            <Text mt="$3" fontSize="$8" fontWeight="bold">
              {profile.full_name}
            </Text>
            <Text
              fontSize="$4"
              color="gray"
              fontWeight="bold"
              numberOfLines={1}
              maxWidth={300}
            >
              @{profile.username}
            </Text>
            {isOwnProfile && (
              <Button
                size="$3"
                mt="$5"
                backgroundColor="black"
                color="white"
                borderRadius="$8"
                icon={Pencil}
                onPress={() => {
                  console.log("Edit profile");
                  router.push("/profile/edit");
                }}
              >
                {isOwnProfile ? "Edit Profile" : "Follow"}
              </Button>
            )}
          </YStack>
          <FollowersSection profile={profile} />
          {isOwnProfile && (
            <Link href={"/(onboard)/follows"} asChild>
              <Button>Find People to Follow</Button>
            </Link>
          )}
        </YStack>
        <ProfileTabs profile={profile} />
      </YStack>
    </SafeAreaView>
  );
}
