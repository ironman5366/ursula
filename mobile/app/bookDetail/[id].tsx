import React from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { Stack } from "expo-router";
import useBook from "../../hooks/useBook.ts";
import { TitleText } from "../../components/atoms/TitleText.tsx";
import BookImage from "../../components/atoms/BookImage.tsx";
import ReadingListButton from "./ReadingListButton.tsx";
import useIdParam from "../../hooks/useIdParam.ts";
import LoadingScreen from "../../components/atoms/LoadingScreen.tsx";
import ReviewButton from "./ReviewButton.tsx";
import { StyledText } from "../../components/atoms/StyledText.tsx";
import { StyledView } from "../../components/organisms/StyledView.tsx";
import BookAuthors from "../../components/atoms/BookAuthors.tsx";

export default function BookDetail() {
  const id = useIdParam();
  const { data: book } = useBook(id);

  if (!book) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: book.title,
        }}
      />
      <StyledView style={styles.container}>
        <View style={styles.header}>
          <BookImage book={book} size={256} />
          <TitleText
            fontSize={20}
            style={{
              textAlign: "center",
            }}
          >
            {book.title}
          </TitleText>
          <BookAuthors bookId={id} />
        </View>
        <View style={styles.buttons}>
          <ReadingListButton bookId={book.id} />
          <ReviewButton bookId={book.id} />
        </View>
        <ScrollView>
          <StyledText>{book.description}</StyledText>
        </ScrollView>
      </StyledView>
    </>
  );
}

const styles = StyleSheet.create({
  bookContainer: {
    flex: 2,
    padding: 10,
  },
  container: {
    flex: 1,
    padding: 10,
  },
  descriptionContainer: {
    flex: 1,
  },
  header: {
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  buttons: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  meta: {},
});
