import React from "react";
import { StyledLink } from "./StyledLink.tsx";

interface Props {
  author: {
    id: number;
    name: string;
  };
  replace?: boolean;
}

export default function AuthorLink({ author, replace }: Props) {
  return (
    <StyledLink href={`/authorDetail/${author.id}`} replace={replace}>
      {author.name}
    </StyledLink>
  );
}
