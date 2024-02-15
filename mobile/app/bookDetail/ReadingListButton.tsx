import React from "react";
import {
  useAddToReadingList,
  useBookInReadingList,
  useRemoveFromReadingList,
} from "../../hooks/readingList.ts";
import CardButton from "../../components/atoms/CardButton.tsx";
import { ActivityIndicator } from "react-native";
import { StyledText } from "../../components/atoms/StyledText.tsx";

interface Props {
  bookId: number;
}

export default function ReadingListButton({ bookId }: Props) {
  const { data: bookInReadingList, isLoading: isFetchLoading } =
    useBookInReadingList(bookId);
  const { mutate: removeFromReadingList, isLoading: isRemoveLoading } =
    useRemoveFromReadingList(bookId);
  const { mutate: addToReadingList, isLoading: isAddLoading } =
    useAddToReadingList(bookId);

  const isLoading = isFetchLoading || isRemoveLoading || isAddLoading;

  return (
    <CardButton
      onPress={() => {
        console.log("Doing reading list action", bookId);
        if (bookInReadingList) {
          removeFromReadingList(bookId);
        } else {
          addToReadingList(bookId);
        }
      }}
    >
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <StyledText>
          {bookInReadingList
            ? "Remove from Reading List"
            : "Add to Reading List"}
        </StyledText>
      )}
    </CardButton>
  );
}
