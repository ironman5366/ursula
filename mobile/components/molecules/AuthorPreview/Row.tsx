import React, { ComponentProps, forwardRef } from "react";
import { ListItem } from "tamagui";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Author } from "@ursula/shared-types/derived.ts";

interface Props {
  author: Author;
  onPress?: ComponentProps<typeof ListItem>["onPress"];
}

function AuthorPreviewRow({ author, onPress }: Props, ref) {
  return (
    <ListItem ref={ref} onPress={onPress} icon={<Ionicons name={"pencil"} />}>
      {author.name}
    </ListItem>
  );
}

export default forwardRef(AuthorPreviewRow);
