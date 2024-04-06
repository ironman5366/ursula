import React from "react";
import { Book } from "@ursula/shared-types/derived.ts";
import { Stack } from "expo-router";
import { Text, XStack, YStack } from "tamagui";
import ReadingListButton from "../../app/(app)/bookDetail/ReadingListButton.tsx";
import ReviewButton from "../../app/(app)/bookDetail/ReviewButton.tsx";
import { StyledText } from "../../components/atoms/StyledText.tsx";
import BookHeader from "./Header.tsx";
import { ActivityIndicator, ScrollView } from "react-native";
import MarkReadingButton from "../../app/(app)/bookDetail/MarkReadingButton.tsx";
import { useUserBookReview } from "../../hooks/reviews.ts";
import { useBookSocialFeed } from "../../hooks/activities.ts";
import ActivityFeed from "../../components/organisms/ActivityFeed";

interface Props {
  book: Book;
}

export default function BookDetailPage({ book }: Props) {
  const { data: review } = useUserBookReview(book.id);
  const { data: activities, isLoading } = useBookSocialFeed(book.id);

  return (
    <>
      <Stack.Screen
        options={{
          title: book.title,
          headerTransparent: true,
        }}
      />
      <YStack style={{ flex: 1 }}>
        <BookHeader book={book} />
        <XStack
          mx="auto"
          my="$3"
          alignContent="space-around"
          justifyContent="space-around"
          gap="$3"
          flexWrap={"wrap"}
        >
          {!review && <ReadingListButton bookId={book.id} />}
          <ReviewButton bookId={book.id} />
          {!review && <MarkReadingButton book={book} />}
        </XStack>
        <ScrollView>
          <YStack px="$3" py="$3" gap={"$2"} alignItems={"center"}>
            <StyledText>{book.description}</StyledText>
            {isLoading && <ActivityIndicator size={"small"} />}
            {Array.isArray(activities) && activities.length >= 1 && (
              <>
                <Text fontSize={"$5"} fontWeight={"bold"}>
                  Your Friends
                </Text>
                <ActivityFeed activities={activities} />
              </>
            )}
          </YStack>
        </ScrollView>
      </YStack>
    </>
  );
}
