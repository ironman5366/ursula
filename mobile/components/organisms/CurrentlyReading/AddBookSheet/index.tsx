import React, { ComponentProps, useState } from "react";
import { YStack } from "tamagui";
import StyledSheet from "../../StyledSheet.tsx";
import { AddBookSearch } from "./AddBookSearch.tsx";
import { Book } from "@ursula/shared-types/derived.ts";
import AddBookFromReadingList from "./AddBookFromReadingList.tsx";

export default function AddBookSheet({
  onOpenChange,
  ...props
}: Omit<ComponentProps<typeof StyledSheet>, "children">) {
  const [selectedBook, selectBook] = useState<Book | null>(null);

  return (
    <StyledSheet onOpenChange={onOpenChange} {...props}>
      <YStack gap={"$3"}>
        <AddBookSearch selectBook={selectBook} onOpenChange={onOpenChange} />
        <AddBookFromReadingList />
      </YStack>
    </StyledSheet>
  );
}
