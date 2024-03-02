import React, { ComponentProps } from "react";
import BookPreviewRow from "../molecules/BookPreviewRow.tsx";
import { Link } from "expo-router";

interface Props extends ComponentProps<typeof BookPreviewRow> {
  replace?: boolean;
}

export default function BookPreviewLink({ book, replace, ...props }: Props) {
  return (
    <Link href={`/bookDetail/${book.id}`} asChild replace={replace}>
      <BookPreviewRow book={book} {...props} />
    </Link>
  );
}
