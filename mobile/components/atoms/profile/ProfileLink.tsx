import React from "react";
import { StyledLink } from "../StyledLink.tsx";

interface Props {
  profile: {
    id: string;
    full_name: string;
  };
}

export default function ProfileLink({ profile: { id, full_name } }: Props) {
  return <StyledLink href={`/profile/${id}`}>{full_name}</StyledLink>;
}
