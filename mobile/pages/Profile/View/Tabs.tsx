import React from "react";
import { Profile } from "@ursula/shared-types/derived.ts";
import { View, XStack, YStack } from "tamagui";
import FavoriteBooks from "../../../components/organisms/FavoriteBooks.tsx";
import UserActivities from "../../../components/molecules/UserActivities.tsx";
import Tabs from "../../../components/organisms/Tabs.tsx";
import { StyledView } from "../../../components/organisms/StyledView.tsx";

interface Props {
  profile: Profile;
}

export default function ProfileTabs({ profile }: Props) {
  return (
    <YStack style={{ flex: 1 }}>
      <Tabs initial={"favoriteBooks"}>
        <XStack justifyContent="space-between">
          <Tabs.Button name={"favoriteBooks"}>Favorite Books</Tabs.Button>
          <Tabs.Button name={"recentActivity"}>Recent Activity</Tabs.Button>
        </XStack>
        <Tabs.Content name={"favoriteBooks"}>
          <FavoriteBooks profile={profile} />
        </Tabs.Content>
        <Tabs.Content name={"recentActivity"}>
          <UserActivities profile={profile} />
        </Tabs.Content>
      </Tabs>
    </YStack>
  );
}
