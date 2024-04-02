import React, { ComponentProps, forwardRef } from "react";
import { Book } from "@ursula/shared-types/derived.ts";
import { Card, Text, XStack, YStack } from "tamagui";
import BookAuthors from "../../atoms/book/BookAuthors.tsx";
import BookImage from "../../atoms/book/BookImage.tsx";
import ReadingListButton from "../../../app/(app)/bookDetail/ReadingListButton.tsx";
import ReviewButton from "../../../app/(app)/bookDetail/ReviewButton.tsx";
import { BlurView } from "expo-blur";
import { Link, router } from "expo-router";

interface Props extends ComponentProps<typeof Card> {
  book: Book;
}

function BookPreviewCard({ book, ...props }: Props, ref) {
  return (
    <Link asChild href={`/bookDetail/${book.id}`}>
      <Card
        ref={ref}
        position="relative"
        overflow="hidden"
        ml="$6"
        borderWidth={2}
        borderColor="#00000044"
        mr="$2"
      >
        <YStack
          position="absolute"
          flex={100}
          flexGrow={100}
          flexShrink={0}
          width="100%"
          height="100%"
          top={0}
          alignSelf="center"
          bottom={0}
          zIndex={0}
          overflow="hidden"
        >
          <BookImage book={book} size={700} />
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
            <XStack gap={"$3"}>
              <BookImage book={book} size={75} />
              <YStack maxWidth={"80%"} pt="$2">
                <Text fontSize="$5" fontWeight="700">
                  {book.title}
                </Text>
                <BookAuthors bookId={book.id} />
                {book.description && (
                  <Text numberOfLines={1} ellipsizeMode={"middle"}>
                    {book.description}
                  </Text>
                )}
              </YStack>
            </XStack>
          </YStack>
        </BlurView>
      </Card>
    </Link>
  );
}

export default forwardRef(BookPreviewCard);
