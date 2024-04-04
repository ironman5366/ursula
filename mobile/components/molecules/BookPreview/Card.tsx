import React, { ComponentProps, forwardRef } from "react";
import { Book } from "@ursula/shared-types/derived.ts";
import { Card, Text, XStack, YStack, View } from "tamagui";
import BookAuthors from "../../atoms/book/BookAuthors.tsx";
import BookImage from "../../atoms/book/BookImage.tsx";
import ReadingListButton from "../../../app/(app)/bookDetail/ReadingListButton.tsx";
import ReviewButton from "../../../app/(app)/bookDetail/ReviewButton.tsx";
import { BlurView } from "expo-blur";
import { Link, router } from "expo-router";

interface Props extends ComponentProps<typeof Card> {
  book: Book;
  withDescription?: boolean;
}

function BookPreviewCard({ book, withDescription, ...props }: Props, ref) {
  return (
    <Card
      ref={ref}
      position="relative"
      borderWidth={2}
      borderColor="#00000044"
      overflow={"hidden"}
      {...props}
    >
      <YStack
        position="absolute"
        flexShrink={0}
        width="100%"
        top={0}
        alignSelf="center"
        bottom={0}
        zIndex={0}
        overflow="hidden"
      >
        <BookImage book={book} size={250} />
      </YStack>

      <BlurView
        intensity={95}
        tint="extraLight"
        style={{
          zIndex: 3,
          overflow: "hidden",
        }}
      >
        <YStack gap="$4" p="$2">
          <XStack gap={"$3"} flexWrap={"wrap"}>
            <BookImage book={book} size={75} />
            <YStack maxWidth={"80%"} pt="$2">
              <Text fontSize="$5" fontWeight="700">
                {book.title}
              </Text>
              <BookAuthors bookId={book.id} />
              {withDescription && book.description && (
                <Text numberOfLines={1} ellipsizeMode={"middle"}>
                  {book.description}
                </Text>
              )}
            </YStack>
          </XStack>
        </YStack>
      </BlurView>
    </Card>
  );
}

export default forwardRef(BookPreviewCard);
