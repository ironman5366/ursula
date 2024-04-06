import React from "react";
import { useBookAuthors } from "../../../hooks/authors.ts";
import { StyledText } from "../StyledText.tsx";
import { XStack } from "tamagui";
import AuthorLink from "../AuthorLink.tsx";

interface Props {
  bookId: number;
}

export default function BookAuthors({ bookId }: Props) {
  const { data: authors, isSuccess } = useBookAuthors(bookId);
  if (isSuccess) {
    return (
      <XStack>
        {authors?.map((author) => (
          <AuthorLink author={author} key={author.id} />
        ))}
      </XStack>
    );
  } else {
    return <StyledText>Authors Loading...</StyledText>;
  }
}
