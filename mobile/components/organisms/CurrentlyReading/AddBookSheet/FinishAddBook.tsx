import React, { useEffect, useState } from "react";
import { Book } from "@ursula/shared-types/derived.ts";
import { useMarkReading } from "../../../../hooks/currentlyReading.ts";
import { Button, YStack } from "tamagui";
import BookPreviewCard from "../../../molecules/BookPreview/Card.tsx";
import MultilineInput from "../../../atoms/inputs/MultilineInput.tsx";
import LoadingScreen from "../../../atoms/loaders/LoadingScreen.tsx";

interface Props {
  onOpenChange: (open: boolean) => void;
  selectBook: (book: Book | null) => void;
  book: Book;
}

export default function FinishAddBook({
  book,
  onOpenChange,
  selectBook,
}: Props) {
  const { mutate: markReading, isLoading, isSuccess } = useMarkReading();
  const [note, setNote] = useState("");

  useEffect(() => {
    if (isSuccess) {
      onOpenChange(false);
      selectBook(null);
    }
  }, [isSuccess]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <YStack gap={"$3"}>
      <BookPreviewCard book={book} />
      <MultilineInput
        placeholder={"Note (optional)"}
        onChangeText={(val) => setNote(val)}
        value={note}
      />
      <Button
        backgroundColor={"$claret"}
        color={"white"}
        onPress={() => {
          markReading({
            book,
            note,
          });
        }}
      >
        Start Reading
      </Button>
    </YStack>
  );
}
