import React from "react";
import useBook from "../../hooks/useBook.ts";
import { Link } from "expo-router";
import { StyledText } from "./StyledText.tsx";

interface Props {
  book_id: number;
}

export default function BookLink({ book_id }: Props) {
  const { data: book } = useBook(book_id);

  return (
    <Link href={`/bookDetail/${book_id}`}>
      <StyledText>{book.title}</StyledText>
    </Link>
  );
}
