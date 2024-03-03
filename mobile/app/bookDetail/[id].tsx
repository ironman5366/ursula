import React from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import { Link, Stack } from "expo-router";
import useBook from "../../hooks/useBook.ts";
import { TitleText } from "../../components/atoms/TitleText.tsx";
import BookImage from "../../components/atoms/BookImage.tsx";
import ReadingListButton from "./ReadingListButton.tsx";
import CardButton from "../../components/atoms/CardButton.tsx";
import useIdParam from "../../hooks/useIdParam.ts";
import LoadingScreen from "../../components/atoms/LoadingScreen.tsx";
import ReviewButton from "./ReviewButton.tsx";

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
          title: book.name,
        }}
      />
      <View style={styles.container}>
        <View style={styles.header}>
          <TitleText
            style={{
              textAlign: "center",
            }}
          >
            {book.name}
          </TitleText>
          <BookImage book={book} size={256} />
        </View>
        <View style={styles.buttons}>
          <ReadingListButton bookId={book.id} />
          <ReviewButton bookId={book.id} />
        </View>
      </View>
      <ScrollView style={styles.container}>
        <View style={styles.meta}>
          <Text>{book.description}</Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  buttons: {
    flex: 3,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-evenly",
    minHeight: "10%",
  },
  meta: {},
});
