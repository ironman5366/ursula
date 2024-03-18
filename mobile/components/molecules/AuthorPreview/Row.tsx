import React, { forwardRef } from "react";
import { ListItem } from "tamagui";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Author } from "@ursula/shared-types/derived.ts";

interface Props {
  author: Author;
}

function AuthorPreviewRow({ author }: Props, ref) {
  return (
    <ListItem ref={ref} icon={<Ionicons name={"pencil"} />}>
      {author.name}
    </ListItem>
  );
}

export default forwardRef(AuthorPreviewRow);
