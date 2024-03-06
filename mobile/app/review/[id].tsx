import React, { useEffect, useState } from "react";
import { StyleSheet, TextInput } from "react-native";
import useIdParam from "../../hooks/useIdParam.ts";
import useBook from "../../hooks/useBook.ts";
import { useCreateReview } from "../../hooks/reviews.ts";
import { router, Stack } from "expo-router";
import StyledButton from "../../components/organisms/StyledButton.tsx";
import { StyledText } from "../../components/atoms/StyledText.tsx";
import LoadingScreen from "../../components/atoms/LoadingScreen.tsx";
import { StyledView } from "../../components/organisms/StyledView.tsx";
import StyledInput from "../../components/atoms/StyledInput.tsx";

export default function Review() {
  const id = useIdParam();
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
          title: `Review ${book.name}`,
        }}
      />
      <StyledView style={styles.container}>
        <StyledText>What did you think about {book.name}?</StyledText>
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
