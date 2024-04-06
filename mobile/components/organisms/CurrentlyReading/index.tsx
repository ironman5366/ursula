import React from "react";
import { XStack } from "tamagui";
import { ScrollView } from "react-native";
import WhatAreYouReadingCard from "./WhatAreYouReadingCard.tsx";
import { useCurrentUserCurrentlyReading } from "../../../hooks/currentlyReading.ts";
import { StyledView } from "../StyledView.tsx";
import { BookPreviewLinkCard } from "../../molecules/BookPreview/Link.tsx";

export default function CurrentlyReading() {
  const { data: currentBooks } = useCurrentUserCurrentlyReading();

  return (
    <StyledView>
      <ScrollView horizontal>
        <XStack gap={"$3"} m={"$3"}>
          <WhatAreYouReadingCard />
          {currentBooks?.map((book) => (
            <BookPreviewLinkCard key={book.id} book={book} maxWidth={"$20"} />
          ))}
        </XStack>
      </ScrollView>
    </StyledView>
  );
}
