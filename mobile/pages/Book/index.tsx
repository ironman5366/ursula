import React from "react";
import { Book } from "@ursula/shared-types/derived.ts";
import { Stack } from "expo-router";
import { XStack, YStack } from "tamagui";
import ReadingListButton from "../../app/(app)/bookDetail/ReadingListButton.tsx";
import ReviewButton from "../../app/(app)/bookDetail/ReviewButton.tsx";
import { StyledText } from "../../components/atoms/StyledText.tsx";
import BookHeader from "./Header.tsx";

interface Props {
  book: Book;
}

export default function BookDetailPage({ book }: Props) {
  return (
    <>
      <Stack.Screen
        options={{
          title: "",
          headerTransparent: true,
        }}
      />
      <YStack>
        <BookHeader book={book} />
        <XStack
          mx="auto"
          my="$3"
          alignContent="space-around"
          justifyContent="space-around"
          gap="$3"
        >
          <ReadingListButton bookId={book.id} />
          <ReviewButton bookId={book.id} />
        </XStack>
        <XStack></XStack>
        <YStack px="$3" py="$3">
          <StyledText>{book.description}</StyledText>
        </YStack>
      </YStack>
    </>
  );
}
