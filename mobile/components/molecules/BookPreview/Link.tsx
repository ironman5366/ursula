import React, {
  ComponentProps,
  ComponentPropsWithoutRef,
  PropsWithChildren,
} from "react";
import { Link } from "expo-router";
import BookPreviewRow from "./Row.tsx";
import { Book } from "@ursula/shared-types/derived.ts";
import BookPreviewCard from "./Card.tsx";

interface Props {
  book: Book;
  replace?: boolean;
}

export function BookPreviewLinkWrapper({
  book,
  replace,
  children,
}: Props & PropsWithChildren<any>) {
  return (
    <Link href={`/book/${book.id}`} replace={replace}>
      {children}
    </Link>
  );
}

export function BookPreviewLinkRow({
  book,
  replace,
  ...props
}: Props & ComponentProps<typeof BookPreviewRow>) {
  return (
    <BookPreviewLinkWrapper book={book}>
      <BookPreviewRow book={book} {...props} />
    </BookPreviewLinkWrapper>
  );
}

export function BookPreviewLinkCard({
  book,
  replace,
  ...props
}: Props & ComponentProps<typeof BookPreviewCard>) {
  return (
    <BookPreviewLinkWrapper book={book}>
      <BookPreviewCard book={book} {...props} />
    </BookPreviewLinkWrapper>
  );
}
