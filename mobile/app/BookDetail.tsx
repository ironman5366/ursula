import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Text,
  ScrollView,
} from "react-native";
import { TitleText } from "../components/atoms/TitleText";
import BookImage from "../components/atoms/BookImage";
import useIdParam from "../hooks/useIdParam";
import useBook from "../hooks/useBook";
import CardButton from "../components/atoms/CardButton.tsx";
import { useBookInReadingList } from "../hooks/readingList.ts";

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
        <CardButton title={"Add to your list"} />
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
