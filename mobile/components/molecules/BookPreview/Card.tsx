import React, { ComponentProps, forwardRef } from "react";
import { Book } from "@ursula/shared-types/derived.ts";
import { Card, Text, XStack, YStack } from "tamagui";
import BookAuthors from "../../atoms/BookAuthors.tsx";
import BookImage from "../../atoms/BookImage.tsx";
import ReadingListButton from "../../../app/(app)/bookDetail/ReadingListButton.tsx";
import ReviewButton from "../../../app/(app)/bookDetail/ReviewButton.tsx";

interface Props extends ComponentProps<typeof Card> {
  book: Book;
}

function BookPreviewCard({ book, ...props }: Props, ref) {
  return (
    <Card
      borderColor={"$claret"}
      borderWidth={2}
      padding={"$2"}
      alignSelf={"center"}
      maxWidth={"90%"}
      ref={ref}
    >
      <YStack>
        <XStack gap={"$3"}>
          <BookImage book={book} size={75} />
          <YStack maxWidth={"80%"}>
            <Text>{book.title}</Text>
            <BookAuthors bookId={book.id} />
            {book.description && (
              <Text numberOfLines={1} ellipsizeMode={"middle"}>
                {book.description}
              </Text>
            )}
          </YStack>
        </XStack>
        <XStack gap={"$4"}>
          <ReadingListButton bookId={book.id} />
          <ReviewButton bookId={book.id} />
        </XStack>
      </YStack>
    </Card>
  );
}

export default forwardRef(BookPreviewCard);
