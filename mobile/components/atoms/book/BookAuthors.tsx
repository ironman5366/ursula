import React from "react";
import { useBookAuthors } from "../../../hooks/authors.ts";
import { StyledText } from "../StyledText.tsx";

interface Props {
  bookId: number;
}

export default function BookAuthors({ bookId }: Props) {
  const { data: authors, isSuccess } = useBookAuthors(bookId);
  if (isSuccess) {
    return (
      <StyledText>
        {authors?.map((author) => author?.name || "").join(", ")}
      </StyledText>
    );
  } else {
    return <StyledText>Authors Loading...</StyledText>;
  }
}
