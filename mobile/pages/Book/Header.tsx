import React from "react";
import { Book } from "@ursula/shared-types/derived.ts";
import { YStack } from "tamagui";
import BookImage from "../../components/atoms/book/BookImage.tsx";
import { BlurView } from "expo-blur";
import { TitleText } from "../../components/atoms/TitleText.tsx";
import BookAuthors from "../../components/atoms/book/BookAuthors.tsx";
import BookGenres from "../../components/atoms/book/BookGenres.tsx";

export default function BookHeader({ book }: { book: Book }) {
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
          <BookAuthors bookId={book.id} />
          <BookGenres book={book} />
        </YStack>
      </BlurView>
    </YStack>
  );
}
