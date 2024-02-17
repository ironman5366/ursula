import React, { ComponentProps } from "react";
import BookPreviewRow from "../molecules/BookPreviewRow.tsx";
import { Link } from "expo-router";

export default function BookPreviewLink({
  book,
  ...props
}: ComponentProps<typeof BookPreviewRow>) {
  return (
    <Link href={`/bookDetail/${book.id}`} asChild>
      <BookPreviewRow book={book} {...props} />
    </Link>
  );
}
