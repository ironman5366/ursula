import React from "react";
import { YStack } from "tamagui";
import { AddBookSearch } from "./AddBookSearch.tsx";
import AddBookFromReadingList from "./AddBookFromReadingList.tsx";
import { Book } from "@ursula/shared-types/derived.ts";
import { ScrollView } from "react-native";

interface Props {
  selectBook: (book: Book) => void;
  onOpenChange: (open: boolean) => void;
}

export function FindAddBook({ selectBook, onOpenChange }: Props) {
  return (
    <YStack gap={"$3"}>
      <AddBookSearch selectBook={selectBook} onOpenChange={onOpenChange} />
      <AddBookFromReadingList selectBook={selectBook} />
    </YStack>
  );
}
