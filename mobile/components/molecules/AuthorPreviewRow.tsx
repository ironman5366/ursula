import React from "react";
import { ListItem } from "tamagui";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Author } from "@ursula/shared-types/derived.ts";

interface Props {
  author: Author;
}

export default function AuthorPreviewRow({ author }: Props) {
  return <ListItem icon={<Ionicons name={"pencil"} />}>{author.name}</ListItem>;
}
