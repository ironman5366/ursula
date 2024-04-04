import React from "react";
import { SizableText, Text, XStack, YStack } from "tamagui";
import { useReadingList } from "../../../../hooks/readingList.ts";
import { useSession } from "../../../../contexts/SessionContext.ts";
import { ActivityIndicator, ScrollView } from "react-native";
import BookPreviewCard from "../../../molecules/BookPreview/Card.tsx";
import { Book } from "@ursula/shared-types/derived.ts";

interface Props {
  selectBook: (book: Book) => void;
}

export default function AddBookFromReadingList({ selectBook }: Props) {
  const { session } = useSession();
  const { data: readingListItems, isLoading } = useReadingList(session.user.id);

  if (isLoading) {
    return <></>;
  }

  if (Array.isArray(readingListItems) && readingListItems.length === 0) {
    return (
      <>
        <SizableText size={"$5"} textAlign={"center"}>
          Your reading list is empty
        </SizableText>
      </>
    );
  }

  return (
    <YStack gap={"$3"}>
      <Text textAlign={"center"} fontWeight={"600"} fontSize={"$5"}>
        From Your Reading List
      </Text>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <ScrollView horizontal>
          <XStack gap={"$2"}>
            {readingListItems.map((i) => (
              <BookPreviewCard
                key={i.book.id}
                book={i.book}
                width={"$12"}
                onPress={() => selectBook(i.book)}
              />
            ))}
          </XStack>
        </ScrollView>
      )}
    </YStack>
  );
}
