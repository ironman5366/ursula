import React from "react";
import SearchContainer from "../../components/containers/SearchContainer";
import { useSocialFeed } from "../../hooks/activities.ts";
import ActivityFeed from "../../components/organisms/ActivityFeed";
import SetupGuard from "./SetupGuard.tsx";
import CurrentlyReading from "../../components/organisms/CurrentlyReading";
import { YStack } from "tamagui";

export default function HomePage() {
  const { data: socialFeed } = useSocialFeed();

  return (
    <SearchContainer editable={false}>
      {
        // This will pop up a sheet if the user hasn't completed their account
      }
      <SetupGuard />
      <YStack gap={"$3"}>
        <CurrentlyReading />
        <ActivityFeed activities={socialFeed} />
      </YStack>
    </SearchContainer>
  );
}
