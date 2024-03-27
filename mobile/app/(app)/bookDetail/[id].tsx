import { Book } from "@ursula/shared-types/derived.ts";
import { Stack } from "expo-router";
import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { YStack, Image, XStack } from "tamagui";
import BookAuthors from "../../../components/atoms/BookAuthors.tsx";
import BookImage from "../../../components/atoms/BookImage.tsx";
import LoadingScreen from "../../../components/atoms/LoadingScreen.tsx";
import { StyledText } from "../../../components/atoms/StyledText.tsx";
import { TitleText } from "../../../components/atoms/TitleText.tsx";
import useBook from "../../../hooks/useBook.ts";
import useNumericIdParam from "../../../hooks/useIdParam.ts";
import ReadingListButton from "./ReadingListButton.tsx";
import ReviewButton from "./ReviewButton.tsx";
import { BlurView } from "expo-blur";

export default function BookDetail() {
  const id = useNumericIdParam();
  const { data: book } = useBook(id);

  if (!book) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "",
          headerTransparent: true,
        }}
      />
      <YStack>
        <BookHeaderContainer book={book} id={id} />
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
        <YStack px="$3" py="$3">
          <StyledText>{book.description}</StyledText>
        </YStack>
      </YStack>
    </>
  );
}

export function BookHeaderContainer({ book, id }: { book: Book; id: number }) {
  return (
    <YStack position="relative">
      <YStack
        position="absolute"
        flex={100}
        flexGrow={100}
        flexShrink={0}
        alignItems="center"
        width="100%"
        height="100%"
        top={0}
        bottom={0}
        mt="$13"
        zIndex={0}
        overflow="hidden"
      >
        <BookImage book={book} size={350} />
      </YStack>

      <BlurView
        intensity={85}
        style={{
          zIndex: 3,
        }}
      >
        <YStack alignItems="center" pt="$10" pb="$3" mt="$10">
          <BookImage book={book} size={300} />
          <TitleText
            fontSize={30}
            style={{
              maxWidth: "75%",
              marginTop: 20,
              textAlign: "center",
            }}
          >
            {book.title}
          </TitleText>
          <BookAuthors bookId={id} />
        </YStack>
      </BlurView>
    </YStack>
  );
}
