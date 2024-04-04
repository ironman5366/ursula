import React from "react";
import { Button, Card, YStack } from "tamagui";
import { Book } from "@ursula/shared-types/derived.ts";
import { StyledText } from "../../atoms/StyledText.tsx";

interface Props {
  book: Book;
}

export default function CurrentBookCard({ book }: Props) {
  return (
    <Card>
      <Card.Header>
        <StyledText>{book.title}</StyledText>
      </Card.Header>
      <Card.Footer>
        <YStack gap={"$3"}>
          <Button>Post a note</Button>
          <Button>Review</Button>
          <Button>Remove</Button>
        </YStack>
      </Card.Footer>
    </Card>
  );
}
