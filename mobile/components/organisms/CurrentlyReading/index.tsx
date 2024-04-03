import React from "react";
import { XStack } from "tamagui";
import { ScrollView } from "react-native";
import WhatAreYouReadingCard from "./WhatAreYouReadingCard.tsx";

export default function CurrentlyReading() {
  return (
    <ScrollView horizontal>
      <XStack gap={"$3"}>
        <WhatAreYouReadingCard />
      </XStack>
    </ScrollView>
  );
}
