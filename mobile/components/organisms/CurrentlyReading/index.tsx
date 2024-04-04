import React from "react";
import { XStack } from "tamagui";
import { ScrollView } from "react-native";
import WhatAreYouReadingCard from "./WhatAreYouReadingCard.tsx";
import { useCurrentUserCurrentlyReading } from "../../../hooks/currentlyReading.ts";
import CurrentBookCard from "./CurrentBookCard.tsx";
import { StyledView } from "../StyledView.tsx";

export default function CurrentlyReading() {
  const { data: currentBooks } = useCurrentUserCurrentlyReading();

  return (
    <StyledView>
      <ScrollView horizontal>
        <XStack gap={"$3"} m={"$3"}>
          <WhatAreYouReadingCard />
          {currentBooks?.map((book) => (
            <CurrentBookCard key={book.id} book={book} />
          ))}
        </XStack>
      </ScrollView>
    </StyledView>
  );
}
