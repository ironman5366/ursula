import React, { useEffect, useState } from "react";
import { StyleSheet, TextInput } from "react-native";
import useNumericIdParam from "../../../hooks/useIdParam.ts";
import useBook from "../../../hooks/useBook.ts";
import { useCreateReview } from "../../../hooks/reviews.ts";
import { router, Stack } from "expo-router";
import StyledButton from "../../../components/organisms/StyledButton.tsx";
import { StyledText } from "../../../components/atoms/StyledText.tsx";
import LoadingScreen from "../../../components/atoms/loaders/LoadingScreen.tsx";
import { StyledView } from "../../../components/organisms/StyledView.tsx";
import StyledInput from "../../../components/atoms/StyledInput.tsx";
import { YStack } from "tamagui";
import BookPreviewCard from "../../../components/molecules/BookPreview/Card.tsx";

export default function Review() {
  const id = useNumericIdParam();
  const { data: book } = useBook(id);
  const [note, setNote] = useState<string | null>(null);
  const { mutate, data } = useCreateReview();

  useEffect(() => {
    if (data) {
      // Nota bene that this is a *review* id, not a book id
      router.replace(`/rank/${data.review.id}/`);
    }
  }, [data]);

  if (!book) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: `Review ${book.title}`,
        }}
      />
      <StyledView style={styles.container}>
        <YStack gap={"$3"}>
          <StyledText>
            What did you think about{" "}
            <StyledText
              style={{
                fontWeight: "bold",
              }}
            >
              {book.title}
            </StyledText>
            ?
          </StyledText>
          <BookPreviewCard book={book} />
          <StyledInput
            style={{
              minWidth: "80%",
            }}
            multiline={true}
            value={note}
            placeholder={"Leave a note (optional)"}
            onChangeText={(text) => setNote(text)}
          />
          <StyledButton
            title={"Submit"}
            onPress={() => {
              mutate({ bookId: book.id, note });
            }}
          />
        </YStack>
      </StyledView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0.5,
    padding: 20,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
});
