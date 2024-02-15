import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Text,
  ScrollView,
} from "react-native";
import { TitleText } from "../components/atoms/TitleText.tsx";
import BookImage from "../components/atoms/BookImage.tsx";
import useIdParam from "../hooks/useIdParam.ts";
import useBook from "../hooks/useBook.ts";
import CardButton from "../components/atoms/CardButton.tsx";
import ReadingListButton from "./(bookDetail)/ReadingListButton.tsx";

export default function BookDetail() {
  const id = useIdParam();
  const { data: book } = useBook(id);

  if (!book) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
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
        <CardButton title={"Review"} />
      </View>
      <ScrollView>
        <View style={styles.meta}>
          <Text>{book.description}</Text>
        </View>
      </ScrollView>
    </View>
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
    flex: 2,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  meta: {},
  loadingContainer: {
    flex: 1,
    alignItems: "center",
  },
});
