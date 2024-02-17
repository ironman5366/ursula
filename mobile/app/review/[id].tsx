import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, TextInput } from "react-native";
import { ThemedView } from "../../components/organisms/Themed.tsx";
import useIdParam from "../../hooks/useIdParam.ts";
import useBook from "../../hooks/useBook.ts";
import { useCreateReview } from "../../hooks/reviews.ts";
import { router, Stack } from "expo-router";
import StyledButton from "../../components/organisms/StyledButton.tsx";
import { StyledText } from "../../components/atoms/StyledText.tsx";
import LoadingScreen from "../../components/atoms/LoadingScreen.tsx";

export default function Review() {
  const id = useIdParam();
  const { data: book } = useBook(id);
  const [note, setNote] = useState<string | null>(null);
  const { mutate, data } = useCreateReview();

  useEffect(() => {
    if (data) {
      // Nota bene that this is a *review* id, not a book id
      router.replace(`/rank/${data.id}/`);
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
      <ThemedView style={styles.container}>
        <StyledText>What did you think about {book.name}?</StyledText>
        <TextInput
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
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
