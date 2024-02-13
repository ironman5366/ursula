import React from "react";
import { useNavigation } from "expo-router";
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  View,
  Text,
} from "react-native";
import { TitleText } from "../components/atoms/TitleText";
import BookImage from "../components/atoms/BookImage";
import useIdParam from "../hooks/useIdParam";
import useBook from "../hooks/useBook";

export default function BookDetail() {
  const id = useIdParam();
  const { data: book } = useBook(id);

  if (book) {
    return (
      <View style={styles.container}>
        <TitleText>{book.name}</TitleText>
        <BookImage book={book} size={250} />
        <Button title={"Add to your list"} />
        <Button title="Review" onPress={() => {}} />
        <Text>{book.description}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size={"large"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
  },
  subtitle: {},
});
