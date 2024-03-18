import React, { ComponentProps } from "react";
import { Link } from "expo-router";
import BookPreviewRow from "./Row.tsx";

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
