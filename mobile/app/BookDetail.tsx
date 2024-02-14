import React from "react";
import { ActivityIndicator, StyleSheet, View, Text } from "react-native";
import { TitleText } from "../components/atoms/TitleText";
import BookImage from "../components/atoms/BookImage";
import useIdParam from "../hooks/useIdParam";
import useBook from "../hooks/useBook";
import StyledButton from "../components/atoms/StyledButton.tsx";

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
        <StyledButton title={"Add to your list"} />
        <StyledButton title={"Review"} />
      </View>
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
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
  },
});
