import { MinusCircle, PlusCircle } from "@tamagui/lucide-icons";
import React from "react";
import { ActivityIndicator } from "react-native";
import { Button } from "tamagui";
import {
  useAddToReadingList,
  useBookInReadingList,
  useRemoveFromReadingList,
} from "../../../hooks/readingList.ts";

interface Props {
  bookId: number;
}

export default function ReadingListButton({ bookId }: Props) {
  const { data: bookInReadingList, isLoading: isFetchLoading } =
    useBookInReadingList(bookId);
  const { mutate: removeFromReadingList, isLoading: isRemoveLoading } =
    useRemoveFromReadingList();
  const { mutate: addToReadingList, isLoading: isAddLoading } =
    useAddToReadingList();

  const isLoading = isFetchLoading || isRemoveLoading || isAddLoading;

  return (
    <Button
      onPress={() => {
        if (bookInReadingList) {
          removeFromReadingList(bookId);
        } else {
          addToReadingList(bookId);
        }
      }}
      disabled={isLoading}
      backgroundColor={bookInReadingList ? "maroon" : "black"}
      color="white"
      icon={
        isLoading ? (
          <ActivityIndicator size="small" color="white" />
        ) : bookInReadingList ? (
          <MinusCircle size={20} color="white" />
        ) : (
          <PlusCircle size={20} color="white" />
        )
      }
    >
      {bookInReadingList ? "Remove from Want to Read" : "Want to Read"}
    </Button>
  );
}
