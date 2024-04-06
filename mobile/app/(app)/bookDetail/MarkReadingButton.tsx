import React from "react";
import {
  useBookIsCurrentlyBeingRead,
  useMarkNotReading,
  useMarkReading,
} from "../../../hooks/currentlyReading.ts";
import { Button } from "tamagui";
import { ActivityIndicator } from "react-native";
import { MinusCircle, PlusCircle } from "@tamagui/lucide-icons";
import { Book } from "@ursula/shared-types/derived.ts";

interface Props {
  book: Book;
}

export default function MarkReadingButton({ book }: Props) {
  const { data: bookIsBeingRead, isLoading: isBeingReadLoading } =
    useBookIsCurrentlyBeingRead(book.id);
  const { mutate: markNotReading, isLoading: isMarkNotLoading } =
    useMarkNotReading();
  const { mutate: markReading, isLoading: isMarkLoading } = useMarkReading();

  const isLoading = isBeingReadLoading || isMarkNotLoading || isMarkLoading;

  return (
    <Button
      onPress={() => {
        if (bookIsBeingRead) {
          markNotReading(book.id);
        } else {
          markReading({
            book,
          });
        }
      }}
      disabled={isLoading}
      backgroundColor={bookIsBeingRead ? "maroon" : "black"}
      color="white"
      icon={
        isLoading ? (
          <ActivityIndicator size="small" color="white" />
        ) : bookIsBeingRead ? (
          <MinusCircle size={20} color="white" />
        ) : (
          <PlusCircle size={20} color="white" />
        )
      }
    >
      {bookIsBeingRead
        ? "I'm not planning to finish this"
        : "I'm currently reading this"}
    </Button>
  );
}
