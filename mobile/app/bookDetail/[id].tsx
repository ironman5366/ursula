import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Text,
  ScrollView,
} from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import useBook from "../../hooks/useBook.ts";
import { TitleText } from "../../components/atoms/TitleText.tsx";
import BookImage from "../../components/atoms/BookImage.tsx";
import ReadingListButton from "./ReadingListButton.tsx";
import CardButton from "../../components/atoms/CardButton.tsx";

function coerceId(id: string | string[]): number {
  if (Array.isArray(id)) {
    return Number.parseInt(id[0]);
  }
  return Number.parseInt(id);
}

export default function BookDetail() {
  const { id } = useLocalSearchParams();
  const { data: book } = useBook(coerceId(id));

  if (!book) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator />
      </View>
    );
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
          <CardButton title={"Review"} />
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
  },
  meta: {},
  loadingContainer: {
    flex: 1,
    alignItems: "center",
  },
});
