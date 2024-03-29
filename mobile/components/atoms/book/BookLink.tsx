import React from "react";
import { StyledLink } from "../StyledLink.tsx";

interface Props {
  book: {
    id: number;
    title: string;
  };
  replace?: boolean;
}

export function BookLink({ book, replace }: Props) {
  return (
    <StyledLink href={`/bookDetail/${book.id}`} replace={replace}>
      {book.title}
    </StyledLink>
  );
}
