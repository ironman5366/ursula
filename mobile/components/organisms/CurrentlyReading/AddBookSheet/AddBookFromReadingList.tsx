import React from "react";
import { SizableText, Text, XStack, YStack } from "tamagui";
import { useReadingList } from "../../../../hooks/readingList.ts";
import { useSession } from "../../../../contexts/SessionContext.ts";
import { ActivityIndicator, ScrollView } from "react-native";
import BookPreviewCard from "../../../molecules/BookPreview/Card.tsx";

export default function AddBookFromReadingList() {
  const { session } = useSession();
  const { data: readingListItems, isLoading } = useReadingList(session.user.id);

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
              <BookPreviewCard key={i.book.id} book={i.book} width={"$12"} />
            ))}
          </XStack>
        </ScrollView>
      )}
    </YStack>
  );
}
